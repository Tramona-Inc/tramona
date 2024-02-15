import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { offers, requests } from "@/server/db/schema";
import { and, eq, inArray, isNotNull, or } from "drizzle-orm";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { z } from "zod";

export type TramonaDatabase = PostgresJsDatabase<
  typeof import("/home/zachuri/Documents/job-files/companies/tramona/tramona/src/server/db/schema/index")
>;

const getAllAcceptedOffers = async (userId: string, db: TramonaDatabase) => {
  // Get all uers requests
  const userRequests = await db
    .select({
      requestId: requests.id,
      checkOut: requests.checkOut,
    })
    .from(requests)
    .where(eq(requests.userId, userId));

  // Get's all accepted offers
  return await db
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
};

// Fetch the trips data to display
const getDisplayTrips = async (
  tripIds: number[],
  db: TramonaDatabase,
  limit?: number,
) => {
  if (tripIds.length === 0) {
    return null;
  } else {
    return await db.query.offers.findMany({
      where: inArray(offers.id, tripIds),
      limit: limit ?? undefined,
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
  }
};

type AllAcceptedOffers = {
  checkOut: Date | undefined;
  offerId: number;
  requestId: number;
}[];

const getCertainTrips = async (
  type: string,
  allAcceptedOffers: AllAcceptedOffers,
  date: Date,
) => {
  switch (type) {
    case "previous":
      return allAcceptedOffers
        .filter((trip) => trip.checkOut && trip.checkOut < date)
        .map((trip) => trip.offerId);
    case "upcoming":
      return allAcceptedOffers
        .filter((trip) => trip.checkOut && trip.checkOut >= date)
        .map((trip) => trip.offerId);
    default:
      return [];
  }
};

export const myTripsRouter = createTRPCRouter({
  mostRecentTrips: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get all accepted offers
      const allAcceptedOffers = await getAllAcceptedOffers(ctx.user.id, ctx.db);

      // Get upcoming trips
      const upcomingTripIds = await getCertainTrips(
        "upcoming",
        allAcceptedOffers,
        input.date,
      );

      const displayUpcomingTrips = await getDisplayTrips(
        upcomingTripIds,
        ctx.db,
        2,
      );

      // Get previous trips
      const previousTripIds = await getCertainTrips(
        "previous",
        allAcceptedOffers,
        input.date,
      );

      const displayPreviousTrips = await getDisplayTrips(
        previousTripIds,
        ctx.db,
        2,
      );

      return {
        totalUpcomingTrips: upcomingTripIds.length,
        totalPreviousTrips: previousTripIds.length,
        displayUpcomingTrips,
        displayPreviousTrips,
      };
    }),
  getUpcomingTrips: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get all accepted offers
      const allAcceptedOffers = await getAllAcceptedOffers(ctx.user.id, ctx.db);

      // Get upcoming trips
      const upcomingTripIds = await getCertainTrips(
        "upcoming",
        allAcceptedOffers,
        input.date,
      );

      const displayAllUpcomingTrips = await getDisplayTrips(
        upcomingTripIds,
        ctx.db,
      );

      return displayAllUpcomingTrips;
    }),
  getPreviousTrips: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get all accepted offers
      const allAcceptedOffers = await getAllAcceptedOffers(ctx.user.id, ctx.db);

      // Get upcoming trips
      const upcomingTripIds = await getCertainTrips(
        "previous",
        allAcceptedOffers,
        input.date,
      );

      const displayAllUpcomingTrips = await getDisplayTrips(
        upcomingTripIds,
        ctx.db,
      );

      return displayAllUpcomingTrips;
    }),
});
