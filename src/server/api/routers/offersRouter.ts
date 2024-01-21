import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  offerInsertSchema,
  offerSelectSchema,
  offers,
  properties,
  referralCodes,
  requestSelectSchema,
  requests,
} from "@/server/db/schema";
import { formatArrayToString } from "@/utils/utils";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";

export const offersRouter = createTRPCRouter({
  accept: protectedProcedure
    .input(offerSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const offerDetails = await ctx.db.query.offers.findFirst({
        where: eq(offers.id, input.id),
        columns: { totalPrice: true },
        with: {
          request: {
            columns: {
              id: true,
            },
            with: {
              madeByUser: {
                columns: { id: true },
              },
            },
          },
        },
      });

      // request must still exist
      if (!offerDetails?.request) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      // you can only accept your own offers
      if (offerDetails.request.madeByUser.id !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
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
        columns: {
          createdAt: true,
          totalPrice: true,
          id: true,
        },
        with: {
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

  makePublic: roleRestrictedProcedure(["admin", "host"])
    .input(offerSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "host") {
        const request = await ctx.db.query.offers.findFirst({
          where: eq(offers.id, input.id),
          columns: {},
          with: {
            property: {
              columns: {
                hostId: true,
              },
            },
          },
        });

        if (
          ctx.user.role === "host" &&
          request?.property.hostId !== ctx.user.id
        ) {
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

  create: roleRestrictedProcedure(["admin", "host"])
    .input(offerInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const requestPromise = ctx.db.query.requests.findFirst({
        where: eq(requests.id, input.requestId),
      });

      const propertyPromise = ctx.db.query.properties.findFirst({
        where: eq(properties.id, input.propertyId),
      });

      const [request, property] = await Promise.all([
        requestPromise,
        propertyPromise,
      ]);

      // request must exist,
      if (!request) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That request doesn't exist",
        });
      }

      // ...be unresolved,
      if (request?.resolvedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That request was already resolved",
        });
      }

      // ...host must own property (or its an admin),
      if (ctx.user.role === "host" && property?.hostId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // ...and the property must fulfill the request
      const notEnoughSpace =
        property?.maxNumGuests != null &&
        request.numGuests > property.maxNumGuests;

      const tooFewBeds =
        request.minNumBeds != null &&
        property?.numBeds != null &&
        request.minNumBeds < property.numBeds;

      const tooFewBedrooms =
        request.minNumBedrooms != null &&
        property?.numBedrooms != null &&
        request.minNumBedrooms < property.numBedrooms;

      const wrongPropertyType =
        request.propertyType != null &&
        property?.propertyType != null &&
        request.propertyType !== property.propertyType;

      const tooExpensive = input.totalPrice > request.maxTotalPrice;

      if (notEnoughSpace || tooFewBeds || tooFewBedrooms || wrongPropertyType) {
        const messagesMap = [
          ["doesn't accomodate enough guests", notEnoughSpace],
          ["doesn't have enough beds", tooFewBeds],
          ["doesn't have enough bedrooms", tooFewBedrooms],
          ["is the wrong type", wrongPropertyType],
          ["is too expensive", tooExpensive],
        ] as const;

        const errorMessage = formatArrayToString(
          messagesMap.filter((x) => x[1]).map((x) => x[0]),
        );

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `That property ${errorMessage}`,
        });
      }

      // yay
      await ctx.db.insert(offers).values(input);
    }),

  delete: roleRestrictedProcedure(["admin", "host"])
    .input(offerSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "host") {
        const request = await ctx.db.query.offers.findFirst({
          where: eq(offers.id, input.id),
          columns: {},
          with: {
            property: {
              columns: {
                hostId: true,
              },
            },
          },
        });

        if (
          ctx.user.role === "host" &&
          request?.property.hostId !== ctx.user.id
        ) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(offers).where(eq(offers.id, input.id));
    }),
});
