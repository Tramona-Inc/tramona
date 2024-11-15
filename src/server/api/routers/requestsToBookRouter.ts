import {
  createTRPCRouter,
  hostProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  requestsToBook,
  requestsToBookInsertSchema,
  statusEnum,
  statusEnumArray,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq, exists, isNull, lt, sql } from "drizzle-orm";
import {
  groupMembers,
  groups,
  requestInsertSchema,
  requestSelectSchema,
  requests,
  users,
  offers,
  rejectedRequests,
  properties,
  tripCheckouts,
} from "@/server/db/schema";
import { unique } from "drizzle-orm/pg-core";

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
            imageUrls: true,
            name: true,
            numBedrooms: true,
            numBathrooms: true,
            bookOnAirbnb: true,
            hostName: true,
            hostProfilePic: true,
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
    .input(z.object({ propertyId: z.number() }))
    .query(async ({ ctx, input }) => {
      const property = await ctx.db.query.properties.findFirst({
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
        property.hostTeamId !== ctx.hostProfile.curTeamId
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

  getAllRequestToBookProperties: hostProcedure.query(async ({ ctx }) => {
    const allPropertiesWithRequestToBook = await db.query.properties.findMany({
      where: eq(properties.hostTeamId, ctx.hostProfile.curTeamId),
      with: {
        requestsToBook: true,
      },
    });

    return allPropertiesWithRequestToBook;
  }),
});
