import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { offers, requests } from "@/server/db/schema";
import { and, eq, inArray, isNotNull, or } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { z } from "zod";

async function getAllUserRequests(
  id: string,
  db: PostgresJsDatabase<typeof import("/home/zachuri/Documents/job/tramona/tramona/src/server/db/schema/index")>;
) {
  return await db
    .select({
      requestId: requests.id,
      checkOut: requests.checkOut,
    })
    .from(requests)
    .where(eq(requests.userId, id));
}

export const myTripsRouter = createTRPCRouter({
  mostRecentTrips: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get all user Requests
      // const userRequests = await ctx.db
      //   .select({
      //     requestId: requests.id,
      //     checkOut: requests.checkOut,
      //   })
      //   .from(requests)
      //   .where(eq(requests.userId, ctx.user.id));

      const userRequests = getAllUserRequests(ctx.user.id, ctx.db )

      // Get all accepted offers
      const allPaidTrips = await ctx.db
        .select({ offerId: offers.id, requestId: offers.requestId })
        .from(offers)
        .where(
          and(
            isNotNull(offers.acceptedAt),
            isNotNull(offers.paymentIntentId),
            isNotNull(offers.checkoutSessionId),
            or(
              ...userRequests.map((request) =>
                eq(offers.requestId, request.requestId),
              ),
            ),
          ),
        )
        .then((allPaidTrips) =>
          allPaidTrips.map((paidTrip) => {
            const matchingRequest = userRequests.find(
              (userRequest) => userRequest.requestId === paidTrip.requestId,
            );

            return {
              ...paidTrip,
              checkOut: matchingRequest?.checkOut,
            };
          }),
        );

      // Obtain upcoming and previous offer ids
      const upcomingTripIds = allPaidTrips
        .filter((trip) => trip.checkOut && trip.checkOut >= input.date)
        .map((trip) => trip.offerId);

      const previousTripIds = allPaidTrips
        .filter((trip) => trip.checkOut && trip.checkOut < input.date)
        .map((trip) => trip.offerId);

      // Fetch the trips data to display
      const getDisplayTrips = async (tripIds: number[], limit: number) => {
        return await ctx.db.query.offers.findMany({
          where: inArray(offers.id, tripIds),
          limit: limit,
          with: {
            property: {
              with: {
                host: { columns: { name: true, email: true, image: true } },
              },
              columns: {
                name: true,
                imageUrls: true,
                address: true,
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
      };

      const displayUpcomingTrips = await getDisplayTrips(upcomingTripIds, 2);
      const displayPreviousTrips = await getDisplayTrips(previousTripIds, 2);

      // Overall total of upcoming and previous trips
      const totalUpcomingTrips = upcomingTripIds.length;
      const totalPreviousTrips = previousTripIds.length;

      return {
        totalUpcomingTrips,
        totalPreviousTrips,
        displayUpcomingTrips,
        displayPreviousTrips,
      };
    }),
  getUpcomingTrips: publicProcedure.query(async ({ ctx }) => {
    return null;
  }),
});
