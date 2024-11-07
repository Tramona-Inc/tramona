import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { offers, trips, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { z } from "zod";
import { getPropertyForOffer } from "./offersRouter";
import { createPayHostTransfer } from "@/utils/stripe-utils";
import { breakdownPayment } from "@/utils/payment-utils/paymentBreakdown";

export const config = {
  api: {
    bodyParser: false,
  },
};
// these two are the same stripe objects, some stripe require the secret key and some require the restricted key
export const stripe = new Stripe(env.STRIPE_RESTRICTED_KEY_ALL);

export const stripeWithSecretKey = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
});
// change the apiVersion

export const stripeRouter = createTRPCRouter({
  createStripeCustomer: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string().optional(),
        firstName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await stripeWithSecretKey.customers.create({
        email: input.email,
        name: input.name ?? input.firstName ?? ctx.user.id,
      });
      await ctx.db
        .update(users)
        .set({
          stripeCustomerId: customer.id,
        })
        .where(eq(users.id, ctx.user.id));
    }),

  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        listingId: z.number(),
        propertyId: z.number(),
        requestId: z.number().nullable(),
        name: z.string(),
        price: z.number(), // Total price included tramona fee
        tramonaServiceFee: z.number(),
        description: z.string(),
        cancelUrl: z.string(),
        images: z.array(z.string().url()),
        userId: z.string(),
        phoneNumber: z.string(),
        totalSavings: z.number(),
        hostStripeId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentDate = new Date(); // Get the current date and time
      //we need the host Stripe account id to put in webhook
      //get hostID from the property
      // Object that can be access through webhook and client
      const metadata = {
        user_id: ctx.user.id,
        listing_id: input.listingId,
        property_id: input.propertyId,
        request_id: input.requestId,
        price: input.price, // Total price included tramona fee
        tramonaServiceFee: input.tramonaServiceFee,
        total_savings: input.totalSavings,
        confirmed_at: currentDate.toISOString(),
        phone_number: input.phoneNumber,
        host_stripe_id: input.hostStripeId ?? "",
      };
      console.log(metadata.host_stripe_id);
      const paymentIntentData: Stripe.Checkout.SessionCreateParams.PaymentIntentData =
        {
          metadata: metadata, // metadata access for payment intent (webhook access)

          ...(metadata.host_stripe_id
            ? {
                transfer_data: {
                  amount: input.price - input.tramonaServiceFee,
                  destination: metadata.host_stripe_id,
                },
              }
            : {}),
        };

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        submit_type: "book",
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
        //success_url: `${env.NEXTAUTH_URL}/offers/${input.listingId}`, //remove becuase we are now using embedded
        //cancel_url: `${env.NEXTAUTH_URL}${input.cancelUrl}`,
        return_url: `${env.NEXTAUTH_URL}/my-trips`, //redirect to my-trips page after payment
        metadata: metadata, // metadata access for checkout session
        payment_intent_data: paymentIntentData,
        ui_mode: "embedded",
      });
      console.log("This is the host stripe id ", metadata.host_stripe_id);
      return { clientSecret: session.client_secret };
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
  authorizePayment: protectedProcedure // this is how will now creat a checkout session using a custom flow
    .input(
      z.object({
        offerId: z.number(), //will either take an offerId or a requestToBookPricing
        cancelUrl: z.string(),
        requestToBookPricing: z
          .object({
            requestId: z.number().nullable(),
            scrapeUrl: z.string().nullable(),
            travelerOfferedPriceBeforeFees: z.number(),
            datePriceFromAirbnb: z.number(),
            checkIn: z.date(),
            checkOut: z.date(),
            property: z.object({
              id: z.number(),
              originalNightlyPrice: z.number().nullable(),
              city: z.string(),
              county: z.string().nullable(),
              stateName: z.string().nullable(),
              stateCode: z.string().nullable(),
              country: z.string(),
              hostTeam: z.object({
                owner: z.object({
                  stripeConnectId: z.string().nullable(),
                }),
              }),
            }),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentDate = new Date(); // Get the current date and time
      //we need the host Stripe account id to put in webhook
      //get hostID from the property
      // Object that can be access through webhook and client
      //check if a customer id exists

      let stripeCustomerId = await ctx.db.query.users
        .findFirst({
          columns: {
            stripeCustomerId: true,
          },
          where: eq(users.id, ctx.user.id),
        })
        .then((res) => res?.stripeCustomerId);
      if (!stripeCustomerId) {
        const customer = await stripeWithSecretKey.customers.create({
          email: ctx.user.email,
          name: ctx.user.name ?? ctx.user.id,
        });
        await ctx.db
          .update(users)
          .set({
            stripeCustomerId: customer.id,
          })
          .where(eq(users.id, ctx.user.id));

        stripeCustomerId = customer.id;
      }

      let offer = null;
      if (input.offerId !== -1) {
        const offerWithoutProperty = await ctx.db.query.offers.findFirst({
          where: eq(offers.id, input.offerId),
        });

        if (!offerWithoutProperty) return;

        const propertyForOffer = await getPropertyForOffer(
          offerWithoutProperty.propertyId,
        );
        offer = { ...offerWithoutProperty, property: propertyForOffer };
      } else if (input.requestToBookPricing) {
        offer = input.requestToBookPricing;
      }

      if (!offer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Offer not found with id ${input.offerId}`,
        });
      }

      const paymentBreakdown = breakdownPayment(offer);

      const metadata = {
        is_charged_with_setup_intent: "false",
        confirmed_at: currentDate.toISOString(),

        user_email: ctx.user.email,
        user_id: ctx.user.id,
        phone_number: ctx.user.phoneNumber,
        stripe_customer_id: stripeCustomerId,

        offer_id: input.offerId,
        property_id: offer.property.id,
        request_id: offer.requestId,
        host_stripe_id: offer.property.hostTeam.owner.stripeConnectId,
        traveler_offered_price_before_fees:
          offer.travelerOfferedPriceBeforeFees,
        price: paymentBreakdown.totalTripAmount, // Total price included tramona fee
        total_savings: paymentBreakdown.totalSavings,
        taxes_paid: paymentBreakdown.taxesPaid,
        tax_percentage: paymentBreakdown.taxPercentage,
        stripe_transaction_fee: paymentBreakdown.stripeTransactionFee,
        superhog_paid: paymentBreakdown.superhogFee,
      };

      const options: Stripe.PaymentIntentCreateParams = {
        metadata: metadata,
        amount: metadata.price,
        capture_method: "manual", // this is saying that we will capture the payment later and not now
        payment_method_options: {
          // this is saying we can charge more after payment is completed if not using card(any method that does not support capture)
          card: {
            capture_method: "manual",
          },
        },
        currency: "usd", //input.currency for now we will use usd
        setup_future_usage: "off_session", // is both of and on session
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: { enabled: true },
        // ...(metadata.host_stripe_id
        //   ? {
        //       transfer_data: {
        //         amount: metadata.price - metadata.tramonaServiceFee, // we need to change this too.
        //         destination: metadata.host_stripe_id,
        //       },
        //     }
        //   : {}),
      };

      const response = await stripe.paymentIntents.create(options);

      return response;
    }),

  capturePayment: protectedProcedure // not using rn because the logic is in the stripe-webhook/superhog router.
    .input(z.object({ paymentIntentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const intent = await stripe.paymentIntents.capture(input.paymentIntentId); //will capture the authorized amount by default
      // will trigger the payment_intent.amount_capturable_updated
      await ctx.db
        .update(trips)
        .set({ paymentCaptured: new Date() })
        .where(eq(trips.paymentIntentId, input.paymentIntentId));
      return intent;
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

  //stripe connect account (outdated)
  createStripeConnectAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      columns: {
        firstName: true,
        lastName: true,
        stripeConnectId: true,
        chargesEnabled: true,
      },
      where: eq(users.id, ctx.user.id),
    });
    if (!res?.stripeConnectId) {
      const stripeAccount = await stripeWithSecretKey.accounts.create({
        country: "US", //change this to the user country later
        email: ctx.user.email,
        settings: {},
        controller: {
          losses: {
            payments: "application",
          },
          fees: {
            payer: "application",
          },
          stripe_dashboard: {
            type: "express",
          },
        },
        //charges_enabled: true,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
          tax_reporting_us_1099_k: { requested: true },
        },
        business_type: "individual",
        business_profile: {
          url: "https://tramona.com",
          mcc: "4722",
          product_description: "Travel and Tourism",
        },
        individual: {
          email: ctx.user.email,
          first_name: res?.firstName ?? "",
        },
      });
      await ctx.db
        .update(users)
        .set({ stripeConnectId: stripeAccount.id })
        .where(eq(users.id, ctx.user.id));

      return stripeAccount;
    } else {
      throw new Error("Stripe account already created");
    }
  }),

  retrieveStripeConnectAccount: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const account = await stripeWithSecretKey.accounts.retrieve(input);
      return account;
    }),

  //we need this to create embedded connet account
  createStripeAccountSession: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const accountId = input;
      const accountSession = await stripeWithSecretKey.accountSessions.create({
        account: accountId,
        components: {
          account_onboarding: {
            enabled: true,
            features: {
              external_account_collection: true,
            },
          },
          account_management: {
            enabled: true,
            features: {
              external_account_collection: true,
            },
          },
          payments: {
            enabled: true,
            features: {
              refund_management: true,
              dispute_management: true,
              capture_payments: true,
              destination_on_behalf_of_charge_management: false,
            },
          },
          payouts: {
            enabled: true,
            features: {
              instant_payouts: true,
              standard_payouts: true,
              edit_payout_schedule: true,
            },
          },
          // payouts_list: {
          //   enabled: true,
          // },
          notification_banner: {
            enabled: true,
            features: {
              external_account_collection: true,
            },
          },
          // balances: {
          //   enabled: true,
          //   features: {
          //     instant_payouts: true,
          //     standard_payouts: true,
          //     edit_payout_schedule: true,
          //   },
          // },
        },
      });

      return accountSession;
    }),
  checkStripeConnectAccountBalance: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const accountId = input;
      const balance = await stripeWithSecretKey.balance.retrieve({
        stripeAccount: accountId,
      });

      return balance;
    }),

  listAllStripePayouts: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const accountId = input;
      const payout = await stripe.payouts.list({
        stripeAccount: accountId,
      });
      return payout.data;
    }),

  getConnectedExternalBank: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const accountId = input;
      const externalAccounts = await stripe.accounts.listExternalAccounts(
        accountId,
        {
          object: "bank_account",
        },
      );

      return externalAccounts.data;
    }),

  getAllTransactionPayments: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      let hasMore = true;
      let startingAfter: string | null = null;
      const allTransactions: Stripe.BalanceTransaction[] = [];

      while (hasMore) {
        const params: { limit: number; type: string; starting_after?: string } =
          {
            limit: 100,
            type: "payment",
            ...(startingAfter && { starting_after: startingAfter }),
          };

        const response = await stripe.balanceTransactions.list(params, {
          stripeAccount: input,
        });

        if (response.data.length > 0) {
          allTransactions.push(...response.data);
          hasMore = response.has_more;
          startingAfter = response.data[response.data.length - 1]?.id ?? null;
        } else {
          hasMore = false;
        }
      }

      return allTransactions;
    }),

  getAllTransactionPaymentsWithinInterval: protectedProcedure
    .input(
      z.object({
        stripeAccountId: z.string(),
        startDate: z.number(),
        endDate: z.number(),
      }),
    )
    .query(async ({ input }) => {
      let hasMore = true;
      let startingAfter: string | null = null;
      const allTransactions: Stripe.BalanceTransaction[] = [];

      while (hasMore) {
        const params: {
          limit: number;
          type: string;
          starting_after?: string;
          created: { gte: number; lte: number };
        } = {
          limit: 100,
          type: "payment",
          created: {
            gte: input.startDate, //takes unix timestamps
            lte: input.endDate,
          },
          ...(startingAfter && { starting_after: startingAfter }),
        };

        const response = await stripe.balanceTransactions.list(params, {
          stripeAccount: input.stripeAccountId,
        });

        if (response.data.length > 0) {
          allTransactions.push(...response.data);
          hasMore = response.has_more;
          startingAfter = response.data[response.data.length - 1]?.id ?? null;
        } else {
          hasMore = false;
        }
      }

      return allTransactions;
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

  getVerificationReports: protectedProcedure.query(async () => {
    return await stripe.identity.verificationReports.list({
      limit: 3,
    });
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

  getVerificationStatus: protectedProcedure.query(({ ctx }) => {
    const result = ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: { isIdentityVerified: true },
    });

    return result;
  }),

  payHostByTransfer: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        destination: z.string(),
        tripId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      //we first need to make sure we have enought balance on the tramona account
      await createPayHostTransfer({
        amount: input.amount,
        destination: input.destination,
        tripId: input.tripId,
      });
      console.log("Payment test successful");
    }),

  stripeTopUp: protectedProcedure //this function is used for topping up for test transactions
    .input(z.object({ amount: z.number() }))
    .query(async ({ input }) => {
      const topup = await stripe.topups.create({
        amount: input.amount, //
        currency: "usd",
        description: "Top-up for week of May 31",
        statement_descriptor: "Weekly top-up",
      });
      return topup;
    }),
  chargeForDamagesOrMisc: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        amount: z.number(),
        customerId: z.string(),
        setupIntentId: z.string(),
        description: z.string(),
        currency: z.string().optional(),
        propertyId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        //retreit the setupIntent objext to get the payment method
        const setupIntentObject = await stripe.setupIntents.retrieve(
          input.setupIntentId,
        );
        const paymentMethodId = setupIntentObject.payment_method as string;

        const paymentIntent = await stripeWithSecretKey.paymentIntents.create({
          amount: input.amount,
          customer: input.customerId,
          payment_method: paymentMethodId,
          confirm: true, // Tries to confirm immediately
          description: input.description,
          currency: input.currency ?? "usd",
          metadata: {
            is_charged_with_setup_intent: "true",
            customer_id: input.customerId,
            trip_id: input.tripId,
            description: input.description,
            property_id: input.propertyId,
          },
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never",
          },
        });

        // Check the status of the PaymentIntent
        if (paymentIntent.status === "succeeded") {
          // we need to insert it into the database
          //creates the damage record as well
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
    }),
});
