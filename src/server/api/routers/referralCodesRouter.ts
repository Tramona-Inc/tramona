import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { referralCodes, users } from '@/server/db/schema';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';

export const referralCodesRouter = createTRPCRouter({
  startUsingCode: protectedProcedure
    .input(
      createSelectSchema(referralCodes).pick({
        referralCode: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userDetails = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {
          referralCodeUsed: true,
        },
      });

      if (userDetails?.referralCodeUsed) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You already used a referral code',
        });
      }

      const code = await ctx.db.query.referralCodes.findFirst({
        where: eq(referralCodes.referralCode, input.referralCode),
        columns: {
          ownerId: true,
        },
      });

      if (!code) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid referral code',
        });
      }

      const referralCodeOwner = await ctx.db.query.users.findFirst({
        where: eq(users.id, code.ownerId),
        columns: {
          name: true,
          email: true,
        },
      });

      return {
        codeOwnerName: referralCodeOwner?.name ?? 'an anonymous person',
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
        code: 'BAD_REQUEST',
        message: "You don't have a referral code",
      });
    }

    await ctx.db.update(users).set({ referralCodeUsed: null }).where(eq(users.id, ctx.user.id));
  }),
});
