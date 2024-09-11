import {
  createTRPCRouter,
  optionallyAuthedProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { hostProfiles, properties, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const hostRouter = createTRPCRouter({
  getUserHostInfo: optionallyAuthedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    return await db.query.hostProfiles.findFirst({
      columns: {
        becameHostAt: true,
      },
      where: eq(hostProfiles.userId, ctx.user.id),
    });
  }),

  getHostUserAccount: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.query.users.findFirst({
        where: eq(users.id, input),
      });
    }),
  getAllHostProperties: protectedProcedure.query(async ({ ctx }) => {
    const hostProperties = await db.query.properties.findMany({
      columns: {
        id: true,
        name: true,
        hostId: true,
        imageUrls: true,
        latLngPoint: true,
      },
      where: eq(properties.hostId, ctx.user.id),
    });
    return hostProperties;
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
        },
        where: eq(hostProfiles.userId, hostId),
      });
    }),
});
