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
  conversationsRelations,
  hostProfiles,
  propertyInsertSchema,
  propertySelectSchema,
  propertyUpdateSchema,
  type Request,
  requests,
  requestsToProperties,
  users,
} from "@/server/db/schema";
import { getCoordinates } from "@/server/google-maps";
import { TRPCError } from "@trpc/server";
import { addDays } from "date-fns";
import {
  and,
  arrayContains,
  asc,
  eq,
  gt,
  gte,
  lte,
  notExists,
  sql,
} from "drizzle-orm";

import { z } from "zod";
import {
  ALL_PROPERTY_ROOM_TYPES,
  bookedDates,
  type NewProperty,
  properties,
  type Property,
} from "./../../db/schema/tables/properties";
import { on } from "events";
import { addProperty } from "@/server/server-utils";

export const propertiesRouter = createTRPCRouter({
  create: roleRestrictedProcedure(["admin", "host"])
    .input(propertyInsertSchema.omit({ hostId: true }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin" && !input.hostName) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const hostId = ctx.user.role === "admin" ? null : ctx.user.id;

      const id = await addProperty({ property: input, hostId });
      return id;
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
        northeastLat: z.number().optional(),
        northeastLng: z.number().optional(),
        southwestLat: z.number().optional(),
        southwestLng: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;

      const lat = input.lat ?? 0;
      const long = input.long ?? 0;
      const radius = input.radius;

      const northeastLat = input.northeastLat ?? 0;
      const northeastLng = input.northeastLng ?? 0;
      const southwestLat = input.southwestLat ?? 0;
      const southwestLng = input.southwestLng ?? 0;

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
          lat: properties.latitude,
          long: properties.longitude,
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
            eq(properties.propertyStatus, "Listed"),
            cursor ? gt(properties.id, cursor) : undefined, // Use property ID as cursor
            input.lat &&
              input.long &&
              !northeastLat &&
              !northeastLng &&
              !southwestLat &&
              !southwestLng
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

            northeastLat && northeastLng && southwestLat && southwestLng
              ? sql`
              latitude BETWEEN ${southwestLat} AND ${northeastLat}
              AND longitude BETWEEN ${southwestLng} AND ${northeastLng}
            `
              : sql`true`,
          ),
        )
        .limit(15)
        .orderBy(asc(sql`id`), asc(sql`distance`));

      return {
        data,
        nextCursor: data.length ? data[data.length - 1]?.id : null, // Use last property ID as next cursor
      };
    }),

  getByBoundaryInfiniteScroll: optionallyAuthedProcedure
    .input(
      z.object({
        boundaries: z
          .object({
            north: z.number(),
            south: z.number(),
            east: z.number(),
            west: z.number(),
          })
          .nullable(),
        cursor: z.number().nullish(),
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
      const { cursor, boundaries } = input;

      const lat = input.lat ?? 0;
      const long = input.long ?? 0;
      const radius = input.radius;

      console.log("Input boundaries:", boundaries);
      console.log("Cursor:", cursor);

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
          lat: properties.latitude,
          long: properties.longitude,
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
            eq(properties.propertyStatus, "Listed"),
            cursor ? gt(properties.id, cursor) : undefined,
            boundaries
              ? and(
                lte(properties.latitude, boundaries.north),
                gte(properties.latitude, boundaries.south),
                lte(properties.longitude, boundaries.east),
                gte(properties.longitude, boundaries.west),
              )
              : sql`TRUE`,
            input.lat && input.long && !boundaries
              ? sql`6371 * acos(SIN(${(lat * Math.PI) / 180}) * SIN(radians(latitude)) + COS(${(lat * Math.PI) / 180}) * COS(radians(latitude)) * COS(radians(longitude) - ${(long * Math.PI) / 180})) <= ${radius}`
              : sql`TRUE`,
            input.roomType
              ? eq(properties.roomType, input.roomType)
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
                    gte(bookedDates.date, new Date()),
                    lte(bookedDates.date, addDays(new Date(), 30)),
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

      console.log("Fetched properties count:", data.length);

      return {
        data,
        nextCursor: data.length ? data[data.length - 1]?.id : null,
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
  getHostPropertiesWithRequests: roleRestrictedProcedure(["host"]).query(
    async ({ ctx }) => {
      const rawData = await ctx.db.execute(sql`
          WITH host_properties AS (
            SELECT
              p.*,
              rp.request_id
            FROM ${properties} p
            JOIN ${requestsToProperties} rp ON p.id = rp.property_id
            WHERE p.host_id = ${ctx.user.id}
          ),
          city_requests AS (
            SELECT
              hp.request_id,
              hp.city
            FROM host_properties hp
            JOIN ${requests} r ON hp.request_id = r.id
            GROUP BY hp.city, hp.request_id
          )
          SELECT
            cr.city AS property_city,
            cr.request_id,
            r.*,
            p.*
          FROM city_requests cr
          JOIN ${requests} r ON cr.request_id = r.id
          JOIN ${properties} p ON p.city = cr.city AND p.host_id = ${ctx.user.id}
          ORDER BY cr.city, r.id, p.id
        `);

      interface CityData {
        city: string;
        requests: {
          request: Request;
          properties: Property[];
        }[];
      }

      const organizedData: CityData[] = [];
      const cityMap = new Map<string, CityData>();


      for (const row of rawData) {
        const property = {
          id: row.id,
          hostId: row.host_id,
          hostTeamId: row.host_team_id,
          propertyType: row.property_type,
          address: row.address,
          city: row.property_city,
          roomType: row.room_type,
          maxNumGuests: row.max_num_guests,
          numBeds: row.num_beds,
          numBedrooms: row.num_bedrooms,
          numBathrooms: row.num_bathrooms,
          latitude: row.latitude,
          longitude: row.longitude,
          checkInTime: row.check_in_time,
          checkOutTime: row.check_out_time,
          amenities: row.amenities,
          imageUrls: row.image_url,
          name: row.name,
          about: row.about,
          avgRating: row.avg_rating,
          numRatings: row.num_ratings,
          cancellationPolicy: row.cancellation_policy,
          createdAt: row.created_at,
          isPrivate: row.is_private,
          hostProfilePic: row.host_profile_pic,
          hostawayListingId: row.hostaway_listing_id,
          hostName: row.host_name,
          // Add other property fields here
        } as NewProperty;

        const request = {
          id: row.request_id,
          madeByGroupId: row.made_by_group_id,
          requestGroupId: row.request_group_id,
          maxTotalPrice: row.max_total_price,
          location: row.location,
          checkIn: row.check_in,
          checkOut: row.check_out,
          numGuests: row.num_guests,
          minNumBeds: row.min_num_beds,
          minNumBedrooms: row.min_num_bedrooms,
          minNumBathrooms: row.min_num_bathrooms,
          propertyType: row.property_type,
          note: row.note,
          airbnbLink: row.airbnb_link,
          createdAt: row.request_created_at,
          resolvedAt: row.resolved_at,
          lat: row.lat,
          lng: row.lng,
          radius: row.radius,
          // Add other request fields here
        } as Request;

        const city = row.property_city as string;

        if (!cityMap.has(city)) {
          const newCityData: CityData = { city, requests: [] };
          cityMap.set(city, newCityData);
          organizedData.push(newCityData);
        }


        const cityData = cityMap.get(city)!;
        let requestData = cityData.requests.find(r => r.request.id === request.id);

        if (!requestData) {
          requestData = { request, properties: [] };
          cityData.requests.push(requestData);
        }

        // Check if the property is not already in the properties array
        if (!requestData.properties.some(p => p.id === property.id)) {
          requestData.properties.push(property);
        }
      }
      return organizedData;
    }
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

  deleteImage: roleRestrictedProcedure(["admin"])
    .input(z.string())
    .mutation(async ({ input: imageUrl }) => {
      const count = await db.query.properties
        .findMany({
          columns: { id: true, imageUrls: true },
          where: arrayContains(properties.imageUrls, [imageUrl]),
        })
        .then((res) =>
          Promise.all(
            res.map((p) =>
              db
                .update(properties)
                .set({ imageUrls: p.imageUrls.filter((i) => i !== imageUrl) })
                .where(eq(properties.id, p.id)),
            ),
          ).then((res) => res.length),
        );

      return { count };
    }),
});
