import { db } from "@/server/db";
import { trips, refundedPayments } from "@/server/db/schema";
import { stripe, stripeWithSecretKey } from "@/server/api/routers/stripeRouter";
import { eq } from "drizzle-orm";
import type { Stripe } from "stripe";

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
      .set({ hostPayed: new Date() })
      .where(eq(trips.id, parseInt(tripId)));
    console.log("transfer created", transfer);
  }
}

export async function refundTripWithStripe({
  paymentIntentId,
  amount,
  metadata,
}: {
  paymentIntentId: string;
  amount: number;
  metadata: {
    tripId: number;
    propertyId: number;
    groupId: number;
    cancellationRefund: number;
    cancellationId: number;
    description: string;
  };
}) {
  const refund = await stripeWithSecretKey.refunds.create({
    payment_intent: paymentIntentId, // Or use charge: 'ch_123XYZ...'
    amount: amount,
    reason: "requested_by_customer", // Optional: Reason for the refund
    metadata: metadata,
  });

  const refundedPayment = await db.insert(refundedPayments).values({
    tripId: metadata.tripId,
    amountRefunded: amount,
    description: metadata.description,
  });
  console.log(refundedPayment);
  console.log(refund);
  return;
}
