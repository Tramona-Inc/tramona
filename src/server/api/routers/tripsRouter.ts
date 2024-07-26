import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { groupMembers, properties, trips } from "@/server/db/schema";
import { getCoordinates } from "@/server/google-maps";
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
      const tripWithOrigin = await db.query.trips.findFirst({
        where: eq(trips.id, input.tripId),
        with: {
          property: {
            columns: {
              latLngPoint: false,
            },
            with: {
              host: {
                columns: { name: true, email: true, image: true, id: true },
              },
            },
          },
        },
      });

      if (!tripWithOrigin) throw new TRPCError({ code: "NOT_FOUND" });

      const coordinates = {
        location: {
          lat: tripWithOrigin.property.latitude,
          lng: tripWithOrigin.property.longitude,
        },
      };

      const { ...trip } = tripWithOrigin;

      return { trip, coordinates };
    }),
});
