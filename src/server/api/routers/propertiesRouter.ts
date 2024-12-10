import {
  createTRPCRouter,
  hostProcedure,
  optionallyAuthedProcedure,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  hostProfiles,
  hostTeamMembers,
  hostTeams,
  propertyInsertSchema,
  propertySelectSchema,
  propertyUpdateSchema,
  reservedDateRanges,
  type Request,
  type RequestsToBook,
  type User,
  users,
  Offer,
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
  isNotNull,
  like,
  lte,
  ne,
  notExists,
  or,
  sql,
  notInArray,
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
  getPropertyOriginalPrice,
  getRequestsForProperties,
  getRequestsToBookForProperties,
} from "@/server/server-utils";
import { getCoordinates } from "@/server/google-maps";
import { checkAvailabilityForProperties } from "@/server/direct-sites-scraping";
import { scrapeAirbnbSearch } from "@/server/external-listings-scraping/airbnbScraper";
import { capitalize } from "@/utils/utils";

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

export type HostRequestsPageOfferData = {
  city: string;
  requests: {
    offer: Offer;
    request: {
      id: number;
      madeByGroupId: number;
      maxTotalPrice: number;
      checkIn: Date;
      checkOut: Date;
      numGuests: number;
      location: string;
      traveler: Pick<
        User,
        "firstName" | "lastName" | "name" | "image" | "location" | "about"
      >;
    };
    property: { city: string; name: string };
  }[];
};

export const propertiesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      propertyInsertSchema
        .omit({
          hostTeamId: true,
          countryISO: true,
          latLngPoint: true,
          city: true,
          county: true,
          stateName: true,
          stateCode: true,
          country: true,
        })
        .extend({
          latLngPoint: propertyInsertSchema.shape.latLngPoint.optional(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const hostProfile = await db.query.hostProfiles.findFirst({
        where: eq(hostProfiles.userId, ctx.user.id),
        columns: { curTeamId: true },
      });

      if (!hostProfile) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Host profile not found",
        });
      }

      const id = await addProperty({
        property: input,
        hostTeamId: hostProfile.curTeamId,
        isAdmin: ctx.user.role === "admin",
        userEmail: ctx.user.email,
      });
      return id;
    }),

  // uses the hostTeamId passed in the input instead of the admin's user id
  createForHostTeam: roleRestrictedProcedure(["admin"])
    .input(
      propertyInsertSchema.omit({
        city: true,
        latLngPoint: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hostTeam = await db.query.hostTeams.findFirst({
        where: eq(hostTeams.id, input.hostTeamId),
      });

      if (!hostTeam) {
        return { status: "host team not found" } as const;
      }

      await addProperty({
        property: input,
        hostTeamId: hostTeam.id,
        isAdmin: true,
        userEmail: ctx.user.email,
      });

      return {
        status: "success",
      } as const;
    }),

  update: roleRestrictedProcedure(["admin", "host"])
    .input(propertyUpdateSchema.omit({ hostTeamId: true, latLngPoint: true }))
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
        const property = await db.query.properties.findFirst({
          where: eq(properties.id, input.id),
          columns: { hostTeamId: true },
        });

        if (!property) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found",
          });
        }

        const hostTeamMember = await db.query.hostTeamMembers.findFirst({
          where: and(
            eq(hostTeamMembers.hostTeamId, property.hostTeamId),
            eq(hostTeamMembers.userId, ctx.user.id),
          ),
        });

        if (!hostTeamMember) {
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
          hostTeam: {
            with: {
              owner: {
                columns: {
                  image: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  id: true,
                  about: true,
                  location: true,
                },
                // with: {
                //   hostProfile: {
                //     columns: { curTeamId: true },
                //   },
                // },
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
      const radius = input.radius ?? 0;

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
          originalListingId: properties.originalListingId,
          originalListingPlatform: properties.originalListingPlatform,
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
            eq(properties.status, "Listed"),
            cursor ? gt(properties.id, cursor) : undefined, // Use property ID as cursor
            input.latLngPoint?.lat &&
              input.latLngPoint.lng &&
              !northeastLat &&
              !northeastLng &&
              !southwestLat &&
              !southwestLng
              ? sql`6371 * ACOS(
                SIN(${(lat * Math.PI) / 180}) * SIN(radians(ST_Y(${properties.latLngPoint}))) +
                COS(${(lat * Math.PI) / 180}) * COS(radians(ST_Y(${properties.latLngPoint}))) *
                COS(radians(ST_X(${properties.latLngPoint})) - ${(lng * Math.PI) / 180})
              ) <= ${radius}`
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
              ST_Y(${properties.latLngPoint}) BETWEEN ${southwestLat} AND ${northeastLat}
              AND ST_X(${properties.latLngPoint}) BETWEEN ${southwestLng} AND ${northeastLng}
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
          originalListingPlatform: properties.originalListingPlatform,
          originalListingId: properties.originalListingId,
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
              ? sql`6371 * ACOS(
              SIN(${(lat * Math.PI) / 180}) * SIN(radians(ST_Y(${properties.latLngPoint}))) +
              COS(${(lat * Math.PI) / 180}) * COS(radians(ST_Y(${properties.latLngPoint}))) *
              COS(radians(ST_X(${properties.latLngPoint})) - ${(lng * Math.PI) / 180})
            ) <= ${radius}`
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
  getHostProperties: hostProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.properties.findMany({
        where: eq(properties.hostTeamId, ctx.hostProfile.curTeamId),
        limit: input?.limit,
      });
    }),

  updatePropertyDatesLastUpdated: hostProcedure
    .input(z.object({ propertyId: z.number(), datesLastUpdated: z.date() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(properties)
        .set({ datesLastUpdated: input.datesLastUpdated })
        .where(eq(properties.id, input.propertyId));
    }),

    getHostPropertiesWithRequests: hostProcedure.query(async ({ ctx }) => {
      const hostProperties = await db.query.properties.findMany({
        where: and(
          eq(properties.hostTeamId, ctx.hostProfile.curTeamId),
          eq(properties.status, "Listed"),
        ),
      });
  

      const hostRequests = await getRequestsForProperties(hostProperties);

      const groupedByCity: HostRequestsPageData[] = [];
      const citiesSet = new Set(hostProperties.map((property) => property.city));
      citiesSet.forEach((city) => {
        groupedByCity.push({ city, requests: [] });
      });
  
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
  
      for (const { property, request } of hostRequests) {
        if (!requestsMap.has(request.id)) {
          requestsMap.set(request.id, {
            request,
            properties: [],
          });
        }
        requestsMap.get(request.id)!.properties.push(property);
      }
  
      for (const requestWithProperties of requestsMap.values()) {
        const { request, properties } = requestWithProperties;
        for (const property of properties) {
          const cityGroup = findOrCreateCityGroup(property.city);
          const existingRequest = cityGroup.requests.find(
            (item) => item.request.id === request.id
          );
  
          if (existingRequest) {
            existingRequest.properties.push(property);
          } else {
            cityGroup.requests.push({
              request,
              properties: [property],
            });
          }
        }
      }
  
      return groupedByCity;
    }),
  
    getHostPropertiesWithRequestsToBook: hostProcedure.query(async ({ ctx }) => {
      const hostProperties = await db.query.properties.findMany({
        where: and(
          eq(properties.hostTeamId, ctx.hostProfile.curTeamId),
          eq(properties.status, "Listed")
        ),
      });
  
      const hostRequestsToBook = await getRequestsToBookForProperties(
        hostProperties,
        { user: ctx.user }
      );
  
      const propertiesWithRequestsToBook = hostProperties
        .filter((property) =>
          hostRequestsToBook.some(
            (requestToBook) =>
              requestToBook.requestToBook.propertyId === property.id
          )
        )
        .map((property) => ({
          property,
          requestToBook: hostRequestsToBook.filter(
            (requestToBook) =>
              requestToBook.requestToBook.propertyId === property.id
          ),
        }));
  
      return propertiesWithRequestsToBook;
    }),

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

  runSubscrapers: publicProcedure
    .input(
      z.object({
        propertyData: z.array(
          z.object({
            id: z.number(),
            originalListingId: z.string(),
            originalListingPlatform: z.string(),
            maxNumGuests: z.number(),
          }),
        ),
        checkIn: z.date(),
        checkOut: z.date(),
        numGuests: z.number(),
        location: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const eligibleProperties = input.propertyData.filter(
        (p) => input.numGuests <= p.maxNumGuests,
      );

      if (eligibleProperties.length === 0) {
        return [];
      }

      const airbnbProperties = await scrapeAirbnbSearch({
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        location: input.location,
        numGuests: input.numGuests,
      });

      const results = await checkAvailabilityForProperties({
        propertyIds: eligibleProperties.map((p) => p.id),
        originalListingIds: eligibleProperties.map((p) => p.originalListingId),
        originalListingPlatforms: eligibleProperties.map(
          (p) => p.originalListingPlatform,
        ),
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        numGuests: input.numGuests,
      });

      // Filter the results to only include available properties with a price
      const filteredResults = results.filter(
        (result) =>
          result.isAvailableOnOriginalSite &&
          result.originalNightlyPrice !== undefined,
      );

      const filteredAirbnbProperties = airbnbProperties; //use to have a filter function removing null values

      const combinedResults = [...filteredAirbnbProperties, ...filteredResults];
      console.log("Combined results:", combinedResults);

      return combinedResults;
    }),

  // getBookItNowProperties: publicProcedure
  //   .input(z.object({
  //     checkIn: z.date(),
  //     checkOut: z.date(),
  //     numGuests: z.number(),
  //     location: z.string(),
  //     firstBatch: z.boolean(),
  //   }),
  //   )
  //   .query(async ({ input }) => {
  //     const { location } = await getCoordinates(input.location);
  //     if (!location) throw new Error("Could not get coordinates for address");
  //     console.log("location", location);

  //     let propertyIsNearRequest: SQL | undefined = sql`FALSE`;

  //     const radiusInMeters = 10 * 1609.34;

  //     propertyIsNearRequest = sql`
  //       ST_DWithin(
  //         ST_Transform(ST_SetSRID(properties.lat_lng_point, 4326), 3857),
  //         ST_Transform(ST_SetSRID(ST_MakePoint(${location.lng}, ${location.lat}), 4326), 3857),
  //         ${radiusInMeters}
  //       )
  //     `;
  //     console.time("Properties query");
  //     console.time("Airbnb search");
  //     console.time("full procedure")

  //     const propsPromise = db.query.properties.findMany({
  //       where: and(isNotNull(properties.originalListingPlatform), propertyIsNearRequest, ne(properties.originalListingPlatform, "Airbnb")),
  //     }).then(result => {
  //       console.timeEnd("Properties query");
  //       return result;
  //     });
  //     // const airbnbPromise = scrapeAirbnbSearch({
  //     //   checkIn: input.checkIn,
  //     //   checkOut: input.checkOut,
  //     //   location: input.location,
  //     //   numGuests: input.numGuests,
  //     // }).then(result => {
  //     //   console.timeEnd("Airbnb search");
  //     //   return result;
  //     // });

  //     const props = await propsPromise;

  //     let eligibleProperties = props.filter(
  //       (p) => input.numGuests <= p.maxNumGuests,
  //     );

  //     console.log("eligibleProperties", eligibleProperties.length);
  //     if (input.firstBatch) {
  //       eligibleProperties = eligibleProperties.slice(0, 30);
  //     } else {
  //       eligibleProperties = eligibleProperties.slice(30);
  //     }

  //     const results = await checkAvailabilityForProperties({
  //       propertyIds: eligibleProperties.map((p) => p.id),
  //       originalListingIds: eligibleProperties.map((p) => p.originalListingId ?? ""),
  //       originalListingPlatforms: eligibleProperties.map(
  //         (p) => p.originalListingPlatform ?? "",
  //       ),
  //       checkIn: input.checkIn,
  //       checkOut: input.checkOut,
  //       numGuests: input.numGuests,
  //     });

  //     console.timeEnd("checkAvailability");
  //     console.log("results", results.length);

  //     const fullPropertyData = await db.query.properties.findMany({
  //       where: inArray(properties.id, results.map((r) => r.propertyId)),
  //     });

  //     const updatedPropertyData = await Promise.all(results.map(async (r) => {
  //       const property = fullPropertyData.find((p) => p.id === r.propertyId);
  //       return { ...property, originalNightlyPrice: r.originalNightlyPrice };
  //     }));

  //     // const airbnbProperties = await airbnbPromise; // Ensures it completes before returning

  //     console.timeEnd("full procedure")

  //     return updatedPropertyData;
  //   }),

  getBookItNowProperties: publicProcedure
    .input(
      z.object({
        checkIn: z.date(),
        checkOut: z.date(),
        numGuests: z.number(),
        location: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { location } = await getCoordinates(input.location);
      if (!location) throw new Error("Could not get coordinates for address");
      console.log("location", location);

      const radiusInMeters = 20 * 1609.34;

      const propertyIsNearRequest = sql`
      ST_DWithin(
        ST_Transform(ST_SetSRID(properties.lat_lng_point, 4326), 3857),
        ST_Transform(ST_SetSRID(ST_MakePoint(${location.lng}, ${location.lat}), 4326), 3857),
        ${radiusInMeters}
      )
    `;
      const { checkIn, checkOut } = input;

      const checkInDate = checkIn.toISOString();
      const checkOutDate = checkOut.toISOString();

      const conflictingPropertyIds = await db.query.reservedDateRanges.findMany(
        {
          columns: { propertyId: true },
          where: and(
            or(
              and(
                lte(reservedDateRanges.start, checkInDate),
                gte(reservedDateRanges.end, checkInDate),
              ),
              and(
                lte(reservedDateRanges.start, checkOutDate),
                gte(reservedDateRanges.end, checkOutDate),
              ),
              and(
                gte(reservedDateRanges.start, checkInDate),
                lte(reservedDateRanges.end, checkOutDate),
              ),
            ),
          ),
        },
      );

      // Extract conflicting property IDs into an array
      const conflictingIds = conflictingPropertyIds.map(
        (item) => item.propertyId,
      );

      const hostProperties = await db.query.properties.findMany({
        where: and(
          eq(properties.originalListingPlatform, "Hospitable"),
          propertyIsNearRequest,
          notInArray(properties.id, conflictingIds), // Exclude properties with conflicting reservations
        ),
      });

      const checkInNew = new Date(checkInDate).toISOString().split("T")[0];
      const checkOutNew = new Date(checkOutDate).toISOString().split("T")[0];
      //set the accurate original nightly price for Hospitable properties
      await Promise.all(
        hostProperties.map(async (property) => {
          const originalPrice = await getPropertyOriginalPrice(property, {
            checkIn: checkInNew!,
            checkOut: checkOutNew!,
            numGuests: input.numGuests,
          });
          property.originalNightlyPrice = originalPrice ?? null;
        }),
      );

      // Query for scraped properties with non-intersecting dates
      const scrapedProperties = await db.query.properties.findMany({
        where: and(
          ne(properties.originalListingPlatform, "Hospitable"),
          ne(properties.originalListingPlatform, "Airbnb"),
          propertyIsNearRequest,
          ne(properties.originalNightlyPrice, -1),
          isNotNull(properties.originalNightlyPrice),
          notInArray(properties.id, conflictingIds), // Exclude properties with conflicting reservations
        ),
      });
      return { hostProperties, scrapedProperties };
    }),

  getSearchResults: hostProcedure
    .input(z.object({ searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.searchQuery !== "") {
        return await ctx.db.query.properties.findMany({
          where: and(
            eq(properties.hostTeamId, ctx.hostProfile.curTeamId),
            or(
              like(properties.name, `%${input.searchQuery}%`),
              like(properties.city, `%${capitalize(input.searchQuery)}%`),
            ),
          ),
        });
      }
      return null;
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
