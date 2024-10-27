import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { requestsToBook, requestsToBookInsertSchema } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq, exists, lt } from "drizzle-orm";
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
    });
      //     with: {
      //         property: {
      //             columns: {
      //                 id: true,
      //                 imageUrls: true,
      //                 name: true,
      //                 numBedrooms: true,
      //                 numBathrooms: true,
      //                 originalNightlyPrice: true,
      //                 originalListingUrl: true,
      //                 hostName: true,
      //                 hostProfilePic: true,
      //                 bookOnAirbnb: true,
      //             },
      //             with: {
      //                 host: { columns: { name: true, email: true, image: true } },
      //             },
      //         },
      //         madeByGroup: {
      //             with: {
      //                 invites: true,
      //                 members: {
      //                     with: {
      //                         user: {
      //                             columns: { name: true, email: true, image: true, id: true },
      //                         },
      //                     },
      //                 },
      //             },
      //         },
      //     },
      // });
      
      // // Additional logging to check the fetched requests
      // console.log("Fetched requests to book:", myRequestsToBook);
  
      return {
          activeRequestsToBook: myRequestsToBook.filter(
              (requestToBook) => requestToBook.resolvedAt === null,
          ),
          inactiveRequestsToBook: myRequestsToBook.filter(
              (requestToBook) => requestToBook.resolvedAt !== null,
          ),
      };
  }),
});
