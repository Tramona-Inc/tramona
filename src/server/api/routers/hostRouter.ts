import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { hostProfiles, properties } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function fetchIndividualHostInfo(userId: string) {
  return await db.query.hostProfiles.findFirst({
    columns: {
      userId: true,
      type: true,
      becameHostAt: true,
      profileUrl: true,
      stripeAccountId: true,
      chargesEnabled: true,
    },
    where: eq(hostProfiles.userId, userId),
  });
}

export const hostRouter = createTRPCRouter({
  getHostsInfo: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.hostProfiles.findMany({
      columns: {
        userId: true,
        type: true,
        becameHostAt: true,
        profileUrl: true,
      },
      with: {
        hostUser: {
          columns: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: (user, { desc }) => [desc(user.becameHostAt)],
      limit: 10,
    });

    // Flatten the hostUser
    return res.map((item) => ({
      ...item,
      name: item.hostUser.name,
      email: item.hostUser.email,
      phoneNumber: item.hostUser.phoneNumber,
    }));
  }),
  getUserHostInfo: protectedProcedure.query(async ({ ctx }) => {
    return fetchIndividualHostInfo(ctx.user.id);
  }),

  getStripeAccountId: protectedProcedure.query(async ({ ctx }) => {
    const stripeAccountIdNumber = await db.query.hostProfiles.findFirst({
      columns: { stripeAccountId: true },
      where: eq(hostProfiles.userId, ctx.user.id),
    });
    return stripeAccountIdNumber;
  }),

  getHostInfoByPropertyId: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const hostIDIfExist = await db.query.properties.findFirst({
        columns: { hostId: true },
        where: eq(properties.id, input),
      });

      const hostId = hostIDIfExist ? hostIDIfExist.hostId : null;

      if (!hostId) {
        // Handle the case where the hostId is not found
        return null;
      }

      return await db.query.hostProfiles.findFirst({
        columns: {
          userId: true,
          type: true,
          becameHostAt: true,
          profileUrl: true,
          stripeAccountId: true,
          chargesEnabled: true,
        },
        where: eq(hostProfiles.userId, hostId),
      });
    }),
});
