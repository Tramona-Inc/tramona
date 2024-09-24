import {
  createTRPCRouter,
  protectedProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { groupMembers, properties, trips } from "@/server/db/schema";

import { TRPCError } from "@trpc/server";
import { group } from "console";
import { and, eq, exists, isNotNull, isNull, sql } from "drizzle-orm";
import { z } from "zod";

export const tripsRouter = createTRPCRouter({
  getAllPreviousTripsWithDetails: roleRestrictedProcedure(["admin"]).query(
    async () => {
      return await db.query.trips.findMany({
        with: {
          property: {
            columns: {
              id: true,
              name: true,
              city: true,
            },
            with: { host: { columns: { name: true, profileUrl: true } } },
          },
          offer: {
            columns: {
              paymentIntentId: true,
              checkIn: true,
              checkOut: true,
            },
          },
          group: {
            with: {
              owner: {
                columns: {
                  name: true,
                  id: true,
                  stripeCustomerId: true,
                  setupIntentId: true,
                },
              },
            },
          },
        },
      });
    },
  ),

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
          columns: {
            id: true,
            name: true,
            imageUrls: true,
            address: true,
            city: true,
            cancellationPolicy: true,
          },
          with: { host: { columns: { name: true, image: true } } },
        },
        offer: {
          columns: {
            paymentIntentId: true,
            checkIn: true,
            checkOut: true,
          },
        },
      },
    });
  }),

  getHostTrips: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.trips.findMany({
      where: exists(
        db.select().from(properties).where(eq(properties.hostId, ctx.user.id)),
      ),
      with: {
        property: {
          columns: { name: true, imageUrls: true, city: true },
          with: { host: { columns: { name: true, image: true } } },
        },
        offer: {
          columns: {
            totalPrice: true,
            checkIn: true,
            checkOut: true,
          },
          with: {
            request: {
              columns: {
                location: true,
                numGuests: true,
              },
              with: {
                madeByGroup: {
                  with: { owner: { columns: { name: true } } },
                },
              },
            },
          },
        },
      },
    });
  }),

  getMyTripsPageDetails: protectedProcedure
    .input(z.object({ tripId: z.number() }))
    .query(async ({ input }) => {
      const trip = await db.query.trips.findFirst({
        where: eq(trips.id, input.tripId),
      });

      const propertyForTrip = await db.query.properties.findFirst({
        where: eq(properties.id, trip!.propertyId),
        columns: {
          latLngPoint: true,
          id: true,
          imageUrls: true,
          city: true,
          name: true,
          checkInInfo: true,
          address: true,
          cancellationPolicy: true,
          checkInTime: true,
          checkOutTime: true,
        },
        with: {
          host: {
            columns: { name: true, email: true, image: true, id: true },
          },
        },
      });
      if (!trip || !propertyForTrip) throw new TRPCError({ code: "NOT_FOUND" });

      const fullTrip = { ...trip, property: propertyForTrip };

      const coordinates = {
        location: {
          lat: fullTrip.property.latLngPoint.y,
          lng: fullTrip.property.latLngPoint.x,
        },
      };
      return { trip: fullTrip, coordinates };
    }),
  getMyTripsPageDetailsByPaymentIntentId: protectedProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .query(async ({ input }) => {
      const trip = await db.query.trips.findFirst({
        where: eq(trips.paymentIntentId, input.paymentIntentId),
        with: {
          property: {
            columns: {
              id: true,
              latLngPoint: false,
              imageUrls: true,
              city: true,
              name: true,
              checkInInfo: true,
              address: true,
              cancellationPolicy: true,
              checkInTime: true,
              checkOutTime: true,
            },
            with: {
              host: {
                columns: { name: true, email: true, image: true, id: true },
              },
            },
          },
        },
      });
      const propertyLatLngPoint = await db.query.properties.findFirst({
        where: eq(properties.id, trip!.propertyId),
        columns: { latLngPoint: true },
      });
      if (!trip) {
        throw new Error("Trip not found");
      } else {
        const coordinates = {
          location: {
            lat: propertyLatLngPoint!.latLngPoint.y,
            lng: propertyLatLngPoint!.latLngPoint.x,
          },
        };
        return { trip, coordinates };
      }
    }),
  get24HourPostCheckInTrips: protectedProcedure.query(async () => {
    console.log("RUNNING 24 HOUR CHECK IN TRIPS");
    const now = new Date().toISOString();
    return await db.query.trips.findMany({
      with: {
        offer: {
          columns: {
            hostPayout: true,
          },
        },
        property: {
          columns: {
            hostId: true,
          },
        },
      },
      where: and(
        isNull(trips.hostPayed),
        isNotNull(trips.paymentCaptured),
        eq(trips.tripsStatus, "Booked"),
        sql`${trips.checkIn} <= ${sql`(${now}::timestamp - interval '24 hours')`}`,
      ),
    });
  }),
  getAllTripDamages: roleRestrictedProcedure(["admin"]).query(async () => {
    const allTrips = await db.query.tripDamages.findMany({});
    return allTrips.length > 0 ? allTrips : [];
  }),
});
