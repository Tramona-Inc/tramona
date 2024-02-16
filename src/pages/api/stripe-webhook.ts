import { env } from "@/env";
import { AppRouter } from "@/server/api/root";
import { stripe } from "@/server/api/routers/stripeRouter";
import { db } from "@/server/db";
import { offers, referralEarnings, requests, users } from "@/server/db/schema";
import { inferRouterOutputs } from "@trpc/server";
import { eq } from "drizzle-orm";
import { buffer } from "micro";
import { type NextApiRequest, type NextApiResponse } from "next";

export type StripePayment =
  inferRouterOutputs<AppRouter>["stripe"]["getStripeSession"]["metadata"];

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
        const metadata = paymentIntentSucceeded.metadata as StripePayment;

        await db
          .update(offers)
          .set({
            acceptedAt: new Date(metadata.confirmedAt!),
            paymentIntentId: paymentIntentSucceeded.id,
          })
          .where(
            eq(offers.id, parseInt(paymentIntentSucceeded.metadata.listingId!)),
          );

        await db
          .update(requests)
          .set({
            resolvedAt: new Date(paymentIntentSucceeded.metadata.confirmedAt!),
          })
          .where(
            eq(
              requests.id,
              parseInt(paymentIntentSucceeded.metadata.requestId!),
            ),
          );
        // console.log("PaymentIntent was successful!");

        const user = await db.query.users.findFirst({
          where: eq(users.id, paymentIntentSucceeded.metadata.userId!),
        });

        const offerId = parseInt(paymentIntentSucceeded.metadata.listingId!);
        const referralCode = user?.referralCodeUsed;
        const refereeId = paymentIntentSucceeded.metadata.userId!;
        const cashbackEarned = 100;

        if (referralCode) {
          await db
            .insert(referralEarnings)
            .values({ offerId, cashbackEarned, refereeId, referralCode });
        }

        break;

      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;

        // * Make sure to check listingId isnt' null
        if (
          checkoutSessionCompleted.metadata &&
          checkoutSessionCompleted.metadata.listingId !== null
        ) {
          const listingId = parseInt(
            checkoutSessionCompleted.metadata.listingId!,
          );

          await db
            .update(offers)
            .set({
              checkoutSessionId: checkoutSessionCompleted.id,
            })
            .where(eq(offers.id, listingId));

          // console.log("Checkout session was successful!");
        } else {
          // console.error("Metadata or listingId is null or undefined");
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
