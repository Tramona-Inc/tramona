import {
  type Bid,
  bidInsertSchema,
  bidSelectSchema,
  bids,
  groupMembers,
  groups,
  hostTeamMembers,
  properties,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, exists, isNull } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { random } from "lodash";
import { add } from "date-fns";

async function updateBidStatus({
  id,
  status,
}: {
  id: number;
  status: Bid["status"];
}) {
  await db.transaction(async (tx) => {
    await tx.update(bids).set({ status }).where(eq(bids.id, id));
    await tx
      .update(bids)
      .set({ statusUpdatedAt: new Date() })
      .where(eq(bids.id, id));
  });
}

export const biddingRouter = createTRPCRouter({
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
      with: {
        property: {
          columns: { id: true, imageUrls: true, name: true, address: true },
        },
        madeByGroup: {
          with: { members: { with: { user: true } }, invites: true },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(bidInsertSchema.omit({ madeByGroupId: true }))
    .mutation(async ({ ctx, input }) => {
      try {
        // const requestGroupId = await tx
        //   .insert(requestGroups)
        //   .values({ createdByUserId: ctx.user.id, hasApproved: true })
        //   .returning()
        //   .then((res) => res[0]!.id);

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
          .values({ ...input, madeByGroupId: madeByGroupId });
      } catch (error) {
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: JSON.stringify(error),
        });
      }
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
      });
    }),

  getAllPending: roleRestrictedProcedure(["admin"]).query(async () => {
    return await db.query.bids.findMany({
      with: {
        madeByGroup: {
          with: { members: { with: { user: true } }, invites: true },
        },
        property: {
          columns: { id: true, name: true, address: true, imageUrls: true },
        },
      },
      where: eq(bids.status, "Pending"),
      orderBy: desc(bids.createdAt),
    });
  }),

  accept: protectedProcedure
    .input(z.object({ bidId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        const hostId = await ctx.db.query.bids
          .findFirst({
            where: eq(bids.id, input.bidId),
            columns: {},
            with: { property: { columns: { hostId: true } } },
          })
          .then((res) => res?.property.hostId);

        if (hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await updateBidStatus({ id: input.bidId, status: "Accepted" });

      // TODO: email travellers
    }),

  reject: protectedProcedure
    .input(z.object({ bidId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        const hostId = await ctx.db.query.bids
          .findFirst({
            where: eq(bids.id, input.bidId),
            columns: {},
            with: { property: { columns: { hostId: true } } },
          })
          .then((res) => res?.property.hostId);

        if (hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await updateBidStatus({ id: input.bidId, status: "Rejected" });

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
});
