import { hostPropertyFormSchema } from "@/components/host/HostPropertyForm";
import {
  createTRPCRouter,
  optionallyAuthedProcedure,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  hostProfiles,
  propertyInsertSchema,
  propertySelectSchema,
  propertyUpdateSchema,
  users,
} from "@/server/db/schema";
import { getCoordinates } from "@/server/google-maps";
import { TRPCError } from "@trpc/server";
import { addDays } from "date-fns";
import { and, asc, desc, eq, gt, gte, lte, notExists, sql } from "drizzle-orm";
import { z } from "zod";
import {
  ALL_PROPERTY_ROOM_TYPES,
  bookedDates,
  properties,
} from "./../../db/schema/tables/properties";

export const propertiesRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(propertyInsertSchema.omit({ hostId: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin" && !input.hostName) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if ((!input.latitude || !input.longitude) && input.address) {
        const coords = await getCoordinates(input.address);
        if (coords) {
          input.latitude = coords.lat;
          input.longitude = coords.lng;
        }
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

  getAllInfiniteScroll: optionallyAuthedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        city: z.string().optional(),
        roomType: z.enum(ALL_PROPERTY_ROOM_TYPES).optional(),
        beds: z.number().optional(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        houseRules: z.array(z.string()).optional(),
        guests: z.number().optional(),
        maxNightlyPrice: z.number().optional(),
        lat: z.number().optional(),
        long: z.number().optional(),
        radius: z.number().optional(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;

      const lat = input.lat ?? 0;
      const long = input.long ?? 0;
      const radius = input.radius;

      const data = await ctx.db
        .select({
          id: properties.id,
          imageUrls: properties.imageUrls,
          name: properties.name,
          maxNumGuests: properties.maxNumGuests,
          numBedrooms: properties.numBedrooms,
          numBathrooms: properties.numBathrooms,
          numBeds: properties.numBeds,
          originalNightlyPrice: properties.originalNightlyPrice,
          // isOnBucketList: ctx.user
          //   ? exists(
          //       ctx.db
          //         .select()
          //         .from(bucketListProperties)
          //         .where(
          //           and(
          //             eq(bucketListProperties.propertyId, properties.id),
          //             eq(bucketListProperties.userId, ctx.user.id),
          //           ),
          //         ),
          //     )
          //   : sql`FALSE`,
          distance: sql`
            6371 * ACOS(
              SIN(${(lat * Math.PI) / 180}) * SIN(radians(latitude)) + COS(${(lat * Math.PI) / 180}) * COS(radians(latitude)) * COS(radians(longitude) - ${(long * Math.PI) / 180})
            ) AS distance`,
          vacancyCount: sql`
            (SELECT COUNT(booked_dates.property_id) 
            FROM booked_dates 
            WHERE booked_dates.property_id = properties.id 
              AND booked_dates.date >= CURRENT_DATE 
              AND booked_dates.date <= CURRENT_DATE + INTERVAL '30 days') AS vacancyCount
          `,
        })
        .from(properties)
        .where(
          and(
            cursor ? gt(properties.id, cursor) : undefined, // Use property ID as cursor
            input.lat && input.long
              ? sql`6371 * acos(SIN(${(lat * Math.PI) / 180}) * SIN(radians(latitude)) + COS(${(lat * Math.PI) / 180}) * COS(radians(latitude)) * COS(radians(longitude) - ${(long * Math.PI) / 180})) <= ${radius}`
              : sql`TRUE`,
            input.roomType
              ? eq(properties.roomType, input.roomType)
              : sql`TRUE`,
            input.city && input.city !== "all"
              ? eq(properties.address, input.city)
              : sql`TRUE`,
            input.beds ? gte(properties.numBeds, input.beds) : sql`TRUE`,
            input.bedrooms
              ? gte(properties.numBedrooms, input.bedrooms)
              : sql`TRUE`,
            input.bathrooms
              ? gte(properties.numBathrooms, input.bathrooms)
              : sql`TRUE`,
            input.guests
              ? gte(properties.maxNumGuests, input.guests)
              : sql`TRUE`,
            input.maxNightlyPrice
              ? lte(properties.originalNightlyPrice, input.maxNightlyPrice)
              : sql`TRUE`,
            input.houseRules?.includes("pets allowed")
              ? eq(properties.petsAllowed, true)
              : sql`TRUE`,
            input.houseRules?.includes("smoking allowed")
              ? eq(properties.smokingAllowed, true)
              : sql`TRUE`,
            eq(properties.isPrivate, false),
            notExists(
              db
                .select()
                .from(bookedDates)
                .where(
                  and(
                    eq(bookedDates.propertyId, properties.id),
                    gte(bookedDates.date, new Date()), // today or future
                    lte(bookedDates.date, addDays(new Date(), 30)), // within next 30 days
                  ),
                ),
            ),
            sql`(SELECT COUNT(booked_dates.property_id) 
            FROM booked_dates 
            WHERE booked_dates.property_id = properties.id 
              AND booked_dates.date >= CURRENT_DATE 
              AND booked_dates.date <= CURRENT_DATE + INTERVAL '20 days') < 14`,
          ),
        )
        .limit(12)
        .orderBy(asc(sql`id`), asc(sql`distance`));

      return {
        data,
        nextCursor: data.length ? data[data.length - 1]?.id : null, // Use last property ID as next cursor
      };
    }),
  // getCities: publicProcedure.query(async ({ ctx }) => {
  //   const lat = 34.1010307;
  //   const long = -118.3806008;
  //   const radius = 10; // 100km.

  //   const data = await ctx.db
  //     .select({
  //       id: properties.id,
  //       distance: sql`
  //       6371 * ACOS(
  //           SIN(${(lat * Math.PI) / 180}) * SIN(radians(latitude)) + COS(${(lat * Math.PI) / 180}) * COS(radians(latitude)) * COS(radians(longitude) - ${(long * Math.PI) / 180})
  //       ) AS distance`,
  //     })
  //     .from(properties)
  //     .orderBy(sql`distance`)
  //     .where(
  //       sql`6371 * acos(SIN(${(lat * Math.PI) / 180}) * SIN(radians(latitude)) + COS(${(lat * Math.PI) / 180}) * COS(radians(latitude)) * COS(radians(longitude) - ${(long * Math.PI) / 180})) <= ${radius}`,
  //     );
  // }),
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
