import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { offers, requests } from "@/server/db/schema";
import { and, eq, isNotNull, or } from "drizzle-orm";
import { z } from "zod";

export const myTripsRouter = createTRPCRouter({
  mostRecentTrips: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Obtain all request ids by the user
      const requestIds = await ctx.db
        .select({ requestId: requests.id })
        .from(requests)
        .where(eq(requests.userId, ctx.user.id))
        .then((requestIdsData) =>
          requestIdsData.map((request) => request.requestId),
        );

      const allTrips = await ctx.db.query.offers.findMany({
        where: and(
          isNotNull(offers.acceptedAt),
          isNotNull(offers.paymentIntentId),
          isNotNull(offers.checkoutSessionId),
          or(...requestIds.map((requestId) => eq(offers.requestId, requestId))),
        ),
        with: {
          property: {
            with: {
              host: { columns: { name: true, email: true, image: true } },
            },
            columns: {
              name: true,
              imageUrls: true,
            },
          },
          request: {
            columns: {
              userId: true,
              checkIn: true,
              checkOut: true,
              resolvedAt: true,
            },
            with: {
              madeByUser: { columns: { name: true } }, // Fetch user name
            },
          },
        },
      });

      const upcomingTrips = allTrips.filter(
        (trip) =>
          trip.request.checkIn && new Date(trip.request.checkIn) > input.date,
      );

      const previousTrips = allTrips.filter(
        (trip) =>
          trip.request.checkIn && new Date(trip.request.checkIn) <= input.date,
      );

      return { upcomingTrips, previousTrips };
    }),
});
