import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { hostProfiles, trips } from "@/server/db/schema/index";
import { createPayHostTransfer } from "@/pages/api/stripe-utils"; // Your custom utility to create Stripe transfer

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      // Fetch bookings that are scheduled for payout
      const upcomingTrips = await db.query.trips.findMany({
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
          eq(
            trips.checkIn,
            new Date(new Date().setDate(new Date().getDate() + 1)),
          ),
        ),
      });

      // Process each booking and create a transfer made an array in case host has multiple trips within 24 hours
      for (const trip of upcomingTrips) {
        const hostAccount = await db.query.hostProfiles.findFirst({
          where: eq(hostProfiles.userId, trip.property.hostId!),
        });

        await createPayHostTransfer({
          amount: trip.offer!.totalPrice,
          destination: hostAccount!.stripeAccountId!, // Example field, adjust according to your schema
          tripId: trip.id.toString(), // Example field, adjust according to your schema
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
