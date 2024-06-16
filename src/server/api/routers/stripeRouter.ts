import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import Stripe from "stripe"
import { z } from "zod";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const stripe = new Stripe(env.STRIPE_RESTRICTED_KEY_ALL, {
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
        // success_url: `${env.NEXTAUTH_URL}/offers/${input.listingId}/?session_id={CHECKOUT_SESSION_ID}`,
        success_url: `${env.NEXTAUTH_URL}/offers/${input.listingId}`,
        cancel_url: `${env.NEXTAUTH_URL}${input.cancelUrl}`,
        metadata: metadata, // metadata access for checkout session
        payment_intent_data: {
          metadata: metadata, // metadata access for payment intent (webhook access)
        },
      });
    }),

  authorizePayment: protectedProcedure
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

      return stripe.paymentIntents.create({
        payment_method_types: ["card"],
        amount: input.price,
        currency: "usd",
        capture_method: "manual",
        metadata: metadata, // metadata access for checkout session
      });
    }),

  // Get the customer info
  createSetupIntentSession: protectedProcedure
    .input(
      z.object({
        listingId: z.number(),
        propertyId: z.number(),
        requestId: z.number(),
        price: z.number(),
        cancelUrl: z.string(),
        name: z.string(),
        description: z.string(),
        // images: z.array(z.string().url()),
        phoneNumber: z.string(),
        totalSavings: z.number(),
        // hostId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let stripeCustomerId = await ctx.db.query.users
        .findFirst({
          columns: {
            stripeCustomerId: true,
          },
          where: eq(users.id, ctx.user.id),
        })
        .then((res) => res?.stripeCustomerId);

      // ! UNCOMMENT FOR TESTING PURPOSES
      if (!stripeCustomerId) {
        stripeCustomerId = await stripe.customers
          .create({
            name: ctx.user.name ?? "",
            email: ctx.user.email,
          })
          .then((res) => res.id);
      }

      // const stripeCustomerId = "cus_PwwCgSdIG3rWNx";

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

      if (stripeCustomerId) {
        return stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          currency: "usd",
          success_url: `${env.NEXTAUTH_URL}/requests/${input.requestId}/?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.NEXTAUTH_URL}${input.cancelUrl}`,
          // return_url: `${env.NEXTAUTH_URL}/payment-intent`,
          // redirect_on_completion: "never",
          metadata: metadata, // metadata access for checkout session
          customer: stripeCustomerId,
        });
      }
    }),

  createSetupIntent: protectedProcedure
    .input(
      z.object({
        paymentMethod: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let stripeCustomerId = await ctx.db.query.users
        .findFirst({
          columns: {
            stripeCustomerId: true,
          },
          where: eq(users.id, ctx.user.id),
        })
        .then((res) => res?.stripeCustomerId);

      // Create a customer id if it doesn't exist
      if (!stripeCustomerId) {
        stripeCustomerId = await stripe.customers
          .create({
            name: ctx.user.name ?? "",
            email: ctx.user.email,
          })
          .then((res) => res.id);

        await ctx.db
          .update(users)
          .set({ stripeCustomerId })
          .where(eq(users.id, ctx.user.id));
      }

      if (stripeCustomerId) {
        const options: Stripe.SetupIntentCreateParams = {
          automatic_payment_methods: {
            enabled: true,
          },
          customer: stripeCustomerId,
          payment_method: input.paymentMethod,
          // Set the payment method as default for the customer
          usage: "off_session", // or 'on_session' depending on your use case
        };

        const response = await stripe.setupIntents.create(options);
        return response;
      }
    }),

  // Get the customer info
  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        currency: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const options: Stripe.PaymentIntentCreateParams = {
        amount: input.amount,
        currency: input.currency,
        setup_future_usage: "off_session", // is both of and on session
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: { enabled: true },
      };

      const response = await stripe.paymentIntents.create(options);

      return response;
    }),

  confirmSetupIntent: protectedProcedure
    .input(
      z.object({
        setupIntent: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const si = await stripe.setupIntents.retrieve(input.setupIntent);

      if (!si.payment_method) {
        throw new Error("Payment method not found");
      }

      let stripeCustomerId = await ctx.db.query.users
        .findFirst({
          columns: {
            stripeCustomerId: true,
          },
          where: eq(users.id, ctx.user.id),
        })
        .then((res) => res?.stripeCustomerId);

      // Create a customer id if it doesn't exist
      if (!stripeCustomerId) {
        stripeCustomerId = await stripe.customers
          .create({
            name: ctx.user.name ?? "",
            email: ctx.user.email,
          })
          .then((res) => res.id);

        await ctx.db
          .update(users)
          .set({ stripeCustomerId })
          .where(eq(users.id, ctx.user.id));
      }

      if (!stripeCustomerId) {
        throw new Error("Customer not found");
      }

      await stripe.paymentMethods.attach(si.payment_method as string, {
        customer: stripeCustomerId,
      });

      await stripe.customers.update(si.customer as string, {
        invoice_settings: {
          default_payment_method: si.payment_method as string,
        },
      });

      await ctx.db
        .update(users)
        .set({ setupIntentId: input.setupIntent })
        .where(eq(users.id, ctx.user.id));
    }),

  getListOfPayments: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.stripeCustomerId) {
      const cards = await stripe.paymentMethods.list({
        type: "card",
        customer: ctx.user.stripeCustomerId,
      });

      const customer = await stripe.customers.retrieve(
        ctx.user.stripeCustomerId,
      );

      if (customer.deleted) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Customer not found",
        });
      }

      return {
        // ! Need to get type of invoice_settings
        defaultPaymentMethod: customer.invoice_settings.default_payment_method,
        cards,
      };
    }
  }),

  getStripeSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
        expand: ["setup_intent"],
      });

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
          setupIntent: session.setup_intent,
        },
      };
    }),
  createVerificationSession: protectedProcedure.query(async ({ ctx }) => {
    const verificationSession =
      await stripe.identity.verificationSessions.create({
        type: "document",
        metadata: {
          user_id: ctx.user.id,
        },
      });

    // Return only the client secret to the frontend.
    const clientSecret = verificationSession.client_secret;
    return clientSecret;
  }),

  getVerificationReports: protectedProcedure.query(async ({ ctx, input }) => {
    const verificationReport = await stripe.identity.verificationReports.list({
      limit: 3,
    });
    return verificationReport;
  }),

  getVerificationReportsById: protectedProcedure
    .input(z.object({ verificationId: z.string() }))
    .query(async ({ input }) => {
      const verificationReport =
        await stripe.identity.verificationReports.retrieve(
          input.verificationId,
        );
      return verificationReport;
    }),

  getSetUpIntent: protectedProcedure
    .input(
      z.object({
        setupIntent: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const setupIntent = await stripe.setupIntents.retrieve(input.setupIntent);

      return {
        setupIntent: setupIntent,
      };
    }),

  // TODO: create a PaymentIntent for admin/host to accept the bidding based of the user intent

  getVerificationStatus: protectedProcedure.query(({ ctx, input }) => {
    const result = ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        isIdentityVerified: true,
      },
    });

    return result;
  }),
});
