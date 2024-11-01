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
  type Request,
  type RequestsToBook,
  type User,
  users,
} from "@/server/db/schema";
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
  discountTierSchema,
  properties,
  type Property,
} from "./../../db/schema/tables/properties";
import {
  addProperty,
  createLatLngGISPoint,
  getRequestsForProperties,
  getRequestsToBookForProperties,
} from "@/server/server-utils";
import { getCoordinates } from "@/server/google-maps";

export type HostRequestsPageData = {
  city: string;
  requests: {
    request: Request & {
      traveler: Pick<
        User,
        "firstName" | "lastName" | "name" | "image" | "location" | "about"
      >;
    };
    properties: (Property & { taxAvailable: boolean })[];
  }[];
};

export type HostRequestsToBookPageData = {
  requestToBook: (RequestsToBook & {
    traveler: Pick<
      User,
      "firstName" | "lastName" | "name" | "image" | "location" | "about"
    >;
  })[];
  property: Property & { taxAvailable: boolean };
}[];

export const propertiesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      propertyInsertSchema.omit({
        hostId: true,
        city: true,
        // latitude: true,
        // longitude: true,
        latLngPoint: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hostTeamId = await db.query.hostProfiles
        .findFirst({
          where: eq(hostProfiles.userId, ctx.user.id),
          columns: { curTeamId: true },
        })
        .then((res) => res?.curTeamId);

      if (!hostTeamId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Host profile not found for user ${ctx.user.id}`,
        });
      }

      const id = await addProperty({
        isAdmin: ctx.user.role === "admin" ? true : false,
        property: input,
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        hostTeamId,
      });
      return id;
    }),

  // uses the hostId passed in the input instead of the admin's user id
  createForHost: roleRestrictedProcedure(["admin"])
    .input(
      propertyInsertSchema
        .omit({
          city: true,
          // latitude: true,
          // longitude: true,
          latLngPoint: true,
        })
        .extend({ hostId: z.string() }),
    ) // make hostid required
    .mutation(async ({ ctx, input }) => {
      const host = await ctx.db.query.users.findFirst({
        columns: { name: true, role: true, email: true },
        where: eq(users.id, input.hostId),
      });

      if (!host) {
        return { status: "host not found" } as const;
      }
      if (host.role !== "host" && host.role !== "admin") {
        return { status: "user not a host" } as const;
      }

      await addProperty({
        property: input,
        userId: input.hostId,
        userEmail: host.email,
        isAdmin: false,
      });

      return {
        status: "success",
        hostName: host.name,
      } as const;
    }),

  update: roleRestrictedProcedure(["admin", "host"])
    .input(propertyUpdateSchema.omit({ hostId: true, latLngPoint: true }))
    .mutation(async ({ ctx, input }) => {
      // TODO: auth
      if (input.address) {
        const { location } = await getCoordinates(input.address);
        if (!location) throw new Error("Could not get coordinates for address");
        const latLngPoint = createLatLngGISPoint({
          lat: location.lat,
          lng: location.lng,
        });
        await ctx.db
          .update(properties)
          .set({ latLngPoint })
          .where(eq(properties.id, input.id));
      }

      await ctx.db
        .update(properties)
        .set(input)
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
      const property = await ctx.db.query.properties.findFirst({
        where: eq(properties.id, input.id),
        with: {
          host: {
            columns: {
              image: true,
              firstName: true,
              lastName: true,
              email: true,
              id: true,
              about: true,
              location: true,
            },
            with: {
              hostProfile: {
                columns: { curTeamId: true },
              },
            },
          },
          reviews: true,
        },
      });
      if (!property) throw new Error("no property");
      return property;
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
        avgRating: z.number().optional(),
        numRatings: z.number().optional(),
        // lat: z.number().optional(),
        // long: z.number().optional(),
        latLngPoint: z
          .object({
            lat: z.number(),
            lng: z.number(),
          })
          .optional(),
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

      const lat = input.latLngPoint?.lat ?? 0;
      const lng = input.latLngPoint?.lng ?? 0;
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
          avgRating: properties.avgRating,
          numRatings: properties.numRatings,
          originalNightlyPrice: properties.originalNightlyPrice,
          latLngPoint: properties.latLngPoint,
          bookItNowIsEnabled: properties.bookItNowEnabled,
          // lat: properties.latitude,
          // long: properties.longitude,
          distance: sql`
          6371 * ACOS(
            SIN(${(lat * Math.PI) / 180}) * SIN(radians(ST_Y(${properties.latLngPoint}))) + 
            COS(${(lat * Math.PI) / 180}) * COS(radians(ST_Y(${properties.latLngPoint}))) * 
            COS(radians(ST_X(${properties.latLngPoint})) - ${(lng * Math.PI) / 180})
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
            input.latLngPoint?.lat &&
              input.latLngPoint.lng &&
              !northeastLat &&
              !northeastLng &&
              !southwestLat &&
              !southwestLng
              ? sql`6371 * acos(SIN(${(lat * Math.PI) / 180}) * SIN(radians(latitude)) + COS(${(lat * Math.PI) / 180}) * COS(radians(latitude)) * COS(radians(longitude) - ${(lng * Math.PI) / 180})) <= ${radius}`
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
        latLngPoint: z
          .object({
            lat: z.number(),
            lng: z.number(),
          })
          .optional(),
        radius: z.number().optional(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, boundaries } = input;

      const lat = input.latLngPoint?.lat ?? 0;
      const lng = input.latLngPoint?.lng ?? 0;
      const radius = input.radius ?? 0; //just tried to fix a type error

      const data = await ctx.db
        .select({
          id: properties.id,
          imageUrls: properties.imageUrls,
          name: properties.name,
          maxNumGuests: properties.maxNumGuests,
          numBedrooms: properties.numBedrooms,
          numBathrooms: properties.numBathrooms,
          numBeds: properties.numBeds,
          avgRating: properties.avgRating,
          numRatings: properties.numRatings,
          originalNightlyPrice: properties.originalNightlyPrice,
          latLngPoint: properties.latLngPoint,
          bookItNowIsEnabled: properties.bookItNowEnabled,
          // lat: properties.latitude,
          // long: properties.longitude,
          distance: sql`
            6371 * ACOS(
              SIN(${(lat * Math.PI) / 180}) * SIN(radians(ST_Y(${properties.latLngPoint}))) + 
              COS(${(lat * Math.PI) / 180}) * COS(radians(ST_Y(${properties.latLngPoint}))) * 
              COS(radians(ST_X(${properties.latLngPoint})) - ${(lng * Math.PI) / 180})
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
            cursor ? gt(properties.id, cursor) : undefined,
            boundaries
              ? sql`
                ST_Y(${properties.latLngPoint}) BETWEEN ${boundaries.south} AND ${boundaries.north}
                AND ST_X(${properties.latLngPoint}) BETWEEN ${boundaries.west} AND ${boundaries.east}
              `
              : sql`TRUE`,
            input.latLngPoint?.lat && input.latLngPoint.lng && !boundaries
              ? sql`ST_DWithin(
                  ${properties.latLngPoint}::geography,
                  ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
                  ${radius * 1000}
                )`
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
        // .limit(12)
        .limit(100)
        .orderBy(asc(sql`id`), asc(sql`distance`));

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
  getHostProperties: protectedProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.properties.findMany({
        where: eq(properties.hostId, ctx.user.id),
        limit: input?.limit,
      });
    }),

  getHostPropertiesWithRequests: roleRestrictedProcedure(["host"]).query(
    async ({ ctx }) => {
      // TODO: USE DRIZZLE relational query, then use groupby in js
      const hostProperties = await db.query.properties.findMany({
        where: and(
          eq(properties.hostId, ctx.user.id),
          eq(properties.propertyStatus, "Listed"),
        ),

        // columns: {
        //   id: true,
        //   propertyStatus: true,
        //   latLngPoint: true,
        //   priceRestriction: true,
        //   city: true,
        // },
      });

      const hostRequests = await getRequestsForProperties(hostProperties, {
        user: ctx.user,
      });

      const groupedByCity: HostRequestsPageData[] = [];

      const findOrCreateCityGroup = (city: string) => {
        let cityGroup = groupedByCity.find((group) => group.city === city);
        if (!cityGroup) {
          cityGroup = { city, requests: [] };
          groupedByCity.push(cityGroup);
        }
        return cityGroup;
      };

      const requestsMap = new Map<
        number,
        {
          request: Request & {
            traveler: Pick<
              User,
              "firstName" | "lastName" | "name" | "image" | "location" | "about"
            >;
          };
          properties: (Property & { taxAvailable: boolean })[];
        }
      >();

      // Iterate over the hostRequests and gather all properties for each request
      for (const { property, request } of hostRequests) {
        // Check if this request already exists in the map
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!requestsMap.has(request.id)) {
          // If not, create a new entry with an empty properties array
          requestsMap.set(request.id, {
            request,
            properties: [] as (Property & { taxAvailable: boolean })[],
          });
        }

        // Add the property to the request
        requestsMap.get(request.id)!.properties.push(property);
      }
      for (const requestWithProperties of requestsMap.values()) {
        const { request, properties } = requestWithProperties;

        for (const property of properties as unknown as (Property & {
          taxAvailable: boolean;
        })[]) {
          const cityGroup = findOrCreateCityGroup(property.city);

          // Find if the request already exists in the city's group to avoid duplicates
          const existingRequest = cityGroup.requests.find(
            (item) => item.request.id === request.id,
          );

          if (existingRequest) {
            // If the request already exists, just add the new property to it
            existingRequest.properties.push(property);
          } else {
            // If the request doesn't exist, create a new entry with the property
            cityGroup.requests.push({
              request,
              properties: [property], // Initialize with the current property
            });
          }
        }
      }

      return groupedByCity;
    },
  ),

  getHostPropertiesWithRequestsToBook: roleRestrictedProcedure(["host"]).query(
    async ({ ctx }) => {
      const hostProperties = await db.query.properties.findMany({
        where: and(
          eq(properties.hostId, ctx.user.id),
          eq(properties.propertyStatus, "Listed"),
        ),
      });

      const hostRequestsToBook = await getRequestsToBookForProperties(
        hostProperties,
        {
          user: ctx.user,
        },
      );

      console.log('hostreqs', hostRequestsToBook)

      const propertiesWithRequestsToBook = hostProperties
        .filter((property) =>
          hostRequestsToBook.some(
            (requestToBook) => requestToBook.requestToBook.propertyId === property.id,
          ),
        )
        .map((property) => ({
          property,
          requestToBook: hostRequestsToBook.filter(
            (requestToBook) => requestToBook.requestToBook.propertyId === property.id,
          ),
        }));

      return propertiesWithRequestsToBook;
    },
  ),
  // hostInsertOnboardingProperty: roleRestrictedProcedure(["host"])
  //   .input(hostPropertyFormSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     return await ctx.db.insert(properties).values({
  //       ...input,
  //       hostId: ctx.user.id,
  //       hostName: ctx.user.name,
  //       imageUrls: input.imageUrls,
  //     });
  //   }),
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

  updateAutoOffer: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        autoOfferEnabled: z.boolean(),
        autoOfferDiscountTiers: z.array(discountTierSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(properties)
        .set({
          autoOfferEnabled: input.autoOfferEnabled,
          autoOfferDiscountTiers: input.autoOfferDiscountTiers,
        })
        .where(eq(properties.id, input.id));
    }),
  updateBookItNow: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        bookItNowEnabled: z.boolean(),
        bookItNowDiscountTiers: z.array(discountTierSchema),
        requestToBookDiscountPercentage: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(properties)
        .set({
          bookItNowEnabled: input.bookItNowEnabled,
          bookItNowDiscountTiers: input.bookItNowDiscountTiers,
          requestToBookDiscountPercentage:
            input.requestToBookDiscountPercentage,
        })
        .where(eq(properties.id, input.id));
    }),

  updatePropertySecurityDepositAmount: protectedProcedure
    .input(z.object({ propertyId: z.number(), amount: z.number() }))
    .mutation(async ({ input }) => {
      const property = await db
        .update(properties)
        .set({
          currentSecurityDeposit: input.amount,
        })
        .where(eq(properties.id, input.propertyId));

      return property;
    }),
});
