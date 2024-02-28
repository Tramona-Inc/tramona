import { RequestCashback } from "@/components/email-templates/RequestCashback";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { referralCodes, referralEarnings, users } from "@/server/db/schema";
import { sendEmail } from "@/server/server-utils";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { type Referral } from "@/components/account/cashback/referrals";

export const referralCodesRouter = createTRPCRouter({
  startUsingCode: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.referralCodeUsed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already used a referral code",
        });
      }

      const referralCode = await ctx.db.query.referralCodes.findFirst({
        where: eq(referralCodes.referralCode, input),
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

      if (referralCode.ownerId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot use your own referral code",
        });
      }

      await ctx.db.transaction(async (tx) => {
        const results = await Promise.allSettled([
          // use the referral code
          tx
            .update(users)
            .set({ referralCodeUsed: input })
            .where(eq(users.id, ctx.user.id)),

          // increment numSignUpsUsingCode
          tx
            .update(referralCodes)
            .set({
              numSignUpsUsingCode: sql`${referralCodes.numSignUpsUsingCode} + 1`,
            })
            .where(eq(referralCodes.referralCode, input)),
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
          image: true,
        },
      });

      return {
        owner: {
          name: referralCodeOwner?.name ?? "an anonymous person",
          image: referralCodeOwner?.image ?? null,
        },
      };
    }),

  stopUsingCode: protectedProcedure.mutation(async ({ ctx }) => {
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

  verifyCode: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const code = await ctx.db.query.referralCodes.findFirst({
        where: eq(referralCodes.referralCode, input),
        columns: {
          referralCode: true,
        },
      });
      return !!code;
    }),

  getReferralEarnings: protectedProcedure.query(async ({ ctx }) => {
    const userReferralCode = await ctx.db.query.referralCodes.findFirst({
      where: eq(referralCodes.ownerId, ctx.user.id),
    });

    if (userReferralCode) {
      const earnings = await ctx.db.query.referralEarnings.findMany({
        with: {
          refereeId: {
            columns: {
              name: true,
            },
          },
        },
        where: eq(referralEarnings.referralCode, userReferralCode.referralCode),
      });

      return earnings;
    }
  }),
  sendCashbackRequest: protectedProcedure
    .input(z.object({ transactions: z.string() }))
    .mutation(async ({ ctx }) => {
      const name = ctx.user.name;

      // await sendEmail({
      //   to: "info@tramona.com",
      //   subject: `Cashback payout request from ${name}`,
      //   content: RequestCashback({
      //     name: name,
      //     transactions: selectedRows,
      //   }),
      // });
    }),
});
