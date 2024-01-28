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
            columns: { id: true },
            with: {
              madeByUser: { columns: { id: true } },
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

  getAllOffers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.offers.findMany({
      // where: isNotNull(offers.acceptedAt),
      columns: { acceptedAt: false },
      with: {
        property: {
          with: {
            host: { columns: { name: true, email: true, image: true } },
          },
          columns: { name: true, originalNightlyPrice: true, imageUrls: true },
        },
        request: {
          columns: { userId: true, checkIn: true, checkOut: true },
          with: {
            madeByUser: { columns: { name: true } }, // Fetch user name
          },
        },
      },
      orderBy: desc(offers.createdAt),
    });
  }),

  create: roleRestrictedProcedure(["admin", "host"])
    .input(offerInsertSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "host") {
        const property = await ctx.db.query.properties.findFirst({
          where: eq(properties.id, input.propertyId),
          columns: { hostId: true },
        });

        if (ctx.user.role === "host" && property?.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

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
            property: { columns: { hostId: true } },
          },
        });

        if (request?.property.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(offers).where(eq(offers.id, input.id));
    }),
});
