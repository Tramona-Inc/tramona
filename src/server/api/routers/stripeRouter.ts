import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import Stripe from "stripe";
import { z } from "zod";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const stripe = new Stripe(env.STRIPE_TEST_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        listingId: z.number(),
        name: z.string(),
        price: z.number(),
        description: z.string(),
        cancelUrl: z.string(),
        images: z.array(z.string().url()),
      }),
    )
    .mutation(({ input }) => {
      return stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: input.price,
              product_data: {
                name: input.name,
                description: input.description,
                images: input.images,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${env.NEXTAUTH_URL}/listings/${input.listingId}/?session_ID={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.NEXTAUTH_URL}/${input.cancelUrl}`,
      });
    }),
  getStripeSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      return {
        email: session.customer_details?.email,
      };
    }),
});
