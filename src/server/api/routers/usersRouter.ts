import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { referralCodes, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { generateReferralCode } from "@/utils/utils";
import { zodString } from "@/utils/zod-utils";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      columns: {
        role: true,
        referralCodeUsed: true,
      },
    });

    return {
      role: res?.role ?? "guest",
      referralCodeUsed: res?.referralCodeUsed ?? null,
    };
  }),
  myReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const referralCode = await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {},
        with: {
          referralCode: true,
        },
      })
      .then((res) => res?.referralCode ?? null);

    // If no referral code genereated
    if (!referralCode) {
      const [generatedCode] = await ctx.db
        .insert(referralCodes)
        .values({ ownerId: ctx.user.id, referralCode: generateReferralCode() })
        .returning();

      return generatedCode;
    }

    return referralCode;
  }),
  insertReferralCode: protectedProcedure
    .input(
      z.object({
        referralCode: z
          .string()
          .min(7, { message: "Invalid Code" })
          .max(7, { message: "Invalid Code" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const insertedReferral = await ctx.db
        .update(users)
        .set({
          referralCodeUsed: input.referralCode,
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return insertedReferral;
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: zodString(),
        email: zodString().email(),
        phoneNumber: zodString({ maxLen: 20 }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
          phoneNumber: input.phoneNumber,
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return updatedUser;
    }),
});
