import { env } from "@/env";
import { stripe } from "@/server/api/routers/stripeRouter";
import { db } from "@/server/db";
import {
  offers,
  referralCodes,
  referralEarnings,
  requests,
  users,
} from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { buffer } from "micro";
import { type NextApiRequest, type NextApiResponse } from "next";

// ! Necessary for stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function webhook(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      let message = "Unkown Error";

      if (error instanceof Error) message = error.message;

      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }

    // * You can add other event types to catch
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        await db
          .update(offers)
          .set({
            acceptedAt: new Date(paymentIntentSucceeded.metadata.confirmed_at!),
            paymentIntentId: paymentIntentSucceeded.id,
          })
          .where(
            eq(
              offers.id,
              parseInt(paymentIntentSucceeded.metadata.listing_id!),
            ),
          );

        await db
          .update(requests)
          .set({
            resolvedAt: new Date(paymentIntentSucceeded.metadata.confirmed_at!),
          })
          .where(
            eq(
              requests.id,
              parseInt(paymentIntentSucceeded.metadata.request_id!),
            ),
          );
        // console.log("PaymentIntent was successful!");
        const user = await db.query.users.findFirst({
          where: eq(users.id, paymentIntentSucceeded.metadata.user_id!),
        });

        const referralCode = user?.referralCodeUsed;

        if (referralCode) {
          const offerId = parseInt(paymentIntentSucceeded.metadata.listing_id!);
          const refereeId = paymentIntentSucceeded.metadata.user_id!;

          const tramonaFee =
            parseInt(paymentIntentSucceeded.metadata.total_savings!) * 0.2;
          const cashbackMultiplier =
            user.referralTier === "Ambassador" ? 0.5 : 0.3;
          const cashbackEarned = tramonaFee * cashbackMultiplier;

          await db
            .insert(referralEarnings)
            .values({ offerId, cashbackEarned, refereeId, referralCode });

          await db
            .update(referralCodes)
            .set({
              totalBookingVolume: sql`${referralCodes.totalBookingVolume} + ${cashbackEarned}`,
              numBookingsUsingCode: sql`${referralCodes.numBookingsUsingCode} + ${1}`,
            })
            .where(eq(referralCodes.referralCode, referralCode));
        }

        break;

      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;

        // * Make sure to check listing_id isnt' null
        if (
          checkoutSessionCompleted.metadata &&
          checkoutSessionCompleted.metadata.listing_id !== null
        ) {
          const listing_id = parseInt(
            checkoutSessionCompleted.metadata.listing_id!,
          );

          await db
            .update(offers)
            .set({
              checkoutSessionId: checkoutSessionCompleted.id,
            })
            .where(eq(offers.id, listing_id));

          // console.log("Checkout session was successful!");
        } else {
          // console.error("Metadata or listing_id is null or undefined");
        }
        break;

      default:
      // console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
