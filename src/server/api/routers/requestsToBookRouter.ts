import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { requestsToBook, requestsToBookInsertSchema } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq, exists, lt, sql } from "drizzle-orm";
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
            // latLngPoint: true,
            city: true,
            imageUrls: true,
            name: true,
            numBedrooms: true,
            numBathrooms: true,
            bookOnAirbnb: true,
            hostName: true,
            hostProfilePic: true,
            },
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
    .input(requestSelectSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      // Only group owner and admin can delete
      // (or anyone if there's no group owner for whatever reason)

      if (ctx.user.role !== "admin") {
        const groupOwnerId = await ctx.db.query.requestsToBook.findFirst({
          where: eq(requestsToBook.id, input.id),
          columns: {},
          // with: {
          //   madeByGroup: { columns: { ownerId: true } },
          // },
        });
        // .then((res) => res?.madeByGroup.ownerId);

        if (!groupOwnerId) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }

        if (ctx.user.id !== groupOwnerId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await ctx.db
        .delete(requestsToBook)
        .where(eq(requestsToBook.id, input.id));
    }),
});
