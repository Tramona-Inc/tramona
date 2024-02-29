import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { referralCodes, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { env } from "@/env";
import { generateReferralCode } from "@/utils/utils";
import { zodEmail, zodString } from "@/utils/zod-utils";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
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

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: zodString(),
        email: zodEmail(),
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
  createUrlToBeHost: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role === "admin") {
      const payload = {
        email: ctx.user.email,
        id: ctx.user.id,
      };

      // Create token
      const token = jwt.sign(payload, env.NEXTAUTH_SECRET!, {
        expiresIn: "24h",
      });

      const url = `${env.NEXTAUTH_URL}/auth/signup/?hostToken=${token}`;

      return url;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Must be admin to create URL",
      });
    }
  }),
  verifyUrlToBeHostUrl: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role === "admin") {
      const payload = {
        email: ctx.user.email,
        id: ctx.user.id,
      };

      // Create token
      const token = jwt.sign(payload, env.NEXTAUTH_SECRET!, {
        expiresIn: "24h",
      });

      const url = `${env.NEXTAUTH_URL}/auth/signup/?hostToken=${token}`;

      return url;
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Must be admin to create URL",
      });
    }
  }),
});
