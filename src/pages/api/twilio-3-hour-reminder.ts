import { type NextApiResponse } from "next";

import { db } from "@/server/db";
import { users, groups, bids, groupMembers } from "@/server/db/schema";
import { eq, and, ne, sql, inArray } from "drizzle-orm";

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
      const groupsWithUnconfirmedRequests = await db
        .select({
          id: groups.id,
        })
        .from(groups)
        .leftJoin(bids, eq(groups.id, bids.madeByGroupId))
        .where(and(eq(bids.id, bid.bid_id), ne(groups.ownerId, bid.user_id)));

      const groupMembersWithUnconfirmedRequests = await db
        .select({
          userId: groupMembers.userId,
          isWhatsApp: users.isWhatsApp,
          phoneNumber: users.phoneNumber,
          isBurner: users.isBurner,
        })
        .from(groupMembers)
        .leftJoin(users, eq(groupMembers.userId, users.id))
        .where(inArray(groupMembers.groupId, groupsWithUnconfirmedRequests.map((group) => group.id)));

      // const usersWithUnconfirmedRequests = await db
      //   .selectDistinct({
      //     isWhatsApp: users.isWhatsApp,
      //     phoneNumber: users.phoneNumber,
      //     userId: users.id,
      //   })
      //   .from(groups)
      //   .leftJoin(bids, eq(groups.id, bids.madeByGroupId))
      //   .leftJoin(users, eq(groups.ownerId, users.id))
      //   .where(and(eq(bids.id, bid.bid_id), ne(groups.ownerId, bid.user_id)));

      for (const member of groupMembersWithUnconfirmedRequests) {
        if (member.isBurner) {
          continue;
        }
        if (member.isWhatsApp) {
          await sendWhatsApp({
            templateId: "HX5a68298da1bf273a3e5fcb1211b17d0a",
            to: member.phoneNumber!,
          });
        } else {
          await sendText({
            to: member.phoneNumber!,
            content: `Tramona: You have 3 hours left to respond to a counter offer that the host has sent you. Make sure to respond or you will lose out on the exclusive offer.`,
          });
        }
      }
    }
    res.status(200).send("Cron job executed successfully.");
  } catch (error) {
    res.status(500).send("An error occurred during cron job execution.");
  }
}
