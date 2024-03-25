import { type NextApiRequest, type NextApiResponse } from "next";

import { db } from "@/server/db";
import { groupMembers, groups, requests, users } from "@/server/db/schema";
import { eq, and, isNotNull, count, lt } from "drizzle-orm";

import { sendText, sendWhatsApp } from "@/server/server-utils";
import { plural } from "@/utils/utils";
import { sub } from "date-fns";

export default async function cron(req: NextApiRequest, res: NextApiResponse) {
  const result = await db
    .select({
      phoneNumber: users.phoneNumber,
      isWhatsApp: users.isWhatsApp,
      numUnconfirmedRequests: count(requests.id),
    })
    .from(groups)
    .leftJoin(groupMembers, eq(groups.id, groupMembers.groupId))
    .leftJoin(requests, eq(groupMembers.groupId, requests.madeByGroupId))
    .leftJoin(users, eq(groupMembers.userId, users.id))
    .where(
      and(
        eq(requests.hasApproved, false),
        eq(groupMembers.isOwner, true),
        isNotNull(users.phoneNumber),
        lt(requests.createdAt, sub(new Date(), { days: 1 })),
      ),
    )
    .groupBy(groupMembers.userId);

  try {
    for (const { phoneNumber, numUnconfirmedRequests, isWhatsApp } of result) {
      const url = `${process.env.NEXTAUTH_URL}/requests`;
      if (isWhatsApp) {
        await sendWhatsApp({
          templateId: 'HX82b075be3d74f02e45957a453fd48cef',
          to: phoneNumber!,
          numRequests: numUnconfirmedRequests,
          url: url,
        })
      } else {
        //const url = `${process.env.NEXTAUTH_URL}/requests/${request.id}`;
        await sendText({
          to: phoneNumber!,
          content: `Tramona: You have ${plural(numUnconfirmedRequests, "unconfirmed request")}! Please tap below to confirm your ${plural(numUnconfirmedRequests, "request")} so we can get you the best travel deals. ${url}`,
        });
      }
    }

    await db
      .update(requests)
      .set({ haveSentFollowUp: true })
      .where(eq(requests.haveSentFollowUp, false));

    res.status(200).send("Cron job executed successfully.");
  } catch (error) {
    res.status(500).send("An error occurred during cron job execution.");
  }
}
