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

export const paymentsRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    .input(z.object({ name: z.string(), price: z.number() }))
    .mutation(({ input }) => {
      return stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card", "us_bank_account"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: input.price,
              product_data: {
                name: input.name,
              },
            },
            quantity: 1
          },
        ],
        success_url: `${env.NEXTAUTH_URL}/payment/success?session_ID={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.NEXTAUTH_URL}`,
      });
    }),
});
