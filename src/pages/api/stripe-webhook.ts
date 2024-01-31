import { env } from "@/env";
import { stripe } from "@/server/api/routers/stripeRouter";
import { db } from "@/server/db";
import { offers, requests } from "@/server/db/schema";
import { eq } from "drizzle-orm";
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
        console.log(paymentIntentSucceeded.metadata);

        await db
          .update(offers)
          .set({
            acceptedAt: new Date(paymentIntentSucceeded.metadata.confirmed_at!),
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
        console.log("PaymentIntent was successful!");

        break;

      case "checkout.session.completed":
        console.log("Checkout session was successful!");
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
