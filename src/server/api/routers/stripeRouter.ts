import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import Stripe from "stripe";
import { z } from "zod";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        listingId: z.number(),
        propertyId: z.number(),
        requestId: z.number(),
        name: z.string(),
        price: z.number(),
        description: z.string(),
        cancelUrl: z.string(),
        images: z.array(z.string().url()),
        userId: z.string(),
        totalSavings: z.number(),
        // hostId: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const currentDate = new Date(); // Get the current date and time

      // Object that can be access through webhook and client
      const metadata = {
        user_id: input.userId,
        listing_id: input.listingId,
        property_id: input.propertyId,
        request_id: input.requestId,
        price: input.price,
        total_savings: input.totalSavings,
        confirmed_at: currentDate.toISOString(),
        // host_id: input.hostId,
      };

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
                metadata: metadata,
                images: input.images,
              },
            },
            quantity: 1,
          },
        ],
        // success_url: `${env.NEXTAUTH_URL}/listings/${input.listingId}/?session_id={CHECKOUT_SESSION_ID}`,
        success_url: `${env.NEXTAUTH_URL}/listings/${input.listingId}`,
        cancel_url: `${env.NEXTAUTH_URL}${input.cancelUrl}`,
        metadata: metadata, // metadata access for checkout session
        payment_intent_data: {
          metadata: metadata, // metadata access for payment intent (webhook access)
        },
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
        metadata: {
          user_id: session.metadata?.user_id,
          stripe_email_used: session.customer_details?.email,
          stripe_phone_used: session.customer_details?.phone,
          price: session.metadata?.price,
          listing_id: session.metadata?.listing_id,
          property_id: session.metadata?.property_id,
          request_id: session.metadata?.request_id,
          checkout_session_id: session.id,
          total_savings: session.metadata?.total_savings,
          confirmed_at: session.metadata?.confirmed_at,
          // host_id: session.metadata?.host_id
        },
      };
    }),
});
