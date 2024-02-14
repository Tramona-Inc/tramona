import { env } from "@/env";
import { stripe } from "@/server/api/routers/stripeRouter";
import { db } from "@/server/db";
import { referralCodes, users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { buffer } from "micro";
import { type NextApiRequest, type NextApiResponse } from "next";

// ! Necessary for stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function updateReferralPayout(
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

        const user_id = paymentIntentSucceeded.metadata.user_id;

        if (!user_id) {
          res.status(400).send(`User Id not found`);
          return;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.id, user_id),
        });

        if (!user) {
          res.status(400).send(`User not found`);
          return;
        }

        const referralCodeUsed = user.referralCodeUsed;

        if (!referralCodeUsed) {
          res.status(400).send(`Referral Code not found`);
          return;
        }

        await db
          .update(referralCodes)
          .set({
            totalBookingVolume: sql`${referralCodes.totalBookingVolume} + ${paymentIntentSucceeded.metadata.price}`,
          })
          .where(eq(referralCodes.referralCode, referralCodeUsed));

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
