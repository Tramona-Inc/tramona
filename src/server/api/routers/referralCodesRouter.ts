import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { referralCodes, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

export const referralCodesRouter = createTRPCRouter({
  startUsingCode: protectedProcedure
    .input(
      createSelectSchema(referralCodes).pick({
        referralCode: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.referralCodeUsed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already used a referral code",
        });
      }

      const referralCode = await ctx.db.query.referralCodes.findFirst({
        where: eq(referralCodes.referralCode, input.referralCode),
        columns: {
          ownerId: true,
        },
      });

      if (!referralCode) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid referral code",
        });
      }

      await ctx.db.transaction(async (tx) => {
        const results = await Promise.allSettled([
          // use the referral code
          tx
            .update(users)
            .set({ referralCodeUsed: input.referralCode })
            .where(eq(users.id, ctx.user.id)),

          // increment numSignUpsUsingCode
          tx
            .update(referralCodes)
            .set({
              numSignUpsUsingCode: sql`${referralCodes.numSignUpsUsingCode} + 1`,
            })
            .where(eq(referralCodes.referralCode, input.referralCode)),
        ]);

        if (results.some((result) => result.status === "rejected")) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      });

      const referralCodeOwner = await ctx.db.query.users.findFirst({
        where: eq(users.id, referralCode.ownerId),
        columns: {
          name: true,
          email: true,
        },
      });

      return {
        codeOwnerName: referralCodeOwner?.name ?? "an anonymous person",
      };
    }),

  stopUsingCode: protectedProcedure.query(async ({ ctx }) => {
    const userDetails = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        referralCodeUsed: true,
      },
    });

    if (!userDetails?.referralCodeUsed) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You don't have a referral code",
      });
    }

    await ctx.db
      .update(users)
      .set({ referralCodeUsed: null })
      .where(eq(users.id, ctx.user.id));
  }),
});
