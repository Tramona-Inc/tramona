import { db } from "@/server/db";
import { trips, refundedPayments, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import Stripe from "stripe";

const stripeWithSecretKey = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
});
const stripe = new Stripe(env.STRIPE_RESTRICTED_KEY_ALL);

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

export async function createStripeConnectId({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const res = await db.query.users.findFirst({
    columns: {
      firstName: true,
      lastName: true,
      stripeConnectId: true,
      chargesEnabled: true,
    },
    where: eq(users.id, userId),
  });
  if (!res?.stripeConnectId) {
    const stripeAccount = await stripeWithSecretKey.accounts.create({
      country: "US", //change this to the user country later
      email: userEmail,
      settings: {},
      controller: {
        losses: {
          payments: "application",
        },
        fees: {
          payer: "application",
        },
        stripe_dashboard: {
          type: "express",
        },
      },
      //charges_enabled: true,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
        tax_reporting_us_1099_k: { requested: true },
      },
      business_type: "individual",
      business_profile: {
        url: "https://tramona.com",
        mcc: "4722",
        product_description: "Travel and Tourism",
      },
      individual: {
        email: userEmail,
        first_name: res?.firstName ?? "",
      },
    });
    await db
      .update(users)
      .set({ stripeConnectId: stripeAccount.id })
      .where(eq(users.id, userId));

    return stripeAccount;
  } else {
    console.log("Stripe account already created");
  }
}
