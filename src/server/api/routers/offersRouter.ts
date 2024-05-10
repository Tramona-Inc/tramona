import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  groupMembers,
  groups,
  offerInsertSchema,
  offerSelectSchema,
  offerUpdateSchema,
  offers,
  properties,
  referralCodes,
  requestSelectSchema,
  requests,
  requestsToProperties,
} from "@/server/db/schema";
import { getAddress, getCoordinates } from "@/server/google-maps";
import { sendText, sendWhatsApp } from "@/server/server-utils";
import { formatDateRange } from "@/utils/utils";

import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";
import { z } from "zod";

export const offersRouter = createTRPCRouter({
  accept: protectedProcedure
    .input(offerSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const offerDetails = await ctx.db.query.offers.findFirst({
        where: eq(offers.id, input.id),
        columns: { totalPrice: true },
        with: {
          request: {
            columns: { id: true },
            with: { madeByGroup: { columns: { ownerId: true } } },
          },
        },
      });

      // request must still exist
      if (!offerDetails?.request) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // only the owner of the group can accept offers
      if (offerDetails.request.madeByGroup.ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db.transaction(async (tx) => {
        const results = await Promise.allSettled([
          // resolve the request
          tx
            .update(requests)
            .set({ resolvedAt: new Date() })
            .where(eq(offers.id, offerDetails.request.id)),

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
                totalBookingVolume: sql`${referralCodes.totalBookingVolume} + ${offerDetails.totalPrice}`,
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

  getByRequestIdWithProperty: protectedProcedure
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

      return await ctx.db.query.offers.findMany({
        where: eq(offers.requestId, input.id),
        columns: {
          createdAt: true,
          totalPrice: true,
          id: true,
          acceptedAt: true,
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
            with: { madeByGroup: { with: { members: true } } },
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
    }),

  getCoordinates: protectedProcedure
    .input(z.object({ location: z.string() }))
    .query(async ({ input }) => {
      return {
        coordinates: await getCoordinates(input.location),
      };
    }),

  getCity: protectedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { latitude, longitude } = input;

      const addressComponents = await getAddress({
        lat: latitude,
        lng: longitude,
      });

      if (!addressComponents) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const city = addressComponents.find((component) =>
        component.types.includes("locality"),
      )?.long_name;

      const state = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1"),
      )?.short_name;

      return { city, state };
    }),

  getByIdWithDetails: protectedProcedure
    .input(offerSelectSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const offer = await ctx.db.query.offers.findFirst({
        where: eq(offers.id, input.id),
        columns: {
          createdAt: true,
          totalPrice: true,
          acceptedAt: true,
          id: true,
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
            with: { madeByGroup: { with: { members: true } } },
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

      const memberIds = offer.request.madeByGroup.members.map(
        (member) => member.userId,
      );

      if (!memberIds.includes(ctx.user.id) && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
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

  getAllPublicOffers: publicProcedure.query(async ({ ctx }) => {
    return (
      await ctx.db.query.offers.findMany({
        where: and(
          isNull(offers.acceptedAt),
          lt(offers.madePublicAt, new Date()),
        ),
        columns: { acceptedAt: false },
        with: {
          property: {
            with: {
              host: { columns: { name: true, email: true, image: true } },
            },
          },
          request: { columns: { checkIn: true, checkOut: true } },
        },
        orderBy: desc(offers.madePublicAt),
      })
    ).map((offer) => ({
      ...offer,
      madePublicAt: offer.madePublicAt ?? new Date(), // will never be null, just fixes types
    }));
  }),

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

  getStripePaymentIntentAndCheckoutSessionId: protectedProcedure
    .input(offerSelectSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.offers.findFirst({
        where: eq(offers.id, input.id),
        columns: { paymentIntentId: true, checkoutSessionId: true },
      });
    }),

  acceptCityRequest: protectedProcedure
    .input(
      offerInsertSchema.pick({
        requestId: true,
        propertyId: true,
        totalPrice: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const propertyHostTeam = await ctx.db.query.properties
        .findFirst({
          where: eq(properties.id, input.propertyId),
          columns: { id: true },
          with: {
            hostTeam: { with: { members: true } },
          },
        })
        .then((res) => res?.hostTeam);

      if (!propertyHostTeam) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if (
        !propertyHostTeam.members.find(
          (member) => member.userId === ctx.user.id,
        )
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db.insert(offers).values(input);

      await ctx.db
        .delete(requestsToProperties)
        .where(
          and(
            eq(requestsToProperties.propertyId, input.propertyId),
            eq(requestsToProperties.requestId, input.requestId),
          ),
        );
    }),

  create: roleRestrictedProcedure(["admin", "host"])
    .input(offerInsertSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "host") {
        const property = await ctx.db.query.properties.findFirst({
          where: eq(properties.id, input.propertyId),
          columns: { hostId: true },
        });

        if (property?.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.insert(offers).values(input);
    }),

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
        columns: {},
        with: {
          property: { columns: { hostId: true, name: true } },
          request: {
            columns: {
              checkIn: true,
              checkOut: true,
              id: true,
              location: true,
            },
            with: {
              madeByGroup: {
                with: {
                  members: {
                    with: {
                      user: {
                        columns: { phoneNumber: true, isWhatsApp: true },
                      },
                    },
                  },
                },
              },
            },
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

      const groupOwner = await ctx.db.query.groups
        .findFirst({
          where: eq(groups.id, request.madeByGroup.id),
          with: {
            owner: {
              columns: { id: true, phoneNumber: true, isWhatsApp: true },
            },
          },
        })
        .then((res) => res?.owner);

      if (!groupOwner) return;

      const groupOwnerHasOtherOffers = await ctx.db.query.groupMembers
        .findFirst({
          where: eq(groupMembers.userId, groupOwner.id),
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

      const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
      const url = `${env.NEXTAUTH_URL}/requests`;

      if (groupOwner.phoneNumber) {
        if (groupOwner.isWhatsApp) {
          groupOwnerHasOtherOffers
            ? void sendWhatsApp({
                templateId: "HXd5256ff10d6debdf70a13d70504d39d5",
                to: groupOwner.phoneNumber,
                propertyName: property.name,
                propertyAddress: request.location, //??can this be null
                checkIn: request.checkIn,
                checkOut: request.checkOut,
                url: url,
              })
            : void sendWhatsApp({
                templateId: "HXb293923af34665e7eefc81be0579e5db",
                to: groupOwner.phoneNumber,
                propertyName: property.name,
                propertyAddress: request.location,
                checkIn: request.checkIn,
                checkOut: request.checkOut,
              });
        } else {
          void sendText({
            to: groupOwner.phoneNumber,
            content: `Tramona: Hello, your ${property.name} in ${request.location} offer from ${fmtdDateRange} has expired.${groupOwnerHasOtherOffers ? `Please tap below view your other offers: ${url}` : ""}`,
          });
        }
      }
    }),
});
