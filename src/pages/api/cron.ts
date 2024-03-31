import { type NextApiRequest, type NextApiResponse } from "next";

import { db } from "@/server/db";
import { requestGroups, requests, users } from "@/server/db/schema";
import { eq, and, isNotNull, count, lt } from "drizzle-orm";

import { sendText, sendWhatsApp } from "@/server/server-utils";
import { plural } from "@/utils/utils";
import { sub } from "date-fns";

// "request" means request group in this code

export default async function cron(req: NextApiRequest, res: NextApiResponse) {
  const usersWithUnconfirmedRequests = await db
    .select({
      phoneNumber: users.phoneNumber,
      isWhatsApp: users.isWhatsApp,
      numUnconfirmedRequests: count(requests.id),
    })
    .from(requestGroups)
    .innerJoin(users, eq(requestGroups.createdByUserId, users.id))
    .where(
      and(
        eq(requestGroups.hasApproved, false),
        isNotNull(users.phoneNumber),
        lt(requests.createdAt, sub(new Date(), { days: 1 })),
      ),
    )
    .groupBy(users.id);

  try {
    for (const user of usersWithUnconfirmedRequests) {
      const url = `${process.env.NEXTAUTH_URL}/requests`;
      if (user.isWhatsApp) {
        await sendWhatsApp({
          templateId: "HX82b075be3d74f02e45957a453fd48cef",
          to: user.phoneNumber!,
          numRequests: user.numUnconfirmedRequests,
          url: url,
        });
      } else {
        //const url = `${process.env.NEXTAUTH_URL}/requests/${request.id}`;
        await sendText({
          to: user.phoneNumber!,
          content: `Tramona: You have ${plural(user.numUnconfirmedRequests, "unconfirmed request")}! Please tap below to confirm your ${plural(user.numUnconfirmedRequests, "request")} so we can get you the best travel deals. ${url}`,
        });
      }
    }

    await db
      .update(requestGroups)
      .set({ haveSentFollowUp: true })
      .where(eq(requestGroups.haveSentFollowUp, false));

    res.status(200).send("Cron job executed successfully.");
  } catch (error) {
    res.status(500).send("An error occurred during cron job execution.");
  }
}
