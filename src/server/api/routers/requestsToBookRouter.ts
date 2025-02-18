import {
  createTRPCRouter,
  hostProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  requestsToBook,
  requestsToBookInsertSchema,
  statusEnumArray,
  users,
  properties,
  groups,
  hostTeams,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { zodInteger, zodString } from "@/utils/zod-utils";
import { CitiesLatLong } from "../../../utils/store/cities-filter";
import { hostTeamMembers } from "../../db/schema/tables/hostTeams";
import RequestToBookBtn from "@/components/propertyPages/sidebars/actionButtons/RequestToBookBtn";
import { request } from "http";
import { Users } from "lucide-react";
const MAX_RETRIES = 3; // set a max number of retries
const INITIAL_DELAY = 500; // set a delay in milliseconds

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const requestsToBookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      requestsToBookInsertSchema.omit({
        id: true,
        createdAt: true,
        userId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newRequest = await db
        .insert(requestsToBook)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning();

      if (!newRequest[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create request to book",
        });
      }

      return newRequest[0];
    }),

  getMyRequestsToBook: protectedProcedure.query(async ({ ctx }) => {
    console.log("User ID from context:", ctx.user.id); // Log the user ID

    const myRequestsToBook = await ctx.db.query.requestsToBook.findMany({
      where: eq(requestsToBook.userId, ctx.user.id),
      with: {
        property: {
          columns: {
            amenities: true,
            city: true,
            county: true,
            stateCode: true,
            country: true,
            imageUrls: true,
            name: true,
            numBedrooms: true,
            numBathrooms: true,
            bookOnAirbnb: true,
            hostName: true,
            hostProfilePic: true,
            originalListingUrl: true,
            originalNightlyPrice: true,
          },
          with: {
            hostTeam: {
              with: {
                owner: true,
                members: {
                  with: {
                    user: {
                      columns: {
                        id: true,
                        firstName: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      activeRequestsToBook: myRequestsToBook.filter(
        (requestToBook) => requestToBook.resolvedAt === null,
      ),
      inactiveRequestsToBook: myRequestsToBook.filter(
        (requestToBook) => requestToBook.resolvedAt !== null,
      ),
    };
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(statusEnumArray) }))
    .mutation(async ({ ctx, input }) => {
      // Only group owner and admin can delete
      // (or anyone if there's no group owner for whatever reason)

      if (ctx.user.role !== "admin") {
        const request = await ctx.db.query.requestsToBook.findFirst({
          where: eq(requestsToBook.id, input.id),
          with: {
            madeByGroup: true,
          },
        });

        if (!request?.madeByGroup) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }

        if (ctx.user.id !== request.madeByGroup.ownerId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db
        .update(requestsToBook)
        .set({
          resolvedAt: new Date(),
          status: input.status,
        })
        .where(eq(requestsToBook.id, input.id));
    }),

  getHostRequestsToBookFromId: hostProcedure
    .input(z.object({ propertyId: z.number(), currentHostTeamId: z.number() }))
    .query(async ({ ctx, input }) => {
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, input.propertyId),
        columns: { hostTeamId: true },
      });

      if (!property) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found",
        });
      }

      // Check if user is authorized
      if (
        ctx.user.role !== "admin" &&
        property.hostTeamId !== input.currentHostTeamId
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view these requests",
        });
      }

      const propertyRequestsToBook = await ctx.db.query.requestsToBook.findMany(
        {
          where: eq(requestsToBook.propertyId, input.propertyId),
          with: {
            property: {
              columns: {
                name: true,
                imageUrls: true,
                numBedrooms: true,
                numBathrooms: true,
                bookOnAirbnb: true,
                hostName: true,
                hostProfilePic: true,
                city: true,
              },
            },
            madeByGroup: {
              columns: {
                ownerId: true,
              },
              with: {
                owner: {
                  columns: {
                    firstName: true,
                    lastName: true,
                    name: true,
                    image: true,
                    location: true,
                    about: true,
                  },
                },
              },
            },
          },
        },
      );

      const transformedRequestsToBook = propertyRequestsToBook.map(
        (request) => ({
          ...request,
          traveler: request.madeByGroup.owner,
        }),
      );

      return {
        activeRequestsToBook: transformedRequestsToBook.filter(
          (requestToBook) => requestToBook.resolvedAt === null,
        ),
        inactiveRequestsToBook: transformedRequestsToBook.filter(
          (requestToBook) => requestToBook.resolvedAt !== null,
        ),
      };
    }),

  getByPropertyId: protectedProcedure
    .input(
      z.object({
        propertyId: zodInteger(),
        conversationParticipants: z.array(zodString()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const requestsWithGroup = await ctx.db.query.requestsToBook.findMany({
        with: {
          madeByGroup: {
            with: {
              owner: {
                columns: {
                  id: true,
                },
              },
            },
          },
          property: {
            columns: {
              id: true,
              name: true,
              imageUrls: true,
              bookItNowEnabled: true,
            },
          },
        },
        where: eq(requestsToBook.propertyId, input.propertyId),
      });

      return requestsWithGroup.filter(
        (request) => request.madeByGroup.owner.id === ctx.user.id,
      );
    }),

  getByPropertyIdForHost: protectedProcedure
    .input(
      z.object({
        propertyId: z.number(),
        conversationParticipants: z.array(z.string()),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const property = await ctx.db.query.properties.findFirst({
        where: eq(properties.id, input.propertyId),
        columns: { hostTeamId: true, id: true },
      });

      const userId = input.userId ?? ctx.user.id;
      console.log(property, "property");

      if (!property) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Property not found",
        });
      }

      const allRequests = await ctx.db.query.requestsToBook.findMany({
        where: and(
          eq(requestsToBook.propertyId, input.propertyId),
          inArray(requestsToBook.userId, input.conversationParticipants),
        ),
        with: {
          property: {
            columns: {
              id: true,
              name: true,
              imageUrls: true,
              numBedrooms: true,
              numBathrooms: true,
              bookOnAirbnb: true,
              hostName: true,
              hostProfilePic: true,
              city: true,
            },
          },
          madeByGroup: {
            columns: {
              ownerId: true,
            },
            with: {
              owner: {
                columns: {
                  firstName: true,
                  lastName: true,
                  name: true,
                  image: true,
                  location: true,
                  about: true,
                },
              },
            },
          },
        },
      });

      console.log(allRequests, "allRequests");

      const transformedRequestsToBook = allRequests.map((request) => ({
        ...request,
        traveler: request.madeByGroup.owner,
      }));

      console.log(transformedRequestsToBook, "transformedRequestsToBook");

      // Filter requests by conversation participants and get only one.
      const requestToBook = transformedRequestsToBook.filter(
        (request) => request.madeByGroup.ownerId === userId,
      );

      if (!requestToBook || requestToBook.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Request to book not found for this user in the current converation",
        });
      }

      return requestToBook;
    }),

  getAllRequestToBookProperties: hostProcedure
    .input(z.object({ currentHostTeamId: z.number() }))
    .query(async ({ input }) => {
      const allPropertiesWithRequestToBook = await db.query.properties.findMany(
        {
          where: eq(properties.hostTeamId, input.currentHostTeamId),
          with: {
            requestsToBook: {
              with: {
                madeByGroup: {
                  with: {
                    owner: true,
                  },
                },
              },
            },
          },
        },
      );

      return allPropertiesWithRequestToBook;
    }),

  getRequestToBookByPaymentIntentId: protectedProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .query(async ({ input }) => {
      console.log(input.paymentIntentId);
      console.log(input, "input");
      const confirmedRequestToBookWithProperty =
        await db.query.requestsToBook.findFirst({
          where: eq(requestsToBook.paymentIntentId, input.paymentIntentId),
          with: {
            property: {
              columns: {
                latLngPoint: false,
              },
            },
            madeByGroup: true,
            hostTeam: true,
          },
        });
      console.log(confirmedRequestToBookWithProperty, "test here");
      return confirmedRequestToBookWithProperty;
    }),

  getAdminRequestsToBook: protectedProcedure.query(async ({ ctx }) => {
    try {
      const requests = await db
        .select({
          id: requestsToBook.id,
          status: requestsToBook.status,
          checkIn: requestsToBook.checkIn,
          checkOut: requestsToBook.checkOut,
          numGuests: requestsToBook.numGuests,
          createdAt: requestsToBook.createdAt,
          resolvedAt: requestsToBook.resolvedAt,
          calculatedTravelerPrice: requestsToBook.calculatedTravelerPrice,
          isDirectListing: requestsToBook.isDirectListing,
          // Join with users
          guestName: users.name,
          // Join with properties
          propertyName: properties.name,
          propertyCity: properties.city,
        })
        .from(requestsToBook)
        .leftJoin(users, eq(requestsToBook.userId, users.id))
        .leftJoin(properties, eq(requestsToBook.propertyId, properties.id))
        .orderBy(requestsToBook.createdAt);

      return {
        activeRequests: requests.filter(
          (req) => req.status === "Pending" && !req.resolvedAt
        ),
        pastRequests: requests.filter(
          (req) => req.status !== "Pending" || req.resolvedAt
        ),
      };
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch requests",
      });
    }
  }),
});
