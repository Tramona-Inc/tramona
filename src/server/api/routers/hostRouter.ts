import {
  createTRPCRouter,
  optionallyAuthedProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { hostProfiles, properties } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const hostRouter = createTRPCRouter({
  getUserHostInfo: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    return await db.query.hostProfiles.findFirst({
      columns: {
        becameHostAt: true,
        stripeAccountId: true,
        chargesEnabled: true,
      },
      where: eq(hostProfiles.userId, ctx.user.id),
    });
  }),

  getAllHostProperties: protectedProcedure.query(async ({ ctx }) => {
    const hostProperties = await db.query.properties.findMany({
      columns: {
        id: true,
        name: true,
        hostId: true,
        imageUrls: true,
        latitude: true,
        longitude: true,
      },
      where: eq(properties.hostId, ctx.user.id),
    });
    return hostProperties;
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
          //type: true,
          becameHostAt: true,
          //profileUrl: true,
          stripeAccountId: true,
          chargesEnabled: true,
        },
        where: eq(hostProfiles.userId, hostId),
      });
    }),
});
