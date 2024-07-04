import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { groupMembers, properties, trips } from "@/server/db/schema";
import { getCoordinates } from "@/server/google-maps";
import { getNumNights } from "@/utils/utils";
import { TRPCError } from "@trpc/server";
import { and, eq, exists } from "drizzle-orm";
import { z } from "zod";

export const tripsRouter = createTRPCRouter({
  getMyTrips: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.trips.findMany({
      where: and(
        exists(
          db
            .select()
            .from(groupMembers)
            .where(
              and(
                eq(groupMembers.groupId, trips.groupId),
                eq(groupMembers.userId, ctx.user.id),
              ),
            ),
        ),
      ),
      with: {
        property: {
          columns: { name: true, imageUrls: true, address: true },
          with: { host: { columns: { name: true, image: true } } },
        },
      },
    });
  }),

  getHostTrips: protectedProcedure.query(async ({ ctx }) => {
    const trips = await db.query.trips.findMany({
      where: and(
        exists(
          db
            .select()
            .from(properties)
            .where(
              eq(properties.hostId, ctx.user.id)
            ),
        ),
      ),
      with: {
        property: {
          columns: {
            name: true,
            imageUrls: true,
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
        offer: {
          columns: {
            totalPrice: true,
            checkIn: true,
            checkOut: true,
          },
          with : {
            request: {
              columns: {
                location: true,
                numGuests: true,
              }
            }
          }
        }
      }
    });

    const transformedTrips = trips.map((trip) => {
      return {
        propertyImg: trip.property.imageUrls?.[0] ?? "/default-img.png", // Fallback image if none provided
        propertyName: trip.property.name,
        propertyLocation: trip.offer?.request?.location ?? "Unknown location",
        checkIn: trip.offer?.checkIn,
        checkOut: trip.offer?.checkOut,
        nightlyCost: trip.offer?.totalPrice / (getNumNights(trip.offer?.checkIn, trips.offer?.checkOut)), // Calculate nightly cost
        totalCost: trip.offer?.totalPrice,
        guests: Array(trip.offer?.request?.numGuests).fill("Guest"), // Placeholder for guests
      };
    });
    return transformedTrips;
  }),

  getMyTripsPageDetails: protectedProcedure
    .input(z.object({ tripId: z.number() }))
    .query(async ({ input }) => {
      const tripWithOrigin = await db.query.trips.findFirst({
        where: eq(trips.id, input.tripId),
        with: {
          bid: { with: { counters: { columns: { counterAmount: true } } } },
          offer: { columns: { totalPrice: true } },
          property: {
            with: {
              host: {
                columns: { name: true, email: true, image: true, id: true },
              },
            },
          },
        },
      });

      if (!tripWithOrigin) throw new TRPCError({ code: "NOT_FOUND" });

      const coordinates = await getCoordinates(tripWithOrigin.property.address);
      const { bid, offer, ...trip } = tripWithOrigin;
      const tripPrice = bid
        ? bid.counters[bid.counters.length - 1]?.counterAmount
        : offer?.totalPrice;

      if (tripPrice === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not find the price for this trip.",
        });
      }

      return { trip, tripPrice, coordinates };
    }),
});
