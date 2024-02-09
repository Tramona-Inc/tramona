import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

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
    return await ctx.db.query.users
      .findFirst({
        where: eq(users.id, ctx.user.id),
        columns: {},
        with: {
          referralCode: true,
        },
      })
      .then((res) => res?.referralCode ?? null);
  }),
  insertReferralCode: protectedProcedure
    .input(
    z.object({
      referralCode: zodString(),
    }),
  )
  .mutation(async ({ ctx, input }) => {

    return null;
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
