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
  //we need to check to see if our balance is enought to pay the host, if not we need to top up the account
  const balance = await stripe.balance.retrieve();
  console.log("balance object", balance);
  if (balance.instant_available && balance.instant_available.length > 0) {
    const availableBalance = balance.instant_available[0]!.amount;

    if (availableBalance < amount) {
      //we need to add a top up function here then continue with the transfer
      await stripe.topups.create({
        amount: amount - availableBalance,
        currency: "usd",
        description: "Top-up for week of May 31",
        statement_descriptor: "Weekly top-up",
      });
    }
    const transfer = await stripe.transfers.create({
      amount: amount, // amount in cents
      currency: "usd",
      destination: destination, // connected account ID
      // transfer_group: tripId,
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
}
