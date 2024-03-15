import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "@/env";

import { db } from "@/server/db";
import { requests, users } from "@/server/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";

import { sendText } from "@/server/server-utils";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const usersWithUnconfirmedRequests = await db
    .selectDistinctOn([users.id], {
      id: users.id,
      phoneNumber: users.phoneNumber,
    })
    .from(users)
    .leftJoin(requests, eq(users.id, requests.userId))
    .where(and(eq(requests.hasApproved, false), isNotNull(users.phoneNumber)));

  try {
    // Get the current time
    const currentTime = new Date();

    // Iterate through each request
    if (!requests) return;
    for (const user of usersWithUnconfirmedRequests) {
      const unconfirmedRequests = await db
        .select()
        .from(requests)
        .where(
          and(eq(requests.userId, user.id), eq(requests.hasApproved, false)),
        );

      for (const request of unconfirmedRequests) {
        if (
          isOlderThan24Hours(request.createdAt, currentTime) &&
          !request.haveSentFollowUp
        ) {
          const url = `${env.NEXTAUTH_URL}/requests/${request.id}`;
          // Check if the request is older than 24 hours and has not been approved
          const formattedCheckIn = new Date(request.checkIn).toLocaleDateString(
            "en-US",
            {
              month: "short", // Short month name (e.g., "Feb")
              day: "2-digit", // Two-digit day (e.g., "27")
              year: "numeric", // Full year (e.g., "2024")
            },
          );

          const formattedCheckOut = new Date(
            request.checkOut,
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          await sendText({
            to: user.phoneNumber!,
            content: `Tramona: You have an unconfirmed request to ${request.location} from ${formattedCheckIn} to ${formattedCheckOut}. Please click the link below to return to the site to confirm your request so we can get you the best travel deals. ${url}`,
          });

          await db
            .update(requests)
            .set({ haveSentFollowUp: true }) // Update the hasApproved field to true
            .where(eq(requests.id, request.id));

          return;
        }
      }
      // Send Twilio message for this request
    }
    res.status(200).send("Cron job executed successfully.");
  } catch (error) {
    res.status(500).send("An error occurred during cron job execution.");
  }
};

// Function to check if a date is older than 24 hours

function isOlderThan24Hours(createdAt: Date, currentTime: Date) {
  const timeDifference = currentTime.getTime() - new Date(createdAt).getTime();
  const hoursDifference = timeDifference / (1000 * 3600);
  return hoursDifference >= 24;
}
