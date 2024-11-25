import {
  createTRPCRouter,
  hostProcedure,
  protectedProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  groupMembers,
  properties,
  superhogRequests,
  groups,
  trips,
  tripCancellations,
} from "@/server/db/schema";
import { cancelSuperhogReservation } from "@/utils/webhook-functions/superhog-utils";
import { sendEmail } from "@/server/server-utils";

import { TRPCError } from "@trpc/server";
import { and, eq, exists, isNotNull, isNull, sql, lte, ne } from "drizzle-orm";
import { z } from "zod";
import BookingCancellationEmail from "packages/transactional/emails/BookingCancellationEmail";
import { formatDateRange, getNumNights, removeTax } from "@/utils/utils";
import { refundTripWithStripe } from "@/utils/stripe-utils";
import { TAX_PERCENTAGE } from "@/utils/constants";

export const tripsRouter = createTRPCRouter({
  getAllPreviousTripsWithDetails: roleRestrictedProcedure(["admin"]).query(
    async () => {
      const previousTrips = await db.query.trips.findMany({
        with: {
          property: {
            columns: {
              id: true,
              name: true,
              city: true,
            },
            with: {
              hostTeam: {
                with: {
                  owner: {
                    columns: { name: true, profileUrl: true, id: true },
                  },
                },
              },
            },
          },
          offer: {
            columns: {
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
        where: lte(trips.checkOut, new Date()),
      });

      return previousTrips;
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
            checkInTime: true,
            checkOutTime: true,
            hostName: true,
            hostProfilePic: true,
          },
          with: {
            hostTeam: {
              with: { owner: { columns: { name: true, image: true } } },
            },
          },
        },
        offer: {
          columns: {
            checkIn: true,
            checkOut: true,
          },
        },
      },
    });
  }),

  getHostTrips: hostProcedure.query(async ({ ctx }) => {
    return await db.query.trips.findMany({
      where: exists(
        db
          .select()
          .from(properties)
          .where(
            and(
              eq(properties.hostTeamId, ctx.hostProfile.curTeamId),
              eq(properties.id, trips.propertyId),
            ),
          ),
      ),
      with: {
        property: {
          columns: { name: true, imageUrls: true, city: true },
          with: {
            hostTeam: {
              with: { owner: { columns: { name: true, image: true } } },
            },
          },
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
        with: {
          tripCheckout: true,
        },
      });

      if (!trip) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trip not found for id ${input.tripId}`,
        });
      }

      const propertyForTrip = await db.query.properties.findFirst({
        where: eq(properties.id, trip.propertyId),
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
          hostTeam: {
            with: {
              owner: {
                columns: { name: true, email: true, image: true, id: true },
              },
            },
          },
        },
      });

      if (!propertyForTrip) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Property not found for trip ${input.tripId}`,
        });
      }

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
          tripCheckout: true,
          property: {
            columns: {
              id: true,
              latLngPoint: false,
              imageUrls: true,
              city: true,
              name: true,
              // checkInInfo: true,
              address: true,
              cancellationPolicy: true,
              checkInTime: true,
              checkOutTime: true,
            },
            with: {
              hostTeam: {
                with: {
                  owner: {
                    columns: { name: true, email: true, image: true, id: true },
                  },
                },
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
            hostTeamId: true,
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
  getAllclaimItems: roleRestrictedProcedure(["admin"]).query(async () => {
    const allClaimItems = await db.query.claimItems.findMany();
    console.log("claim", allClaimItems);

    return allClaimItems.length > 0 ? allClaimItems : [];
  }),

  getTripCancelationPolicyByTripId: protectedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const trip = await db.query.trips.findFirst({
        where: eq(trips.id, input),
      });
      return trip;
    }),

  cancelTripById: protectedProcedure
    .input(
      z.object({
        tripId: z.number(),
        reason: z.string(),
        refundAmount: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      //1.cancel superhog.. skip request with null or rejected
      const curSuperhogRequest = await db.query.superhogRequests.findFirst({
        where: and(
          eq(superhogRequests.superhogReservationId, input.tripId.toString()),
          and(ne(superhogRequests.superhogStatus, "Rejected")),
          isNotNull(superhogRequests.superhogStatus),
        ),
        columns: {
          superhogVerificationId: true,
          superhogReservationId: true,
          isCancelled: true,
        },
      });
      //--- only update if superhog exist, has not been cancelled and is approved or pending --
      if (curSuperhogRequest && curSuperhogRequest.isCancelled === false)
        await cancelSuperhogReservation({
          verificationId: curSuperhogRequest.superhogVerificationId,
          reservationId: curSuperhogRequest.superhogReservationId,
        });

      //2.update trip status
      const currentTrip = await db
        .update(trips)
        .set({
          tripsStatus: "Cancelled",
        })
        .where(eq(trips.id, input.tripId))
        .returning()
        .then((res) => res[0]!);

      //3.add the reason
      const currentCancellations = await db
        .insert(tripCancellations)
        .values({
          tripId: input.tripId,
          reason: input.reason,
        })
        .returning()
        .then((res) => res[0]!);

      //4. send email
      // ------send an email to the group --------
      const requestGroupId = await db.query.groups.findFirst({
        where: eq(groups.id, currentTrip.groupId),
      });

      const requestGroup = await db.query.groupMembers.findMany({
        where: eq(groupMembers.groupId, requestGroupId!.id),
        with: {
          user: {
            columns: { email: true, firstName: true, name: true },
          },
        },
      });
      //get property name
      const property = await db.query.properties.findFirst({
        columns: { name: true },
        where: eq(properties.id, currentTrip.propertyId),
      });

      //send email to each member
      for (const member of requestGroup) {
        console.log("Sending Email to: ", member.user.email);
        await sendEmail({
          to: member.user.email,
          subject: "Booking Cancelled - Tramona",
          content: BookingCancellationEmail({
            userName: member.user.firstName ?? member.user.name ?? "Traveler",
            confirmationNumber: currentTrip.id.toString(),
            dateRange: formatDateRange(
              currentTrip.checkIn,
              currentTrip.checkOut,
            ).toString(),

            property: property!.name,
            reason: currentCancellations.reason,
            refund: currentTrip.totalPriceAfterFees,

            //partial refund
            //partialRefund: true
            //partialRefundDateRange: formatDateRange(
            //   currentTrip.checkIn,
            //   currentTrip.checkOut,
            // ).toString(),
          }),
        });
      }
      //------------- 5. Issue refund  ----------
      //$220.15
      const amountWithoutProcessingFees = Math.round(
        Math.round((currentTrip.totalPriceAfterFees - 3) / 1.029),
      );

      const amountWithoutSuperhogOrTax = input.refundAmount
        ? input.refundAmount
        : amountWithoutProcessingFees;

      //------add the taxes we took and the superhog fees if not scraped property----
      //1. offer with trips
      const curTrip = await db.query.trips.findFirst({
        where: eq(trips.id, input.tripId),
        with: {
          offer: {
            columns: {
              madePublicAt: false,
              becomeVisibleAt: false,
            },
          },
        },
      });

      // determine if it is a scraped property
      let amount;
      if (curTrip?.offer?.scrapeUrl) {
        amount = amountWithoutSuperhogOrTax;
      } else {
        //dont refund the tax or superhog
        const numOfNights = getNumNights(curTrip!.checkIn, curTrip!.checkOut);
        amount =
          removeTax(amountWithoutSuperhogOrTax, TAX_PERCENTAGE) -
          numOfNights * 300;
      }
      console.log(amount);

      await refundTripWithStripe({
        paymentIntentId: currentTrip.paymentIntentId!,
        amount: amount,
        metadata: {
          tripId: currentTrip.id,
          propertyId: currentTrip.propertyId,
          groupId: currentTrip.groupId,
          cancellationRefund: currentCancellations.amountRefunded,
          cancellationId: currentCancellations.id,
          description: currentCancellations.reason,
        },
      });
      return;
    }),
  getMyTripsPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    const allPayments = await db.query.trips.findMany({
      where: exists(
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
      with: {
        tripCheckout: true,
        property: {
          columns: {
            name: true,
            city: true,
          },
        },
      },
    });
    return allPayments;
  }),
  getTripCheckoutByTripId: protectedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const tripCheckout = await db.query.trips.findFirst({
        where: eq(trips.id, input),
        columns: { tripCheckoutId: true },
        with: { tripCheckout: true },
      });

      console.log(tripCheckout?.tripCheckout);
      return tripCheckout?.tripCheckout;
    }),
});
