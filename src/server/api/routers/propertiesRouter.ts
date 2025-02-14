import {
  coHostProcedure,
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
  hostTeams,
  propertyInsertSchema,
  propertySelectSchema,
  propertyUpdateSchema,
  reservedDateRanges,
  type Request,
  type RequestsToBook,
  type User,
  Offer,
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
  isNotNull,
  like,
  lte,
  ne,
  notExists,
  or,
  sql,
  notInArray,
  inArray,
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
  fetchNightlyPrices,
  getPropertyOriginalPrice,
  getRequestsForProperties,
  getRequestsToBookForProperties,
  SeparatedData,
} from "@/server/server-utils";
import { getCoordinates } from "@/server/google-maps";
import { checkAvailabilityForProperties } from "@/server/direct-sites-scraping";
import { scrapeAirbnbSearch } from "@/server/external-listings-scraping/airbnbScraper";
import { capitalize, getAge, getNumNights } from "@/utils/utils";
import { extraPricingFieldSchema } from "@/components/dashboard/host/calendar/pricingfields";
import { validateImage } from "@/utils/utils";
import { hostTeamMembers } from "../../db/schema/tables/hostTeams";
import { HostRequestsPageData } from "@/server/types/propertiesRouter";

export const propertiesRouter = createTRPCRouter({
  adminUpdate: roleRestrictedProcedure(["admin"])
    .input(
      propertyUpdateSchema.omit({
        hostTeamId: true,
        latLngPoint: true,
      }),
    )
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

  create: protectedProcedure //<_____________________________ COME BACK TO THIS WHEN WE NEED IT _____________________________ >
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
      // const hostProfile = await db.query.hostProfiles.findFirst({  //<_____________________________ OUTDATED LOGIC _____________________________ >
      //   where: eq(hostProfiles.userId, ctx.user.id),
      //   columns: { curTeamId: true },
      // });
      const firstHostTeam = await db.query.hostTeamMembers.findFirst({
        where: eq(hostTeamMembers.userId, ctx.user.id),
      });

      if (!firstHostTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Host profile not found",
        });
      }

      const id = await addProperty({
        property: input,
        hostTeamId: firstHostTeam.hostTeamId,
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

  update: coHostProcedure(
    "update_property_descriptions_and_amenities",
    z.object({
      updatedProperty: propertyUpdateSchema.omit({
        hostTeamId: true,
        latLngPoint: true,
      }),
      currentHostTeamId: z.number(),
    }),
  ).mutation(async ({ ctx, input }) => {
    // TODO: auth
    if (input.updatedProperty.address) {
      const { location } = await getCoordinates(input.updatedProperty.address);
      if (!location) throw new Error("Could not get coordinates for address");
      const latLngPoint = createLatLngGISPoint({
        lat: location.lat,
        lng: location.lng,
      });
      await ctx.db
        .update(properties)
        .set({ latLngPoint })
        .where(eq(properties.id, input.updatedProperty.id));
    }

    await ctx.db
      .update(properties)
      .set(input.updatedProperty)
      .where(eq(properties.id, input.updatedProperty.id));
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
      console.log("getByID");
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
    .input(
      z.object({
        currentHostTeamId: z.number().optional(),
        limit: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const currentHostTeamId = input.currentHostTeamId;
      if (!currentHostTeamId) {
        return [];
      }
      return await ctx.db.query.properties.findMany({
        where: eq(properties.hostTeamId, currentHostTeamId),
        limit: input.limit,
      });
    }),

  getAllPropertiesFromAllTeamsFromHostId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const allAssociatedTeams = await db.query.hostTeamMembers
        .findMany({
          where: eq(hostTeamMembers.userId, input),
          columns: { hostTeamId: true },
        })
        .then((team) => team.map((team) => team.hostTeamId));

      console.log(allAssociatedTeams);

      const allProperties = await db.query.properties.findMany({
        where: inArray(properties.hostTeamId, allAssociatedTeams),
      });
      console.log(allProperties);
      return allProperties;
    }),

  updatePropertyDatesLastUpdated: hostProcedure
    .input(z.object({ propertyId: z.number(), datesLastUpdated: z.date() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(properties)
        .set({ datesLastUpdated: input.datesLastUpdated })
        .where(eq(properties.id, input.propertyId));
    }),

    getHostPropertiesWithRequests: hostProcedure
    .input(z.object({ currentHostTeamId: z.number(), city: z.string().optional() }))
    .query(async ({ input }): Promise<SeparatedData> => {
      console.log(input);
      const whereConditions = [
        eq(properties.hostTeamId, input.currentHostTeamId),
        eq(properties.status, "Listed"),
      ];

      if (input.city) {
        whereConditions.push(eq(properties.city, input.city));
      }

      const hostProperties = await db.query.properties.findMany({
        where: and(...whereConditions),
      });

      console.log(hostProperties);

      const hostRequests = await getRequestsForProperties(hostProperties);

      const normalGroupedByCity: HostRequestsPageData[] = [];
      const outsidePriceRestrictionGroupedByCity: HostRequestsPageData[] = [];

      const findOrCreateCityGroup = (city: string, groupedByCity: HostRequestsPageData[]) => {
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
            traveler: Pick<User, "firstName" | "lastName" | "name" | "image" | "location" | "about" | "dateOfBirth" | "id">;
          };
          properties: (Property & { taxAvailable: boolean })[];
          city: string;
        }
      >();

      console.log(hostRequests);

      // Loop through requests and group properties by request
      for (const { property, request } of hostRequests) {
        if (!requestsMap.has(request.id)) {
          requestsMap.set(request.id, {
            request,
            properties: [],
            city: property.city,
          });
        }
        requestsMap.get(request.id)!.properties.push(property);
      }

      console.log(requestsMap);

      // Process each request and validate properties
      for (const requestWithProperties of requestsMap.values()) {
        const { request, properties, city: requestCity } = requestWithProperties;
        const travelersAge = getAge(request.traveler.dateOfBirth!);
        const requestedNightlyPrice = request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut);

        let isOutsidePriceRestrictionRequest = false;
        const validPropertiesForRequest: (Property & { taxAvailable: boolean })[] = [];
        const invalidPropertiesForRequest: (Property & { taxAvailable: boolean })[] = [];


        for (const property of properties) {
          if (!property.hospitableListingId) continue;

          let isValid = true;

          // Check age restriction
          if (property.ageRestriction && travelersAge < property.ageRestriction) {
            isValid = false;
          }
          console.log(isValid);

          // Check price validity
          const nightlyPrices = await fetchNightlyPrices(property.hospitableListingId, request.checkIn.toISOString(), request.checkOut.toISOString());
          if (!nightlyPrices) {
            isValid = false;
          } else {
            const avgNightlyPrice = nightlyPrices.reduce((sum, price) => sum + price, 0) / nightlyPrices.length;
            console.log(avgNightlyPrice);
            const minAllowedPrice = avgNightlyPrice * (1 - property.priceRestriction / 100);
            console.log(minAllowedPrice);
            if (requestedNightlyPrice < minAllowedPrice) {
              isValid = false;
            }
          }

          if (!isValid) {
            isOutsidePriceRestrictionRequest = true;
            invalidPropertiesForRequest.push(property); // Keeping track of invalid properties for potential future use, though not used in OG type
          } else {
            validPropertiesForRequest.push(property);
          }
        }

        if (isOutsidePriceRestrictionRequest) {
          const cityGroup = findOrCreateCityGroup(requestCity, outsidePriceRestrictionGroupedByCity); // Use last property's city, all properties in a request should be in same city
          let existingRequest = cityGroup.requests.find((item) => item.request.id === request.id);

          if (!existingRequest) {
            cityGroup.requests.push({
              request,
              properties: [],
            });

            // Reassign after pushing to ensure we reference the newly added request
            existingRequest = cityGroup.requests[cityGroup.requests.length - 1];
          }
          existingRequest!.properties.push(...validPropertiesForRequest); // Add valid properties to outsidePriceRestriction for OG type requirement, even though request is categorized as outside restriction. If you dont want to show valid properties under outside restriction, just leave this line out.

        } else {
          const cityGroup = findOrCreateCityGroup(requestCity, normalGroupedByCity);  // Use last property's city
          let existingRequest = cityGroup.requests.find((item) => item.request.id === request.id);

          if (!existingRequest) {
            cityGroup.requests.push({
              request,
              properties: [],
            });

            // Reassign after pushing to ensure we reference the newly added request
            existingRequest = cityGroup.requests[cityGroup.requests.length - 1];
          }
          existingRequest!.properties.push(...validPropertiesForRequest);
        }
      }


      return {
        normal: normalGroupedByCity,
        outsidePriceRestriction: outsidePriceRestrictionGroupedByCity,
      };
    }),


  getHostPropertiesWithRequestsToBook: hostProcedure
    .input(z.object({ currentHostTeamId: z.number() }))
    .query(async ({ ctx, input }) => {
      const hostProperties = await db.query.properties.findMany({
        where: and(
          eq(properties.hostTeamId, input.currentHostTeamId),
          eq(properties.status, "Listed"),
        ),
      });

      const hostRequestsToBook = await getRequestsToBookForProperties(
        hostProperties,
        { user: ctx.user },
      );

      const propertiesWithRequestsToBook = hostProperties
        .filter((property) =>
          hostRequestsToBook.some(
            (requestToBook) =>
              requestToBook.requestToBook.propertyId === property.id,
          ),
        )
        .map((property) => ({
          property,
          requestToBook: hostRequestsToBook.filter(
            (requestToBook) =>
              requestToBook.requestToBook.propertyId === property.id,
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

  updateRequestToBook: coHostProcedure(
    "modify_overall_pricing_strategy",
    z.object({
      propertyId: z.number(),
      requestToBookMaxDiscountPercentage: z.number(),
      currentHostTeamId: z.number(),
    }),
  ).mutation(async ({ input }) => {
    await db
      .update(properties)
      .set({
        requestToBookMaxDiscountPercentage:
          input.requestToBookMaxDiscountPercentage,
      })
      .where(eq(properties.id, input.propertyId));
    console.log("YAY");
    return;
  }),

  toggleAutoOffer: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        autoOfferEnabled: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(properties)
        .set({
          autoOfferEnabled: input.autoOfferEnabled,
        })
        .where(eq(properties.id, input.id));
    }),

  toggleBookItNow: coHostProcedure(
    "modify_overall_pricing_strategy",
    z.object({
      id: z.number(),
      bookItNowEnabled: z.boolean(),
      currentHostTeamId: z.number(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const [updatedProperty] = await ctx.db
      .update(properties)
      .set({
        bookItNowEnabled: input.bookItNowEnabled,
      })
      .where(eq(properties.id, input.id))
      .returning({ bookItNowEnabled: properties.bookItNowEnabled });

    return updatedProperty?.bookItNowEnabled ? true : false;
  }),

  updateBookItNow: coHostProcedure(
    "modify_overall_pricing_strategy",
    z.object({
      id: z.number(),
      bookItNowHostDiscountPercentOffInput: z.number().optional(),
      currentHostTeamId: z.number(),
    }),
  ).mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(properties)
      .set({
        ...(input.bookItNowHostDiscountPercentOffInput !== undefined && {
          bookItNowHostDiscountPercentOffInput:
            input.bookItNowHostDiscountPercentOffInput,
        }),
      })
      .where(eq(properties.id, input.id));
  }),

  updatePropertyDiscountTiers: protectedProcedure
    .input(
      z.object({
        propertyId: z.number(),
        discountTiers: z.array(discountTierSchema).nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .update(properties)
        .set({
          ...(input.discountTiers && {
            discountTiers: input.discountTiers,
          }),
        })
        .where(eq(properties.id, input.propertyId));
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
    .query(async ({ input, ctx }) => {
      const { location } = await getCoordinates(input.location);
      if (!location) throw new Error("Could not get coordinates for address");

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

      const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      };

      const userAge = await db.query.users
        .findFirst({
          where: ctx.session?.user.id
            ? eq(users.id, ctx.session.user.id)
            : undefined,
          columns: { dateOfBirth: true },
        })
        .then((result) => {
          if (result?.dateOfBirth) {
            const age = calculateAge(result.dateOfBirth);
            return age;
          }
          return null; // Handle case where `dateOfBirth` is not present
        })
        .catch((error) => {
          console.error("Error fetching user age:", error);
          return null;
        });

      const ageRestrictionCheck = sql`CASE
        WHEN ${properties.ageRestriction} IS NULL THEN true
        WHEN ${properties.ageRestriction} IS NOT NULL AND ${sql.raw(String(userAge))} >= ${properties.ageRestriction} THEN true
        ELSE false
      END`;

      const hostProperties = await db.query.properties.findMany({
        where: and(
          eq(properties.originalListingPlatform, "Hospitable"),
          propertyIsNearRequest,
          notInArray(properties.id, conflictingIds), // Exclude properties with conflicting reservations
          ageRestrictionCheck,
          eq(properties.status, "Listed"),
        ),
      });

      const checkInNew = new Date(checkInDate).toISOString().split("T")[0];
      const checkOutNew = new Date(checkOutDate).toISOString().split("T")[0];
      const validHostProperties: Property[] = [];
      //set the accurate original nightly price for Hospitable properties
      await Promise.all(
        hostProperties.map(async (property) => {
          try {
            const originalPrice = await getPropertyOriginalPrice(property, {
              checkIn: checkInNew!,
              checkOut: checkOutNew!,
              numGuests: input.numGuests,
            });
            property.originalNightlyPrice = originalPrice ?? null;

            // Push property to validHostProperties if successful
            validHostProperties.push(property);
          } catch (error) {
            console.error(`Failed for property ID ${property.id}:`, error);
          }
        }),
      );

      // Query for scraped properties with non-intersecting dates
      const scrapedProperties = await db.query.properties.findMany({
        where: and(
          eq(properties.originalListingPlatform, "Casamundo"),
          propertyIsNearRequest,
          ne(properties.originalNightlyPrice, -1),
          isNotNull(properties.originalNightlyPrice),
          notInArray(properties.id, conflictingIds), // Exclude properties with conflicting reservations
        ),
      });
      const validatedScrapedProperties = await Promise.all(
        scrapedProperties.map(async (property) => {
          if (property.imageUrls.length > 0) {
            const firstImageUrl = property.imageUrls[0]!;
            const isValid = await validateImage(firstImageUrl);
            if (isValid) {
              return property; // Keep the property if the image is valid
            } else {
              void db.delete(properties).where(eq(properties.id, property.id));
              return null; // Filter out if the image is invalid
            }
          } else {
            return null; // Filter out if no images
          }
        }),
      );

      // Filter out null values (properties with invalid or no images)
      const filteredScrapedProperties =
        validatedScrapedProperties.filter(Boolean);

      return {
        hostProperties: validHostProperties,
        scrapedProperties: filteredScrapedProperties,
      };
    }),

  getSearchResults: hostProcedure
    .input(z.object({ searchQuery: z.string(), currentHostTeamId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (input.searchQuery !== "") {
        return await ctx.db.query.properties.findMany({
          where: and(
            eq(properties.hostTeamId, input.currentHostTeamId),
            or(
              like(properties.name, `%${input.searchQuery}%`),
              like(properties.city, `%${capitalize(input.searchQuery)}%`),
            ),
          ),
        });
      }
      return null;
    }),

  updatePropertySecurityDepositAmount: coHostProcedure(
    "update_security_deposit",
    z.object({
      propertyId: z.number(),
      amount: z.number(),
      currentHostTeamId: z.number(),
    }),
  ).mutation(async ({ input }) => {
    const property = await db
      .update(properties)
      .set({
        currentSecurityDeposit: input.amount,
      })
      .where(eq(properties.id, input.propertyId));

    return property;
  }),

  updatePropertyPricingField: coHostProcedure(
    "modify_overall_pricing_strategy",
    z.object({
      propertyId: z.number(),
      field: extraPricingFieldSchema,
      amount: z.number(),
      maxGuestsWithoutFee: z.number().optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
    console.log(input);
    const field = input.field;
    await db
      .update(properties)
      .set({
        ...(input.maxGuestsWithoutFee && {
          maxGuestsWithoutFee: input.maxGuestsWithoutFee,
        }),
        [field]: input.amount,
      })
      .where(eq(properties.id, input.propertyId));
    return;
  }),

  updatePropertyStatus: publicProcedure
    .input(
      z.object({
        propertyId: z.number(),
        status: z.enum(["Listed", "Drafted", "Archived"]),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .update(properties)
        .set({ status: input.status })
        .where(eq(properties.id, input.propertyId));
    }),
});
