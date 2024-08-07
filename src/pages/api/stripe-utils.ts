import { db } from "@/server/db";
import { trips } from "@/server/db/schema/tables/trips";
import { stripe } from "@/server/api/routers/stripeRouter";
import { eq } from "drizzle-orm";

//for functions that require alot code to be written after a stripe event
interface CreatePayHostTransfer {
  amount: number;
  destination: string;
  tripId: string;
}

export async function createPayHostTransfer({
  amount,
  destination,
  tripId,
}: CreatePayHostTransfer) {
  //not using rn becuase the logic is the cron job
  const transfer = await stripe.transfers.create({
    amount: amount, // amount in cents
    currency: "usd",
    destination: destination, // connected account ID
    transfer_group: tripId,
    metadata: {
      trip_id: tripId,
      host_stripe_account_id: destination,
      transered_at: new Date().toISOString(),
    },
  });
  //update the trip to show that the host has been payed
  await db
    .update(trips)
    .set({ hostPayed: true })
    .where(eq(trips.id, parseInt(tripId)));
  console.log("transfer created", transfer);
}
