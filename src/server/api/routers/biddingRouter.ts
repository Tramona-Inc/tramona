import {
  bidInsertSchema,
  bidSelectSchema,
  bids,
  groupMembers,
  groups,
  hostTeamMembers,
  properties,
} from "@/server/db/schema";
import {
  counterInsertSchema,
  counters,
} from "@/server/db/schema/tables/counters";
import { TRPCError } from "@trpc/server";
import { and, eq, exists, isNull } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
        property: true,
      },
    });
  }),

  create: protectedProcedure
    .input(bidInsertSchema.omit({ madeByGroupId: true }))
    .mutation(async ({ ctx, input }) => {
      // Check if already exists
      const bidExist = await ctx.db.query.bids.findMany({
        where: exists(
          ctx.db
            .select()
            .from(groupMembers)
            .where(
              and(
                eq(groupMembers.groupId, bids.madeByGroupId),
                eq(groupMembers.userId, ctx.user.id),
                eq(bids.propertyId, input.propertyId),
              ),
            ),
        ),
        columns: {
          propertyId: true,
        },
      });

      if (bidExist.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      } else {
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
        where: and(eq(bids.propertyId, propertyId), isNull(bids.resolvedAt)),
      });
    }),

  accept: protectedProcedure
    .input(z.object({ bidId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // todo: authorizaiton

      // todo: send travellers email

      await ctx.db
        .update(bids)
        .set({ resolvedAt: new Date() })
        .where(eq(bids.id, input.bidId));
    }),

  getAllPropertyBids: protectedProcedure.query(async ({ ctx }) => {
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
});
