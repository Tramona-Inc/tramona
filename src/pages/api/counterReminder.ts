import { type NextApiResponse } from "next";

import { db } from "@/server/db";
import {
  requestGroups,
  requests,
  users,
  counters,
  groups,
  bids,
  properties,
} from "@/server/db/schema";
import { eq, and, ne, gte, isNotNull, count, lt, is, desc } from "drizzle-orm";

import { sendText, sendWhatsApp } from "@/server/server-utils";
import { plural } from "@/utils/utils";
import { sub } from "date-fns";
import { Philosopher } from "next/font/google";
import { PhoneNumber } from "react-phone-number-input";

// "request" means request group in this code

export default async function handler(res: NextApiResponse) {
  const mostRecentCounterPerBid = await db
    .select({
      bidId: counters.bidId,
      userId: counters.userId,
      createdAt: counters.createdAt,
      counterAmount: counters.counterAmount,
      propertyName: properties.name,
    })
    .from(counters)
    .leftJoin(properties, eq(counters.propertyId, properties.id))
    .groupBy(
      counters.bidId,
      counters.userId,
      counters.createdAt,
      counters.counterAmount,
      properties.name,
    )
    .orderBy(desc(counters.createdAt))
    .where(gte(counters.createdAt, sub(new Date(), { hours: 1 })))
    .limit(1);

  try {
    for (const bid of mostRecentCounterPerBid) {
      const usersWithUnconfirmedRequests = await db
        .selectDistinct({
          isWhatsApp: users.isWhatsApp,
          phoneNumber: users.phoneNumber,
        })
        .from(groups)
        .leftJoin(bids, eq(groups.id, bids.madeByGroupId))
        .leftJoin(users, eq(groups.ownerId, users.id))
        .where(and(eq(bids.id, bid.bidId), ne(groups.ownerId, bid.userId)))

      for (const user of usersWithUnconfirmedRequests) {
        if (user.isWhatsApp) {
          await sendWhatsApp({
            templateId: "HX82b075be3d74f02e45957a453fd48cef",
            to: user.phoneNumber!,
            numRequests: user.numUnconfirmedRequests,
            url: url,
          });
        } else {
          await sendText({
            to: user.phoneNumber!,
            content: `Tramona: You have 3 hours left to respond to the (price) counter offer that the host has sent for (property title). Make sure to respond or you will lose out on the exclusive offer.`,
          });
        }
      }
    }
    res.status(200).send("Cron job executed successfully.");
  } catch (error) {
    res.status(500).send("An error occurred during cron job execution.");
  }
}
