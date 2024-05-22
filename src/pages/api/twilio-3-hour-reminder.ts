import { type NextApiResponse } from "next";

import { db } from "@/server/db";
import { users, groups, bids } from "@/server/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";

import { sendText, sendWhatsApp } from "@/server/server-utils";

// "request" means request group in this code

export default async function handler(res: NextApiResponse) {
  const mostRecentCounterPerBid = await db.execute<{
    bid_id: number;
    user_id: string;
  }>(sql`
    SELECT DISTINCT ON (user_id) bid_id, user_id, created_at, counter_amount, name
    FROM (
      SELECT
        c.bid_id,
        c.user_id,
        c.created_at,
        c.counter_amount,
        p.name,
        ROW_NUMBER() OVER (PARTITION BY c.bid_id ORDER BY c.created_at DESC) AS rn
      FROM
        counters c
      JOIN
        properties p ON c.property_id = p.id
      WHERE
        c.created_at >= DATE_TRUNC('hour', NOW()) - INTERVAL '21 HOUR'
        AND c.created_at < DATE_TRUNC('hour', NOW()) - INTERVAL '20 HOUR'
    ) sub
    WHERE rn = 1
    ORDER BY user_id, created_at DESC
  `);
  try {
    for (const bid of mostRecentCounterPerBid) {
      const usersWithUnconfirmedRequests = await db
        .selectDistinct({
          isWhatsApp: users.isWhatsApp,
          phoneNumber: users.phoneNumber,
          userId: users.id,
        })
        .from(groups)
        .leftJoin(bids, eq(groups.id, bids.madeByGroupId))
        .leftJoin(users, eq(groups.ownerId, users.id))
        .where(and(eq(bids.id, bid.bid_id), ne(groups.ownerId, bid.user_id)));

      for (const user of usersWithUnconfirmedRequests) {
        if (user.isWhatsApp) {
          await sendWhatsApp({
            templateId: "HXd7858859fbb7fd0b5b4fa4467304bc3c",
            to: user.phoneNumber!,
          });
        } else {
          await sendText({
            to: user.phoneNumber!,
            content: `Tramona: You have 3 hours left to respond to a counter offer that the host has sent for a property. Make sure to respond or you will lose out on the exclusive offer.`,
          });
        }
      }
    }
    res.status(200).send("Cron job executed successfully.");
  } catch (error) {
    res.status(500).send("An error occurred during cron job execution.");
  }
}
