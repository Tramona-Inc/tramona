import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import { eq, and, sql } from "drizzle-orm";
import { hostProfiles, trips } from "@/server/db/schema/index";
import { createPayHostTransfer } from "@/pages/api/stripe-utils"; // Your custom utility to create Stripe transfer

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //will run every hour
  if (req.method === "POST") {
    try {
      const now = new Date();

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
          sql`${trips.checkIn} <= ${now} - interval '24 hours'`,
        ),
      });

      // Process each booking and create a transfer made an array in case host has multiple trips within 24 hours
      for (const trip of TripsAfter24HourCheckIn) {
        const hostAccount = await db.query.hostProfiles.findFirst({
          where: eq(hostProfiles.userId, trip.property.hostId!),
        });

        await createPayHostTransfer({
          amount: trip.offer!.totalPrice,
          destination: hostAccount!.stripeAccountId!,
          tripId: trip.id.toString(),
        });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error scheduling transfer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
