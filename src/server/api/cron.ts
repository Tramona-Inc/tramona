import { api } from "@/utils/api";
import { env } from "@/env";
import { db } from "@/server/db";
import { users, requests } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { sendText } from "@/server/server-utils";

async function cronJob() {
  const usersWithUnconfirmedRequests = await db
    .selectDistinct({ id: users.id })
    .from(users)
    .leftJoin(requests, eq(users.id, requests.userId))
    .where(eq(requests.hasApproved, false));

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
          ///const userPhoneNumber = await db.select({phoneNumber: users.phoneNumber}).from(users).where(eq(users.id, user.id)).limit(1);

          const userData = await db.query.users.findFirst({
            columns: {
              phoneNumber: true
            },
            where: eq(users.id, user.id),
          });

          if (userData) {
            await sendText({
              to: userData.phoneNumber!,
              content: `Tramona: You have an unconfirmed request to ${request.location} from ${formattedCheckIn} to ${formattedCheckOut}. Please [click here](${url}) to return to the site to confirm your request so we can get you the best travel deals.`,
            });
          }

          await db
            .update(requests)
            .set({ haveSentFollowUp: true }) // Update the hasApproved field to true
            .where(eq(requests.id, request.id));

          return;
        }
      }
      // Send Twilio message for this request
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
}

// Function to check if a date is older than 24 hours
function isOlderThan24Hours(createdAt: Date, currentTime: Date) {
  const timeDifference = currentTime.getTime() - new Date(createdAt).getTime();
  const hoursDifference = timeDifference / (1000 * 3600); // Convert milliseconds to hours
  return hoursDifference >= 24;
}

// Function to send Twilio message for a request

await cronJob();
