import { env } from "@/env";
import { db } from "@/server/db";
import {
  type Bid,
  bidInsertSchema,
  bidSelectSchema,
  bids,
  groupMembers,
  groups,
  hostTeamMembers,
  properties,
  trips,
  users,
} from "@/server/db/schema";
import {
  counterInsertSchema,
  counters,
} from "@/server/db/schema/tables/counters";
import { getNumNights } from "@/utils/utils";
import { zodInteger } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import { add } from "date-fns";
import { and, desc, eq, exists, inArray } from "drizzle-orm";
import { random } from "lodash";
import { z } from "zod";
import {
  createTRPCRouter,
  optionallyAuthedProcedure,
  protectedProcedure,
  roleRestrictedProcedure,
} from "../trpc";
import { stripe } from "./stripeRouter";

async function updateBidStatus({
  id,
  status,
  paymentIntentId,
}: {
  id: number;
  status: Bid["status"];
  paymentIntentId?: string;
}) {
  await db.transaction(async (tx) => {
    await tx.update(bids).set({ status }).where(eq(bids.id, id));
    await tx
      .update(bids)
      .set({ statusUpdatedAt: new Date() })
      .where(eq(bids.id, id));
    if (paymentIntentId) {
      await tx
        .update(bids)
        .set({ paymentIntentId: paymentIntentId })
        .where(eq(bids.id, id));
    }
    if (status === "Accepted") {
      await tx
        .update(bids)
        .set({ acceptedAt: new Date() })
        .where(eq(bids.id, id));
    }
  });
}

async function userWithBid({
  userId,
  bidId,
}: {
  userId: string;
  bidId: number;
}) {
  const hostId = await db.query.bids
    .findFirst({
      where: eq(bids.id, bidId),
      columns: {},
      with: { property: { columns: { hostId: true } } },
    })
    .then((res) => res?.property.hostId);

  const bidInfo = await db.query.bids.findFirst({
    where: eq(bids.id, bidId),
    with: {
      madeByGroup: {
        with: { members: { with: { user: true } }, invites: true },
      },
    },
  });

  const bidUserId = bidInfo?.madeByGroup.ownerId;

  return bidUserId === userId || hostId === userId;
}

export const biddingRouter = createTRPCRouter({
  // ! update query so host/admin can see all the queries (add when we work on host flow)
  getMyBids: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.bids.findMany({
      where: exists(
        ctx.db
          .select()
          .from(groupMembers)
          .where(
            and(
              eq(groupMembers.groupId, bids.madeByGroupId),
              eq(groupMembers.userId, ctx.user.id),
            ),
          ),
      ),
      orderBy: (counters, { desc }) => [desc(bids.createdAt)],
      with: {
        property: {
          columns: {
            id: true,
            imageUrls: true,
            name: true,
            address: true,
            originalNightlyPrice: true,
            longitude: true,
            latitude: true,
          },
        },
        madeByGroup: {
          with: { members: { with: { user: true } }, invites: true },
        },
        // Gets the latest counter
        counters: {
          orderBy: (counters, { desc }) => [desc(counters.createdAt)],
          columns: {
            id: true,
            counterAmount: true,
            createdAt: true,
            status: true,
            userId: true,
          },
        },
      },
    });
  }),

  getBidInfo: protectedProcedure
    .input(
      z.object({
        bidId: zodInteger(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.bids.findFirst({
        where: eq(bids.id, input.bidId),
      });
    }),

  create: protectedProcedure
    .input(bidInsertSchema.omit({ madeByGroupId: true }))
    .mutation(async ({ ctx, input }) => {
      // Check if already exists
      // const bidExist = await ctx.db.query.bids.findMany({
      //   where: exists(
      //     ctx.db
      //       .select()
      //       .from(groupMembers)
      //       .where(
      //         and(
      //           eq(groupMembers.groupId, bids.madeByGroupId),
      //           eq(groupMembers.userId, ctx.user.id),
      //           eq(bids.propertyId, input.propertyId),
      //         ),
      //       ),
      //   ),
      //   columns: {
      //     propertyId: true,
      //   },
      // });

      // ! uncomment to prevent duplicate bids
      // if (bidExist.length > 0) {
      //   throw new TRPCError({ code: "BAD_REQUEST" });
      // } else {

      const madeByGroupId = await ctx.db
        .insert(groups)
        .values({ ownerId: ctx.user.id })
        .returning()
        .then((res) => res[0]!.id);

      await ctx.db.insert(groupMembers).values({
        userId: ctx.user.id,
        groupId: madeByGroupId,
      });

      await ctx.db
        .insert(bids)
        .values({ ...input, madeByGroupId: madeByGroupId })
        .returning({ id: bids.id });
    }),
  update: protectedProcedure
    .input(bidInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const bid = await ctx.db.query.bids.findFirst({
        where: eq(bids.id, input.id!),
      });

      if (!bid) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.db
        .update(bids)
        .set({ updatedAt: new Date(), amount: input.amount })
        .where(eq(bids.id, input.id!));
    }),

  edit: protectedProcedure
    .input(
      z.object({
        nightlyPrice: z.number(),
        guests: z.number(),
        offerId: z.number(),
        date: z.object({
          from: z.coerce.date(),
          to: z.coerce.date(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const totalNights = getNumNights(input.date.from, input.date.to);

      await ctx.db
        .update(bids)
        .set({
          checkIn: input.date.from,
          checkOut: input.date.to,
          amount: input.nightlyPrice * 100 * totalNights,
          statusUpdatedAt: new Date(),
        })
        .where(eq(bids.id, input.offerId));
    }),

  delete: protectedProcedure
    .input(bidSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        const groupOwnerId = await ctx.db.query.bids
          .findFirst({
            where: eq(bids.id, input.id),
            columns: {},
            with: {
              madeByGroup: { columns: { ownerId: true } },
            },
          })
          .then((res) => res?.madeByGroup.ownerId);

        if (!groupOwnerId) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }

        if (ctx.user.id !== groupOwnerId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(bids).where(eq(bids.id, input.id));
    }),

  getByPropertyId: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: propertyId }) => {
      const propertyHostTeamId = await ctx.db.query.properties
        .findFirst({
          where: eq(properties.id, propertyId),
          columns: { hostTeamId: true },
        })
        .then((res) => res?.hostTeamId);

      if (!propertyHostTeamId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const userHostTeamIds = await ctx.db.query.hostTeamMembers
        .findMany({
          where: eq(hostTeamMembers.userId, ctx.user.id),
        })
        .then((res) => res.map((x) => x.hostTeamId));

      if (!userHostTeamIds.includes(propertyHostTeamId)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await ctx.db.query.bids.findMany({
        where: and(eq(bids.propertyId, propertyId), eq(bids.status, "Pending")),
        with: {
          counters: {
            orderBy: (counters, { desc }) => [desc(counters.createdAt)],
            limit: 2,
            columns: {
              id: true,
              counterAmount: true,
              createdAt: true,
              status: true,
              userId: true,
            },
          },
        },
      });
    }),

  getAllPending: roleRestrictedProcedure(["admin"]).query(async () => {
    return await db.query.bids.findMany({
      with: {
        madeByGroup: {
          with: { members: { with: { user: true } }, invites: true },
        },
        property: {
          columns: {
            id: true,
            name: true,
            address: true,
            imageUrls: true,
            originalNightlyPrice: true,
            longitude: true,
            latitude: true,
            originalListingUrl: true,
          },
        },
        counters: {
          orderBy: (counters, { desc }) => [desc(counters.createdAt)],
          limit: 1,
          columns: {
            id: true,
            counterAmount: true,
            createdAt: true,
            status: true,
            userId: true,
          },
        },
      },
      where: eq(bids.status, "Pending"),
      orderBy: desc(bids.createdAt),
    });
  }),

  getAllAccepted: roleRestrictedProcedure(["admin"]).query(async () => {
    return await db.query.bids.findMany({
      with: {
        madeByGroup: {
          with: { members: { with: { user: true } }, invites: true },
        },
        property: {
          columns: {
            id: true,
            name: true,
            address: true,
            imageUrls: true,
            originalNightlyPrice: true,
            longitude: true,
            latitude: true,
            originalListingUrl: true,
          },
        },
        counters: {
          orderBy: (counters, { desc }) => [desc(counters.createdAt)],
          limit: 1,
          columns: {
            id: true,
            counterAmount: true,
            createdAt: true,
            status: true,
            userId: true,
          },
        },
      },
      where: eq(bids.status, "Accepted"),
      orderBy: desc(bids.createdAt),
    });
  }),

  getAllPropertyBids: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];

    const result = await ctx.db.query.bids.findMany({
      where: exists(
        ctx.db
          .select()
          .from(groupMembers)
          .where(
            and(
              eq(groupMembers.groupId, bids.madeByGroupId),
              eq(groupMembers.userId, ctx.user.id),
            ),
          ),
      ),
      columns: {
        propertyId: true,
      },
    });

    return result.map((res) => res.propertyId);
  }),

  getDatesFromBid: protectedProcedure
    .input(
      z.object({
        propertyId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.bids.findMany({
        columns: {
          checkIn: true,
          checkOut: true,
        },
        where: and(
          eq(bids.propertyId, input.propertyId),
          eq(bids.status, "Pending"),
        ),
      });
    }),

  createCounter: protectedProcedure
    .input(counterInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { bidId, propertyId, userId, counterAmount } = input;

      // const totalCounters = ctx.db
      //   .select({
      //     value: count(),
      //   })
      //   .from(counters)
      //   .where(eq(counters.userId, ctx.user.id));

      await ctx.db
        .insert(counters)
        .values({ bidId, propertyId, userId, counterAmount });
    }),

  accept: protectedProcedure
    .input(z.object({ bidId: z.number(), amount: z.number() }))
    .mutation(async ({ input }) => {
      const bidInfo = await db.query.bids.findFirst({
        where: eq(bids.id, input.bidId),
        with: {
          madeByGroup: {
            with: { members: { with: { user: true } }, invites: true },
          },
        },
      });

      if (!bidInfo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const groupOwner = await db.query.users.findFirst({
        where: eq(users.id, bidInfo.madeByGroup.ownerId),
      });

      if (!groupOwner) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const metadata = {
        bid_id: input.bidId,
        property_id: bidInfo.propertyId,
        confirmed_at: new Date().toUTCString(),
      };

      if (groupOwner.stripeCustomerId && bidInfo.paymentMethodId) {
        // Create payment intent
        const pi = await stripe.paymentIntents.create({
          payment_method: bidInfo.paymentMethodId,
          amount: input.amount,
          currency: "usd",
          capture_method: "automatic", // Change capture_method to automatic
          metadata: metadata, // metadata access for checkout session
          customer: groupOwner.stripeCustomerId, // Add null check for 'user' variable
          return_url: `${env.NEXTAUTH_URL}/my-trips`, // Specify return_url here
          confirm: true,
        });

        if (pi.status === "succeeded") {
          await updateBidStatus({
            id: input.bidId,
            status: "Accepted",
            paymentIntentId: pi.id,
          });

          await db.insert(trips).values({
            checkIn: bidInfo.checkIn,
            checkOut: bidInfo.checkOut,
            numGuests: bidInfo.numGuests,
            propertyId: bidInfo.propertyId,
            groupId: bidInfo.madeByGroupId,
            bidId: input.bidId,
          });
        }
      }
      // TODO: email travllers
    }),

  reject: protectedProcedure
    .input(z.object({ bidId: z.number() }))
    .mutation(async ({ input }) => {
      // const userIsWithBid = await userWithBid({
      //   userId: ctx.user.id,
      //   bidId: input.bidId,
      // });

      await updateBidStatus({ id: input.bidId, status: "Rejected" });

      // if (!userIsWithBid) {
      //   throw new TRPCError({ code: "UNAUTHORIZED" });
      // } else {
      // await updateBidStatus({ id: input.bidId, status: "Rejected" });
      // }

      // TODO: email travellers
    }),

  cancel: protectedProcedure
    .input(z.object({ bidId: z.number() }))
    .mutation(async ({ input }) => {
      // const userIsWithBid = await userWithBid({
      //   userId: ctx.user.id,
      //   bidId: input.bidId,
      // });

      // if (!userIsWithBid) {
      //   throw new TRPCError({ code: "UNAUTHORIZED" });
      // } else {
      // await updateBidStatus({ id: input.bidId, status: "Rejected" });
      // }
      const paymentIntentId = await db
        .select({ paymentIntentId: bids.paymentIntentId })
        .from(bids)
        .where(eq(bids.id, input.bidId))
        .then((res) => res[0]?.paymentIntentId);

      if (paymentIntentId == null) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
      });

      if (refund.status !== "succeeded") {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await updateBidStatus({ id: input.bidId, status: "Cancelled" });

      // TODO: email travellers
    }),

  createRandom: protectedProcedure.mutation(async ({ ctx }) => {
    const groupId = await ctx.db
      .insert(groups)
      .values({ ownerId: ctx.user.id })
      .returning()
      .then((res) => res[0]!.id);

    await ctx.db.insert(bids).values({
      amount: random(200, 300) * 100,
      checkIn: add(new Date(), { days: random(1, 10) }),
      checkOut: add(new Date(), { days: random(11, 20) }),
      madeByGroupId: groupId,
      propertyId: random(3000, 6000),
      numGuests: random(1, 5),
    });
  }),

  getAllHostPending: roleRestrictedProcedure(["host"]).query(
    async ({ ctx }) => {
      const allHostProperties = (
        await db.query.properties.findMany({
          where: eq(properties.hostId, ctx.user.id),
          columns: {
            id: true,
          },
        })
      ).map((property) => property.id);

      const allActiveBids = await db.query.bids.findMany({
        with: {
          madeByGroup: {
            with: { members: { with: { user: true } }, invites: true },
          },
          property: {
            columns: {
              id: true,
              name: true,
              address: true,
              imageUrls: true,
              originalNightlyPrice: true,
              originalListingUrl: true,
              longitude: true,
              latitude: true,
            },
          },
          counters: {
            orderBy: (counters, { desc }) => [desc(counters.createdAt)],
            limit: 1,
            columns: {
              id: true,
              counterAmount: true,
              createdAt: true,
              status: true,
              userId: true,
            },
          },
        },
        where: and(
          eq(bids.status, "Pending"),
          inArray(bids.propertyId, allHostProperties),
        ),
        orderBy: desc(bids.createdAt),
      });

      return allActiveBids;
    },
  ),
});
