import { type UpcomingTrip } from "@/components/my-trips/UpcomingTrips";
import { type AcceptedBids, type AcceptedTrips } from "@/pages/my-trips";
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

// ! NEED TO FIX AS IT IMPORTS RETURN TYPE FROM CLIENT
const transformBookedTrips = (trip: AcceptedTrips): UpcomingTrip => {
  return {
    id: trip.id,
    request: {
      checkIn: new Date(trip.request.checkIn),
      checkOut: new Date(trip.request.checkOut),
    },
    property: {
      name: trip.property.name,
      imageUrls: trip.property.imageUrls,
      address: trip.property.address,
      host: {
        name: trip.property.host?.name ?? "",
        image: trip.property.host?.image ?? "",
      },
    },
  };
};

const transformAcceptedBids = (trip: AcceptedBids): UpcomingTrip => {
  return {
    id: trip.property.id,
    request: {
      checkIn: new Date(trip.checkIn),
      checkOut: new Date(trip.checkOut),
    },
    property: {
      name: trip.property.name,
      imageUrls: trip.property.imageUrls,
      address: trip.property.address,
      host: {
        name: trip.property.host?.name ?? "",
        image: trip.property.host?.image ?? "",
      },
    },
  };
};

const getAllAcceptedBids = async (userId: string) => {
  return await db.query.bids.findMany({
    where: and(
      exists(
        db
          .select()
          .from(groupMembers)
          .where(
            and(
              eq(groupMembers.groupId, bids.madeByGroupId),
              eq(groupMembers.userId, userId),
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

      // Get all accepted bids
      const allAcceptedBids = await getAllAcceptedBids(ctx.user.id);

      // Transform accepted bids and trips
      const transformedTrips: UpcomingTrip[] = (displayAllUpcomingTrips ?? []).map(
        transformBookedTrips,
      );
      const transformedAcceptedBids: UpcomingTrip[] = (allAcceptedBids ?? []).map(
        transformAcceptedBids,
      );

      // Combine both transformed arrays
      const combinedTrips: UpcomingTrip[] = [
        ...transformedTrips,
        ...transformedAcceptedBids,
      ];

      return combinedTrips;
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
    return getAllAcceptedBids(ctx.user.id);
  }),
});
