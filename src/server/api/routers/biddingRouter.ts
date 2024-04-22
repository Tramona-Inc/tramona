import {
  bidInsertSchema,
  bidSelectSchema,
  bids,
  groupMembers,
  groups,
  requestGroups,
} from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const biddingRouter = createTRPCRouter({
  getMyBids: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.bids.findMany({});
  }),
  create: protectedProcedure
    .input(bidInsertSchema.omit({ madeByGroupId: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        try {
          const requestGroupId = await tx
            .insert(requestGroups)
            .values({ createdByUserId: ctx.user.id, hasApproved: true })
            .returning()
            .then((res) => res[0]!.id);

          const madeByGroupId = await tx
            .insert(groups)
            .values({ ownerId: ctx.user.id })
            .returning()
            .then((res) => res[0]!.id);

          await tx.insert(groupMembers).values({
            userId: ctx.user.id,
            groupId: madeByGroupId,
          });

          await tx
            .insert(bids)
            .values({ ...input, madeByGroupId: madeByGroupId });
        } catch (error) {
          return new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: JSON.stringify(error),
          });
        }
      });
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
});
