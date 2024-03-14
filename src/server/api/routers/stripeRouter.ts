import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { hostProfiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";
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
        phoneNumber: z.string(),
        totalSavings: z.number(),
        // hostId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const currentDate = new Date(); // Get the current date and time

      // Object that can be access through webhook and client
      const metadata = {
        user_id: ctx.user.id,
        listing_id: input.listingId,
        property_id: input.propertyId,
        request_id: input.requestId,
        price: input.price,
        total_savings: input.totalSavings,
        confirmed_at: currentDate.toISOString(),
        phone_number: input.phoneNumber,
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

          // TODO: this is where the money get's transferred
          // transfer_data: {
          //   destination: //stripe_account_id,
          // }
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
          phoneNumber: session.metadata?.phone_number,
          // host_id: session.metadata?.host_id
        },
      };
    }),
  createStripeConnectAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const res = await ctx.db.query.hostProfiles.findFirst({
      columns: {
        stripeAccountId: true,
        chargesEnabled: true,
      },
      where: eq(hostProfiles.userId, ctx.user.id),
    });

    let stripeAccountId = res?.stripeAccountId; // Initialize if stripeAccountId excist

    if (
      ctx.user.role === "host" &&
      !res?.stripeAccountId &&
      !res?.chargesEnabled
    ) {
      const stripeAccount = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: ctx.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
          tax_reporting_us_1099_k: { requested: true },
        },
        business_type: "individual",
        individual: {
          email: ctx.user.email,
        },
      });

      const updatedId = await ctx.db
        .update(hostProfiles)
        .set({ stripeAccountId: stripeAccount.id })
        .where(eq(hostProfiles.userId, ctx.user.id))
        .returning({ updatedId: hostProfiles.stripeAccountId })
        .then((updatedProfiles) => updatedProfiles[0]?.updatedId);

      stripeAccountId = updatedId;
    }

    if (stripeAccountId) {
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${env.NEXTAUTH_URL}/host/payout`,
        return_url: `${env.NEXTAUTH_URL}/host/payout`,
        type: "account_onboarding",
      });

      return accountLink.url;
    }
  }),
});
