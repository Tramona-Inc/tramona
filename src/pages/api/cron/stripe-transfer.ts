import { eq, and, sql, isNull, isNotNull } from "drizzle-orm";
import { db } from "../../../server/db";
import { trips } from "../../../server/db/schema/index";
import { createPayHostTransfer } from "@/utils/stripe-utils";
import { sendSlackMessage } from "../../../server/slack";
// Your custom utility to create Stripe transfer

export default async function handler() {
  //will run every hour
  const now = new Date().toISOString();

  // Fetch bookings that are scheduled for payout
  try {
    const TripsAfter24HourCheckIn = await db.query.trips.findMany({
      with: {
        offer: {
          columns: { hostPayout: true },
        },
        property: {
          with: { hostTeam: { with: { owner: true } } },
        },
      },
      where: and(
        isNull(trips.hostPayed),
        isNotNull(trips.paymentCaptured),
        eq(trips.tripsStatus, "Booked"),
        sql`${trips.checkIn} <= ${sql`(${now}::timestamp - interval '24 hours')`}`,
      ),
    });

    // Process each booking and create a transfer made an array in case host has multiple trips within 24 hours
    if (TripsAfter24HourCheckIn.length >= 1) {
      for (const trip of TripsAfter24HourCheckIn) {
        await createPayHostTransfer({
          amount: trip.offer!.hostPayout,
          destination: trip.property.hostTeam.owner.stripeConnectId!,
          tripId: trip.id.toString(),
        });
        await sendSlackMessage({
          channel: "tramona-bot",
          text: [
            `A host has been paid for booking ${trip.id} that has passed the 24-hour check-in window.`,
            `Host: ${trip.property.hostTeam.owner.firstName} was paid a total of ${trip.offer!.hostPayout}`,
            `Just using this because i want to test the payout job`,
          ].join("\n"),
        });
      }
    } else {
      await sendSlackMessage({
        isProductionOnly: true,
        channel: "tramona-bot",
        text: [`No Trips to pay out`].join("\n"),
      });
    }
  } catch (error) {
    console.log("Error scheduling transfer:", error);
    await sendSlackMessage({
      isProductionOnly: true,
      channel: "tramona-bot",
      text: [
        `STRIPE HOST PAYOUT ERROR `,
        `A host has not been paid for booking booking that has passed the 24-hour check-in window.`,
        `Please check the stripe logs for more information`,
      ].join("\n"),
    });
  }
}
