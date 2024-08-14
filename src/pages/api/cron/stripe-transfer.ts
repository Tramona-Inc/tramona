import type { NextApiRequest, NextApiResponse } from "next";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../../../server/db";
import { hostProfiles, trips } from "../../../server/db/schema/index";
import { createPayHostTransfer } from "../utils/stripe-utils";
import { sendSlackMessage } from "../../../server/slack";
// Your custom utility to create Stripe transfer

export default async function handler() {
  //will run every hour
  try {
    const now = new Date().toISOString();

    // Fetch bookings that are scheduled for payout
    const TripsAfter24HourCheckIn = await db.query.trips.findMany({
      with: {
        offer: {
          columns: {
            totalPrice: true,
          },
        },
        property: {
          columns: {
            hostId: true,
          },
        },
      },
      where: and(
        eq(trips.hostPayed, false),
        sql`${trips.checkIn} <= ${sql`(${now}::timestamp - interval '24 hours')`}`,
      ),
    });

    // Process each booking and create a transfer made an array in case host has multiple trips within 24 hours
    for (const trip of TripsAfter24HourCheckIn) {
      const hostAccount = await db.query.hostProfiles.findFirst({
        where: eq(hostProfiles.userId, trip.property.hostId!),
      });
      if (!hostAccount) {
        console.log("SKIIPPPPEEDD");
        continue;
      }
      await createPayHostTransfer({
        amount: trip.offer!.totalPrice,
        destination: hostAccount.stripeAccountId!,
        tripId: trip.id.toString(),
      });
      sendSlackMessage(
        [
          `A host has been paid for booking ${trip.id} that has passed the 24-hour check-in window.`,
          `Host: ${hostAccount.userId} was paid a total of ${trip.offer!.totalPrice}`,
          `Just using this because i want to test the payout job`,
        ].join("\n"),
      );
    }
  } catch (error) {
    console.error("Error scheduling transfer:", error);
    sendSlackMessage(
      [
        `STRIPE HOST PAYOUT ERROR: `,
        `A host has not been paid for bookingthat has passed the 24-hour check-in window.`,
        `Please check the stripe logs for more information`,
      ].join("\n"),
    );
  }
}
