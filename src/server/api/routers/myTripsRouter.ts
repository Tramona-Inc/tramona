import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { bids, groupMembers, offers, requests } from "@/server/db/schema";
import { and, eq, exists, inArray, isNotNull } from "drizzle-orm";
import { z } from "zod";

const getAllAcceptedOffers = async (userId: string) => {
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
        exists(
          db
            .select()
            .from(groupMembers)
            .where(
              and(
                eq(groupMembers.userId, userId),
                eq(groupMembers.groupId, requests.madeByGroupId),
              ),
            ),
        ),
      ),
    );

  return result.map(({ offerId, requestId, checkOut }) => ({
    offerId: offerId!,
    requestId: requestId!,
    checkOut: checkOut!,
  }));
};

// Fetch the trips data to display
const getDisplayTrips = async (tripIds: number[], limit?: number) => {
  if (tripIds.length === 0) {
    return [];
  } else {
    return await db.query.offers.findMany({
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
            checkInInfo: true,
          },
        },
        request: {
          columns: {
            checkIn: true,
            checkOut: true,
            resolvedAt: true,
          },
          with: {
            madeByGroup: {
              with: {
                members: {
                  with: {
                    user: {
                      columns: {
                        name: true,
                        email: true,
                        image: true,
                        phoneNumber: true,
                        id: true,
                      },
                    },
                  },
                },
                invites: true,
              },
            },
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
        await getAllAcceptedOffers(ctx.user.id)
      ).filter((id) => id !== null);

      // Get upcoming trips
      const upcomingTripIds = await getCertainTrips(
        "upcoming",
        allAcceptedOffers,
        input.date,
      );

      const displayUpcomingTrips = await getDisplayTrips(upcomingTripIds, 2);

      // Get previous trips
      const previousTripIds = await getCertainTrips(
        "previous",
        allAcceptedOffers,
        input.date,
      );

      const displayPreviousTrips = await getDisplayTrips(previousTripIds, 2);

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
      const allAcceptedOffers = await getAllAcceptedOffers(ctx.user.id);

      // Get upcoming trips
      const upcomingTripIds = await getCertainTrips(
        "upcoming",
        allAcceptedOffers,
        input.date,
      );

      const displayAllUpcomingTrips = await getDisplayTrips(upcomingTripIds);

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
      const allAcceptedOffers = await getAllAcceptedOffers(ctx.user.id);

      // Get upcoming trips
      const upcomingTripIds = await getCertainTrips(
        "previous",
        allAcceptedOffers,
        input.date,
      );

      const displayAllUpcomingTrips = await getDisplayTrips(upcomingTripIds);

      return displayAllUpcomingTrips;
    }),
  getAcceptedBids: protectedProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.query.bids.findMany({
      where: and(
        exists(
          ctx.db
            .select()
            .from(groupMembers)
            .where(
              and(
                eq(groupMembers.groupId, bids.madeByGroupId),
                eq(groupMembers.userId, ctx.user.id),
              ),
            ),
        ),
        eq(bids.status, "Accepted"),
        isNotNull(bids.paymentIntentId),
      ),
      columns: {
        id: true,
        checkIn: true,
        checkOut: true,
      },
      with: {
        property: {
          columns: {
            id: true,
            imageUrls: true,
            name: true,
            address: true,
            originalNightlyPrice: true,
          },
          with: {
            host: {
              columns: {
                name: true,
                image: true,
              },
            },
          },
        },
        madeByGroup: {
          with: { members: { with: { user: true } }, invites: true },
        },
        // Gets the latest counter
        counters: {
          orderBy: (counters, { desc }) => [desc(counters.createdAt)],
          columns: {
            id: true,
            counterAmount: true,
            createdAt: true,
            status: true,
            userId: true,
          },
        },
      },
    });
  }),
});
