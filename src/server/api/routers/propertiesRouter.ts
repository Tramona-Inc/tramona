import { hostPropertyFormSchema } from "@/components/host/HostPropertyForm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import {
  hostProfiles,
  propertyInsertSchema,
  propertySelectSchema,
  propertyUpdateSchema,
  users,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, lte, sql } from "drizzle-orm";
import { withCursorPagination } from "drizzle-pagination";
import { z } from "zod";
import { bookedDates, properties } from "./../../db/schema/tables/properties";

export const propertiesRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(propertyInsertSchema.omit({ hostId: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin" && !input.hostName) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return await ctx.db
        .insert(properties)
        .values({
          ...input,
          hostId: ctx.user.role === "admin" ? null : ctx.user.id,
        })
        .returning({ id: properties.id })
        .then((res) => res[0]!.id);
    }),

  // uses the hostId passed in the input instead of the admin's user id
  createForHost: roleRestrictedProcedure(["admin"])
    .input(propertyInsertSchema.extend({ hostId: z.string() })) // make hostid required
    .mutation(async ({ ctx, input }) => {
      const host = await ctx.db.query.users.findFirst({
        columns: { name: true, role: true },
        where: eq(users.id, input.hostId),
      });

      if (!host) {
        return { status: "host not found" } as const;
      }
      if (host.role !== "host" && host.role !== "admin") {
        return { status: "user not a host" } as const;
      }

      await ctx.db.insert(properties).values(input);

      return {
        status: "success",
        hostName: host.name,
      } as const;
    }),

  update: roleRestrictedProcedure(["admin", "host"])
    .input(propertyUpdateSchema.omit({ hostId: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin" && !input.hostName) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await ctx.db
        .update(properties)
        .set({
          ...input,
          hostId: ctx.user.role === "admin" ? null : ctx.user.id,
        })
        .where(eq(properties.id, input.id));
    }),

  delete: roleRestrictedProcedure(["admin", "host"])
    .input(propertySelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "host") {
        const request = await ctx.db.query.properties.findFirst({
          where: eq(properties.id, input.id),
          columns: {
            hostId: true,
          },
        });

        if (request?.hostId !== ctx.user.id) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db.delete(properties).where(eq(properties.id, input.id));
    }),

  getById: publicProcedure
    .input(propertySelectSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.properties.findFirst({
        where: eq(properties.id, input.id),
      });
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.properties.findMany();
  }),
  getAllByFilter: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.properties.findMany({
      limit: 100,
      offset: 0,
    });
  }),

  getAllInfiniteScroll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        city: z.string().optional(),
        beds: z.number().optional(),
        rooms: z.number().optional(),
        bathrooms: z.number().optional(),
        lat: z.number().optional(),
        long: z.number().optional(),
        radius: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 5;
      const { cursor } = input;

      const lat = 34.1010307;
      const long = -118.3806008;
      const radius = 1000; // 100km.

      const data = await ctx.db.query.properties.findMany({
        ...withCursorPagination({
          // where: eq(properties.propertyType, "House"),
          where: and(
            input.lat && input.long && input.radius
              ? sql`
                6371 * acos(
                    SIN(${lat}) * SIN(radians(latitude)) + COS(${lat}) * COS(radians(latitude)) * COS(radians(longitude) - ${long})
                ) <= ${radius}`
              : sql`TRUE`,
            // eq(properties.propertyType, "House"),
            input.city && input.city !== 'All' ? eq(properties.address, input.city) : sql`TRUE`, // Conditionally include eq function for address
            input.beds ? lte(properties.numBeds, input.beds) : sql`TRUE`, // Conditionally include eq function
            input.rooms ? lte(properties.numBedrooms, input.rooms) : sql`TRUE`, // Conditionally include eq function
            input.bathrooms
              ? lte(properties.numBathrooms, input.bathrooms)
              : sql`TRUE`, // Conditionally include eq function
          ),
          limit: limit + 1,
          cursors: [
            // [
            //   properties.createdAt,
            //   "desc",
            //   cursor ? new Date(cursor) : undefined,
            // ],
            [properties.id, "desc", cursor ? cursor : undefined],
          ],
        }),
      });

      return {
        data,
        // nextCursor: data.length
        //   ? data[data.length - 1]?.createdAt.toISOString()
        //   : null,
        nextCursor: data.length ? data[data.length - 1]?.id : null,
      };
    }),
  getCities: publicProcedure.query(async ({ ctx }) => {
    const lat = 34.1010307;
    const long = -118.3806008;
    const radius = 1000; // 100km.

    // // Convert latitude and longitude to radians
    // const lat = (lat * Math.PI) / 180;
    // const long = (long * Math.PI) / 180;

    // const result: Property[] = await ctx.db.execute(sql`
    //     SELECT
    //         *,
    //         6371 * acos(
    //             SIN(${lat}) * SIN(radians(latitude)) + COS(${lat}) * COS(radians(latitude)) * COS(radians(longitude) - ${long})
    //         ) AS distance
    //     FROM
    //         properties
    //     WHERE
    //         6371 * acos(
    //             SIN(${lat}) * SIN(radians(latitude)) + COS(${lat}) * COS(radians(latitude)) * COS(radians(longitude) - ${long})
    //         ) <= ${radius}
    // `);

    return await ctx.db.query.properties.findMany({
      where: sql`
            6371 * acos(
                SIN(${lat}) * SIN(radians(latitude)) + COS(${lat}) * COS(radians(latitude)) * COS(radians(longitude) - ${long})
            ) <= ${radius}
      `,
    });
  }),
  hostInsertProperty: roleRestrictedProcedure(["host"])
    .input(hostPropertyFormSchema)
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== "host") {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  getHostProperties: roleRestrictedProcedure(["host"])
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.properties.findMany({
        where: eq(properties.hostId, ctx.user.id),
        limit: input?.limit,
      });
    }),
  getHostRequestsSidebar: roleRestrictedProcedure(["host"]).query(
    async ({ ctx }) => {
      const curTeamId = await ctx.db.query.hostProfiles
        .findFirst({
          where: eq(hostProfiles.userId, ctx.user.id),
          columns: { curTeamId: true },
        })
        .then((res) => res?.curTeamId);

      if (!curTeamId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return await ctx.db.query.properties
        .findMany({
          columns: { id: true, imageUrls: true, name: true, address: true },
          where: eq(properties.hostTeamId, curTeamId),
          with: { requestsToProperties: true },
        })
        .then((res) =>
          res
            .map((p) => {
              const { requestsToProperties, ...rest } = p;
              return {
                ...rest,
                numRequests: requestsToProperties.length,
              };
            })
            .sort((a, b) => b.numRequests - a.numRequests),
        );
    },
  ),
  hostInsertOnboardingProperty: roleRestrictedProcedure(["host"])
    .input(hostPropertyFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "host") {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return await ctx.db.insert(properties).values({
        ...input,
        hostId: ctx.user.id,
        hostName: ctx.user.name,
        imageUrls: input.imageUrls,
      });
    }),
  getBlockedDates: protectedProcedure
    .input(z.object({ propertyId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.bookedDates.findMany({
        where: eq(bookedDates.propertyId, input.propertyId),
        columns: {
          date: true,
        },
      });
    }),
});
