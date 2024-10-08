import { env } from "@/env";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  Property,
  groupMembers,
  offerSelectSchema,
  offerUpdateSchema,
  offers,
  properties,
  referralCodes,
  requestSelectSchema,
  tripCheckouts,
  trips,
} from "@/server/db/schema";
import { getCity, getCoordinates } from "@/server/google-maps";
import {
  sendText,
  sendWhatsApp,
  updateTravelerandHostMarkup,
} from "@/server/server-utils";
import { formatDateRange, getNumNights } from "@/utils/utils";

import { TRPCError } from "@trpc/server";
import {
  and,
  eq,
  inArray,
  isNotNull,
  isNull,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { requests } from "../../db/schema/tables/requests";
import { db } from "@/server/db";
import NewOfferReceivedEmail from "packages/transactional/emails/NewOfferReceivedEmail";
import {
  directSiteScrapers,
  scrapeDirectListings,
} from "@/server/direct-sites-scraping";
import { createNormalDistributionDates } from "@/server/server-utils";
import { scrapeAirbnbPrice } from "@/server/scrapePrice";
import { TRPCClientError } from "@trpc/client";
import { breakdownPayment } from "@/utils/payment-utils/paymentBreakdown";

type PropertyWithHost = Property & {
  host: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    hostProfile: { userId: string } | null;
  } | null;
};
export const offersRouter = createTRPCRouter({
  accept: protectedProcedure
    .input(offerSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const offer = await ctx.db.query.offers.findFirst({
        where: eq(offers.id, input.id),
        columns: { totalPrice: true, propertyId: true },
        with: {
          request: {
            columns: {
              id: true,
              checkIn: true,
              checkOut: true,
              numGuests: true,
            },
            with: { madeByGroup: { columns: { ownerId: true, id: true } } },
          },
        },
      });

      if (!offer) throw new TRPCError({ code: "NOT_FOUND" });

      // if the offer comes from a request, only the owner of the group can accept offers
      // otherwise, anyone can
      if (offer.request?.madeByGroup.ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db.transaction(async (tx) => {
        const results = await Promise.allSettled([
          offer.request &&
            // resolve the request if it exists
            tx
              .update(requests)
              .set({ resolvedAt: new Date() })
              .where(eq(offers.id, offer.request.id)),

          offer.request &&
            // add a trip
            tx.insert(trips).values({
              offerId: input.id,
              checkIn: offer.request.checkIn,
              checkOut: offer.request.checkOut,
              numGuests: offer.request.numGuests,
              groupId: offer.request.madeByGroup.id,
              propertyId: offer.propertyId, //testing maybe this will get populatated first
            }),

          // mark the offer as accepted
          tx
            .update(offers)
            .set({ acceptedAt: new Date() })
            .where(eq(offers.id, input.id)),

          // update referralCode
          ctx.user.referralCodeUsed &&
            tx
              .update(referralCodes)
              .set({
                totalBookingVolume: sql`${referralCodes.totalBookingVolume} + ${offer.totalPrice}`,
              })
              .where(eq(referralCodes.referralCode, ctx.user.referralCodeUsed)),

          ctx.user.referralCodeUsed &&
            tx
              .update(referralCodes)
              .set({
                numBookingsUsingCode: sql`${referralCodes.numBookingsUsingCode} + 1`,
              })
              .where(eq(referralCodes.referralCode, ctx.user.referralCodeUsed)),
        ]);

        if (results.some((result) => result.status === "rejected")) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      });
    }),

  getByRequestId: protectedProcedure
    .input(requestSelectSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const requestPromise = ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
      });

      const request = await requestPromise;

      // request must exist
      if (!request) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That request doesn't exist",
        });
      }

      return await ctx.db.query.offers.findMany({
        where: eq(offers.requestId, input.id),
      });
    }),

  getByRequestIdWithProperty: publicProcedure
    .input(requestSelectSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.id),
      });

      // request must exist
      if (!request) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That request doesn't exist",
        });
      }

      const offersByRequest = await ctx.db.query.offers.findMany({
        where: eq(offers.requestId, input.id),
        with: {
          request: {
            with: {
              madeByGroup: { with: { members: true } },
            },
            columns: { numGuests: true, location: true, id: true },
          },
        },
      });
      const propertiesByRequest = await ctx.db.query.properties.findMany({
        where: inArray(
          properties.id,
          offersByRequest.map((offer) => offer.propertyId),
        ),
        with: {
          host: {
            columns: { id: true, name: true, email: true, image: true },
            with: {
              hostProfile: {
                columns: { userId: true },
              },
            },
          },
          reviews: true,
        },
      });

      const propertiesMap: Record<number, PropertyWithHost> =
        propertiesByRequest.reduce(
          (
            acc: Record<number, PropertyWithHost>,
            property: PropertyWithHost,
          ) => {
            acc[property.id] = property;
            return acc;
          },
          {} as Record<number, PropertyWithHost>,
        );

      // Merge offers with their corresponding property
      const offersByRequestWithProperties = offersByRequest.map((offer) => ({
        ...offer,
        property: propertiesMap[offer.propertyId]!, // Match property by propertyId
      }));

      offersByRequestWithProperties.map((offer) => {
        if (offer.acceptedAt !== null || offer.scrapeUrl) return offer;
        void updateTravelerandHostMarkup({
          offerTotalPrice: offer.totalPrice,
          offerId: offer.id,
        });
        return offer;
      });

      return offersByRequestWithProperties;
    }),

  getCoordinates: publicProcedure
    .input(z.object({ location: z.string() }))
    .query(async ({ input }) => {
      const coords = await getCoordinates(input.location);
      return {
        coordinates: coords,
      };
    }),

  getCity: publicProcedure
    .input(z.object({ lat: z.number(), lng: z.number() }))
    .query(async ({ input }) => {
      return await getCity(input);
    }),

  getByIdWithDetails: protectedProcedure
    .input(offerSelectSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const offerWithoutProperty = await getOfferPageData(input.id);

      const propertyForOffer = await getPropertyForOffer(
        offerWithoutProperty.propertyId,
      );

      const offer = { ...offerWithoutProperty, property: propertyForOffer };

      if (offer.request) {
        const memberIds = offer.request.madeByGroup.members.map(
          (member) => member.userId,
        );

        if (!memberIds.includes(ctx.user.id) && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }
      return offer;
    }),

  getByPublicIdWithDetails: publicProcedure
    .input(offerSelectSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const offer = await ctx.db.query.offers.findFirst({
        where: and(
          eq(offers.id, input.id),
          //isNotNull(offers.madePublicAt) //for now this is empty because we we want users to be able to share.
        ),
        columns: {
          createdAt: true,
          totalPrice: true,
          acceptedAt: true,
          id: true,
          hostPayout: true,
          travelerOfferedPriceBeforeFees: true,
        },
        with: {
          request: {
            columns: {
              checkIn: true,
              checkOut: true,
              numGuests: true,
              location: true,
              id: true,
            },
          },
          property: {
            with: {
              host: {
                columns: { id: true, name: true, email: true, image: true },
              },
            },
          },
        },
      });

      if (!offer) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return offer;
    }),

  makePublic: roleRestrictedProcedure(["admin", "host"])
    .input(offerSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "host") {
        const offer = await ctx.db.query.offers.findFirst({
          where: eq(offers.id, input.id),
          columns: {},
          with: {
            property: { columns: { hostId: true } },
          },
        });

        if (offer?.property.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db
        .update(offers)
        .set({ madePublicAt: new Date() })
        .where(eq(offers.id, input.id));
    }),

  // getAllPublicOffers: publicProcedure.query(async ({ ctx }) => {
  //   return (
  //     await ctx.db.query.offers.findMany({
  //       where: and(
  //         isNull(offers.acceptedAt),
  //         lt(offers.madePublicAt, new Date()),
  //       ),
  //       columns: { acceptedAt: false },
  //       with: {
  //         property: {
  //           with: {
  //             host: { columns: { name: true, email: true, image: true } },
  //           },
  //         },
  //         request: { columns: { checkIn: true, checkOut: true } },
  //       },
  //       orderBy: desc(offers.madePublicAt),
  //     })
  //   ).map((offer) => ({
  //     ...offer,
  //     madePublicAt: offer.madePublicAt!,
  //   }));
  // }),

  // getAllOffers: publicProcedure.query(async ({ ctx }) => {
  //   return await ctx.db.query.offers.findMany({
  //     with: {
  //       property: {
  //         with: {
  //           host: { columns: { name: true, email: true, image: true } },
  //         },
  //         columns: { name: true, originalNightlyPrice: true, imageUrls: true },
  //       },
  //       request: {
  //         columns: {
  //           userId: true,
  //           checkIn: true,
  //           checkOut: true,
  //           resolvedAt: true,
  //         },
  //         with: {
  //           madeByUser: { columns: { name: true, image: true } }, // Fetch user name
  //         },
  //       },
  //     },
  //     where: and(
  //       isNotNull(offers.acceptedAt),
  //       isNotNull(offers.paymentIntentId),
  //       isNotNull(offers.checkoutSessionId),
  //     ),
  //     orderBy: desc(offers.createdAt),
  //   });

  // return await ctx.db.query.requests.findMany({
  //   with: {
  //     offers: {
  //       with: {
  //         property: {
  //           with: {
  //             host: { columns: { name: true, email: true, image: true } },
  //           },
  //         },
  //       },
  //     },
  //     madeByUser: { columns: { name: true, image: true } },
  //   },
  //   orderBy: desc(requests.createdAt),
  // });
  // }),

  create: protectedProcedure
    .input(
      z
        .object({
          propertyId: z.number(),
          totalPrice: z.number().min(1),
          hostPayout: z.number(),
          travelerOfferedPriceBeforeFees: z.number(),
        })
        .and(
          z.union([
            z.object({ requestId: z.number() }),
            z.object({
              requestId: z.undefined(),
              checkIn: z.date(),
              checkOut: z.date(),
            }),
          ]),
        ),
    )
    .mutation(async ({ ctx, input }) => {
      // const propertyHostTeam = await ctx.db.query.properties
      //   .findFirst({
      //     where: eq(properties.id, input.propertyId),
      //     columns: { id: true },
      //     with: {
      //       hostTeam: { with: { members: true } },
      //     },
      //   })
      //   .then((res) => res?.hostTeam);

      // if (!propertyHostTeam) {
      //   throw new TRPCError({ code: "BAD_REQUEST" });
      // }

      // if (
      //   !propertyHostTeam.members.find(
      //     (member) => member.userId === ctx.user.id,
      //   )
      // ) {
      //   throw new TRPCError({ code: "UNAUTHORIZED" });
      // }
      console.log(input);
      const curProperty = await db.query.properties.findFirst({
        where: eq(properties.id, input.propertyId),
        columns: {
          name: true,
          imageUrls: true,
          originalListingId: true,
          maxNumGuests: true,
        },
      });
      console.log(curProperty);

      if (input.requestId !== undefined) {
        const requestDetails = await ctx.db.query.requests.findFirst({
          where: eq(requests.id, input.requestId),
          columns: {
            checkIn: true,
            checkOut: true,
            madeByGroupId: true,
            numGuests: true,
          },
        });
        console.log(requestDetails);

        if (!requestDetails) throw new TRPCError({ code: "BAD_REQUEST" });

        const scrapeParams = {
          checkIn: requestDetails.checkIn,
          checkOut: requestDetails.checkOut,
          numGuests: requestDetails.numGuests,
        };
        const datePriceFromAirbnb = curProperty?.originalListingId
          ? await scrapeAirbnbPrice({
              airbnbListingId: curProperty.originalListingId,
              params: scrapeParams,
            }).then((res) => {
              if (!res) {
                throw new TRPCClientError("Error scraping airbnb price");
              }
              return res;
            })
          : null;
        console.log(datePriceFromAirbnb);
        // ------- Create trips checkout first ----

        // function to help break down the price of the offer
        const brokeDownPayment = breakdownPayment({
          checkIn: requestDetails.checkIn,
          checkOut: requestDetails.checkOut,
          travelerOfferedPriceBeforeFees: input.travelerOfferedPriceBeforeFees,
          isScrapedPropery: false,
          originalPrice: datePriceFromAirbnb,
        });
        const tripCheckout = await db
          .insert(tripCheckouts)
          .values({
            totalTripAmount: brokeDownPayment.totalTripAmount,
            travelerOfferedPriceBeforeFees:
              input.travelerOfferedPriceBeforeFees,
            paymentIntentId: "",
            taxesPaid: brokeDownPayment.taxesPaid,
            taxPercentage: brokeDownPayment.taxPercentage,
            superhogFee: brokeDownPayment.superhogFee,
            stripeTransactionFee: brokeDownPayment.stripeTransactionFee,
            checkoutSessionId: "",
            totalSavings: brokeDownPayment.totalSavings,
          })
          .returning({ id: tripCheckouts.id })
          .then((res) => res[0]!);

        await ctx.db.insert(offers).values({
          ...input,
          checkIn: requestDetails.checkIn,
          checkOut: requestDetails.checkOut,
          datePriceFromAirbnb: datePriceFromAirbnb,
          tripCheckoutId: tripCheckout.id,
        });

        //find the property

        const request = await db.query.requests.findFirst({
          where: eq(requests.id, input.requestId),
          columns: {
            id: true,
            location: true,
            checkIn: true,
            checkOut: true,
            maxTotalPrice: true,
          },
        });

        const traveler = await db.query.requests
          .findFirst({
            where: eq(requests.id, input.requestId),
            with: {
              madeByGroup: {
                with: {
                  owner: {
                    columns: { id: true, phoneNumber: true, isWhatsApp: true },
                  },
                },
              },
            },
          })
          .then((res) => res?.madeByGroup.owner);

        traveler &&
          request &&
          (await sendText({
            to: traveler.phoneNumber!,
            content: `Tramona: You have 1 match for your request for ${request.location} from ${formatDateRange(request.checkIn, request.checkOut)} for ${request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut)}. Please tap below to view your offer: ${env.NEXTAUTH_URL}/requests/${request.id}`,
          }));
        //sending emails to everyone in the groug
        //get everymember in the group

        const allGroupMembers = await db.query.groupMembers.findMany({
          where: eq(groupMembers.groupId, requestDetails.madeByGroupId),
          columns: { userId: true },
          with: {
            user: {
              columns: { email: true, firstName: true, name: true },
            },
          },
        });

        for (const member of allGroupMembers) {
          // await sendEmail({
          //   to: member.user.email,
          //   subject: "New offer received",
          //   content: NewOfferReceivedEmail({
          //     userName:
          //       member.user.firstName ?? member.user.name ?? "Tramona Traveler",
          //     airbnbPrice: input.totalPrice * 1.25,
          //     ourPrice: input.totalPrice,
          //     property: curProperty!.name,
          //     discountPercentage: 25,
          //     nights: getNumNights(
          //       requestDetails.checkIn,
          //       requestDetails.checkOut,
          //     ),
          //     adults: curProperty!.maxNumGuests,
          //     checkInDateTime: requestDetails.checkIn,
          //     checkOutDateTime: requestDetails.checkOut,
          //     imgUrl: curProperty!.imageUrls[0]!,
          //     offerLink: `${env.NEXTAUTH_URL}/requests/${input.requestId}`,
          //   }),
          // });
        }
      } else {
        const brokeDownPayment = breakdownPayment({
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          travelerOfferedPriceBeforeFees: input.travelerOfferedPriceBeforeFees,
          isScrapedPropery: false,
        });

        const tripCheckout = await db
          .insert(tripCheckouts)
          .values({
            totalTripAmount: brokeDownPayment.totalTripAmount,
            travelerOfferedPriceBeforeFees:
              input.travelerOfferedPriceBeforeFees,
            paymentIntentId: "",
            taxesPaid: brokeDownPayment.taxesPaid,
            taxPercentage: brokeDownPayment.taxPercentage,
            superhogFee: brokeDownPayment.superhogFee,
            stripeTransactionFee: brokeDownPayment.stripeTransactionFee,
            checkoutSessionId: "",
            totalSavings: brokeDownPayment.totalSavings,
          })
          .returning({ id: tripCheckouts.id })
          .then((res) => res[0]!);

        await ctx.db.insert(offers).values({
          ...input,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          tripCheckoutId: tripCheckout.id,
        });
      }
    }),

  // create: roleRestrictedProcedure(["admin", "host"])
  //   .input(offerInsertSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     if (ctx.user.role === "host") {
  //       const property = await ctx.db.query.properties.findFirst({
  //         where: eq(properties.id, input.propertyId),
  //         columns: { hostId: true },
  //       });

  //       if (property?.hostId !== ctx.user.id) {
  //         throw new TRPCError({ code: "UNAUTHORIZED" });
  //       }
  //     }

  //     await ctx.db.insert(offers).values(input);
  //   }),

  update: roleRestrictedProcedure(["admin", "host"])
    .input(offerUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      // offer must exist...
      const offer = await ctx.db.query.offers.findFirst({
        where: eq(offers.id, input.id),
        columns: {},
        with: {
          property: { columns: { id: true } },
        },
      });

      if (!offer) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // ...and the associated property must be owned by the current user
      // (or its an admin)
      if (ctx.user.role === "host") {
        const property = await ctx.db.query.properties.findFirst({
          where: eq(properties.id, offer.property.id),
          columns: { hostId: true },
        });

        if (property?.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.update(offers).set(input).where(eq(offers.id, input.id));
    }),

  delete: roleRestrictedProcedure(["admin", "host"])
    .input(offerSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const offer = await ctx.db.query.offers.findFirst({
        where: eq(offers.id, input.id),
        columns: {
          checkIn: true,
          checkOut: true,
        },
        with: {
          property: {
            columns: { hostId: true, name: true, address: true },
          },
          request: {
            with: {
              madeByGroup: {
                with: {
                  members: {
                    with: {
                      user: {
                        columns: {
                          phoneNumber: true,
                          isWhatsApp: true,
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
            },
            columns: { location: true },
          },
        },
      });

      if (!offer) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.user.role === "host") {
        if (offer.property.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(offers).where(eq(offers.id, input.id));

      const { request, property } = offer;

      const members =
        offer.request?.madeByGroup.members.map((m) => m.user) ?? [];

      for (const member of members) {
        const memberHasOtherOffers = await ctx.db.query.groupMembers
          .findFirst({
            where: eq(groupMembers.userId, member.id),
            columns: {},
            with: {
              group: {
                columns: {},
                with: {
                  requests: {
                    columns: {},
                    with: { offers: { columns: { id: true } } },
                  },
                },
              },
            },
          })
          .then(
            (res) =>
              res && res.group.requests.some((req) => req.offers.length > 0),
          );

        const fmtdDateRange = formatDateRange(offer.checkIn, offer.checkOut);
        const url = `${env.NEXTAUTH_URL}/requests`;

        const location = await getCoordinates(property.address).then((res) =>
          res.location ? getCity(res.location) : "[Unknown location]",
        );

        if (member.phoneNumber) {
          if (member.isWhatsApp) {
            memberHasOtherOffers
              ? void sendWhatsApp({
                  templateId: "HXd5256ff10d6debdf70a13d70504d39d5",
                  to: member.phoneNumber,
                  propertyName: property.name,
                  propertyAddress: request?.location, //??can this be null
                  checkIn: offer.checkIn,
                  checkOut: offer.checkOut,
                  url: url,
                })
              : void sendWhatsApp({
                  templateId: "HXb293923af34665e7eefc81be0579e5db",
                  to: member.phoneNumber,
                  propertyName: property.name,
                  propertyAddress: request?.location,
                  checkIn: offer.checkIn,
                  checkOut: offer.checkOut,
                });
          } else {
            void sendText({
              to: member.phoneNumber,
              content: `Tramona: Hello, your ${property.name} in ${location} offer from ${fmtdDateRange} has expired. ${memberHasOtherOffers ? `Please tap below view your other offers: ${url}` : ""}`,
            });
          }
        }
      }
    }),

  //I want the all of the offers from each request that has been accepted except for the offer that has been accepted
  //Search in all requests, if there has been an off that has been accepted, then remove that offer from the list of offers
  //If there has been no offer accepted, then return nothing for that request
  getAllUnmatchedOffers: publicProcedure.query(async ({ ctx }) => {
    //go through all the requests and filter out the ones that have an offer that has been accepted

    const completedRequests = await ctx.db.query.requests.findMany({
      where: isNotNull(requests.resolvedAt),
    });

    const unMatchedOffers = await ctx.db.query.offers.findMany({
      where: and(
        isNull(offers.acceptedAt),
        or(
          isNull(offers.requestId),
          notInArray(
            offers.requestId,
            completedRequests.map((req) => req.id),
          ),
        ),
      ),
      with: {
        property: {
          columns: {
            name: true,
            originalNightlyPrice: true,
            imageUrls: true,
            id: true,
            maxNumGuests: true,
            numBedrooms: true,
            avgRating: true,
            numRatings: true,
          },
        },
      },
    });
    return unMatchedOffers;
  }),

  scrapeUnclaimedOffers: publicProcedure
    .input(
      z.object({
        numOfOffers: z.number().min(1).max(50),
      }),
    )
    .mutation(async ({ input }) => {
      // numOfOffers = numOfOffersPerDateRange * numOfDateRanges
      const numOfOffersPerDateRange = 6;

      const numOfDateRanges = Math.ceil(
        input.numOfOffers / numOfOffersPerDateRange,
      ); // at least 1
      const dateRanges = createNormalDistributionDates(numOfDateRanges);
      return await Promise.all(
        dateRanges.map((dateRange) =>
          scrapeDirectListings({
            checkIn: dateRange.checkIn,
            checkOut: dateRange.checkOut,
            location: "San Francisco", // TODO TEMP AAAAAAAAAAAAAAAAAAAAA YEAH 😃
            requestNightlyPrice: 100, // TODO TEMP
          }),
        ),
      ).then((res) => res.flat());
    }),

  scrapeOfferForRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
        numOfOffers: z.number().min(1).max(50),
        // scrapersToExecute: z
        //   .array(z.string())
        //   .default(directSiteScrapers.map((s) => s.name)), // execute all scrapers by default
        location: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.requestId),
        columns: {
          checkIn: true,
          checkOut: true,
          maxTotalPrice: true,
          numGuests: true,
        },
      });
      if (!request) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Request not found",
        });
      }
      return await scrapeDirectListings({
        checkIn: request.checkIn,
        checkOut: request.checkOut,
        requestNightlyPrice:
          request.maxTotalPrice /
          getNumNights(request.checkIn, request.checkOut),
        requestId: input.requestId,
        location: input.location,
        numGuests: request.numGuests,
      }).catch((error) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error scraping listings. " + error,
        });
      });
    }),

  isOfferScrapedByTripId: protectedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const curTrip = await db.query.trips.findFirst({
        where: eq(trips.id, input),
        with: {
          offer: {
            columns: {
              scrapeUrl: true,
            },
          },
        },
      });
      return curTrip?.offer?.scrapeUrl !== null;
    }),
});

export async function getPropertyForOffer(propertyId: number) {
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId),
    with: {
      reviews: true,
      host: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
          about: true,
          location: true,
        },
        with: {
          hostProfile: {
            columns: {
              userId: true,
            },
          },
        },
      },
    },
  });
  if (!property) throw new Error("No Property was found");
  return property;
}

export async function getOfferPageData(offerId: number) {
  const offer = await db.query.offers.findFirst({
    where: eq(offers.id, offerId),
    columns: {
      id: true,
      checkIn: true,
      checkOut: true,
      createdAt: true,
      totalPrice: true,
      acceptedAt: true,
      propertyId: true,
      requestId: true,
      hostPayout: true,
      travelerOfferedPriceBeforeFees: true,
      scrapeUrl: true,
      isAvailableOnOriginalSite: true,
      randomDirectListingDiscount: true,
      datePriceFromAirbnb: true,
      tripCheckoutId: true,
    },
    with: {
      tripCheckout: true,
      request: {
        with: {
          madeByGroup: { with: { members: true } },
        },
        columns: {
          numGuests: true,
          location: true,
          id: true,
        },
      },
    },
  });
  if (!offer) throw new Error("No offer found");
  return offer;
}
