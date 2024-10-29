import { env } from "@/env";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_RESTRICTED_KEY_ALL);
const stripeWithSecretKey = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export async function createSetupIntent({
  customerId,
  paymentMethodId,
  userId,
}: {
  customerId: string;
  paymentMethodId: string;
  userId: string;
}) {
  //now we need to update the customer account with the attached payment method
  const customer = await stripeWithSecretKey.paymentMethods.attach(
    paymentMethodId,
    {
      customer: customerId,
    },
  );
  console.log("customer", customer);

  //first we need to create the setup Inten using information from the booking

  const setupIntent = await stripeWithSecretKey.setupIntents.create({
    customer: customerId,
    payment_method: paymentMethodId,
    metadata: {
      user_id: userId,
    },
  });

  //now we need to update DB to  the setUptIntent to be used for future payments
  await db
    .update(users)
    .set({
      setupIntentId: setupIntent.id,
    })
    .where(eq(users.id, userId));
}

export async function chargeForDamagesOrMisc({
  amount,
  customerId,
  paymentMethodId,
  description,
  currency = "usd",
}: {
  amount: number;
  customerId: string;
  paymentMethodId: string;
  description: string;
  currency?: string;
}) {
  try {
    const paymentIntent = await stripeWithSecretKey.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true, // Tries to confirm immediately
      description,
    });

    // Check the status of the PaymentIntent
    if (paymentIntent.status === "succeeded") {
      console.log("Charge successful:", paymentIntent);
      return paymentIntent; // Payment was completed successfully
    } else if (
      paymentIntent.status === "requires_action" ||
      paymentIntent.status === "requires_confirmation"
    ) {
      console.log("Additional action required for:", paymentIntent);
      // You need to handle the additional action on the client side
      return paymentIntent;
    } else {
      console.error("PaymentIntent status:", paymentIntent.status);
      throw new Error("Failed to complete the charge.");
    }
  } catch (error) {
    console.error("Charge error:", error);
    throw error;
  }
}
