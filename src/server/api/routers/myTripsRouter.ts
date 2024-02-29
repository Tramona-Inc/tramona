import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { offers, requests } from "@/server/db/schema";
import { type TramonaDatabase } from "@/types";
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { z } from "zod";

const getAllAcceptedOffers = async (userId: string, db: TramonaDatabase) => {
  const result = await db
    .select({
      offerId: offers.id,
      requestId: offers.requestId,
      checkOut: requests.checkOut,
    })
    .from(offers)
    .fullJoin(requests, eq(offers.requestId, requests.id))
    .where(
      and(
        isNotNull(offers.acceptedAt),
        isNotNull(offers.paymentIntentId),
        isNotNull(offers.checkoutSessionId),
        eq(requests.userId, userId),
      ),
    );

  return result.map(({ offerId, requestId, checkOut }) => ({
    offerId: offerId!,
    requestId: requestId!,
    checkOut: checkOut!,
  }));
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
  checkOut: Date;
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
      const allAcceptedOffers = (
        await getAllAcceptedOffers(ctx.user.id, ctx.db)
      ).filter((id) => id !== null);

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
