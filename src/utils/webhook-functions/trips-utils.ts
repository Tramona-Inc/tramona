import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  trips,
  tripCancellations,
  superhogRequests,
  groupMembers,
  groups,
  properties,
  tripCheckouts,
  reservedDateRanges,
} from "@/server/db/schema";

import { cancelSuperhogReservation } from "./superhog-utils";
import { formatDateRange, getNumNights } from "../utils";
import type {
  User,
  Trip,
  Property,
  TripCheckout,
} from "../../server/db/schema";
import { sendEmail } from "@/server/server-utils";
import { formatDate } from "date-fns";
import ReservationConfirmedEmail from "packages/transactional/emails/ReservationConfirmedEmail";
import { stripeWithSecretKey } from "@/server/api/routers/stripeRouter";
import BookingCancellationEmail from "packages/transactional/emails/BookingCancellationEmail";
import { sendSlackMessage } from "@/server/slack";
import { getServiceFee } from "../payment-utils/paymentBreakdown";

export type TripWCheckout = Trip & { tripCheckout: TripCheckout };

export async function cancelTripByPaymentIntent({
  paymentIntentId,
  reason,
}: {
  paymentIntentId: string;
  reason: string;
}) {
  const paymentIntentObject =
    await stripeWithSecretKey.paymentIntents.retrieve(paymentIntentId);

  const currentTrip = await db
    .update(trips)
    .set({
      tripsStatus: "Cancelled",
    })
    .where(eq(trips.paymentIntentId, paymentIntentId))
    .returning({
      id: trips.id,
      superhogRequestId: trips.superhogRequestId,
      groupId: trips.groupId,
      checkIn: trips.checkIn,
      checkOut: trips.checkOut,
      totalPriceAfterFees: trips.totalPriceAfterFees,
      tripCheckout: tripCheckouts,
    })
    .then((res) => res[0]);

  if (!currentTrip) {
    return;
  }
  //add the reason in the cancellation table
  await db
    .insert(tripCancellations)
    .values({
      reason,
      tripId: currentTrip.id,
    })
    .returning();

  if (currentTrip.superhogRequestId) {
    //find and cancel the superhog reservation
    //find verificationId
    const superhogVerificationId = await db.query.superhogRequests.findFirst({
      columns: { superhogVerificationId: true },
      where: eq(superhogRequests.id, currentTrip.superhogRequestId),
    });

    await cancelSuperhogReservation({
      verificationId: superhogVerificationId!.superhogVerificationId,
      reservationId: currentTrip.id.toString(),
    });

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
      where: eq(
        properties.id,
        parseInt(paymentIntentObject.metadata.property_id!),
      ),
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
          reason: reason,
          refund: currentTrip.totalPriceAfterFees,
        }),
      });
    }
  }
}

export async function sendEmailAndWhatsupConfirmation({
  trip,
  user,
  property,
}: {
  trip: TripWCheckout;
  user: User;
  property: Property;
}) {
  //get price breakdown
  console.log("SENDING EMAIL");
  const numOfNights = getNumNights(trip.checkIn, trip.checkOut);

  const serviceFee = getServiceFee({ tripCheckout: trip.tripCheckout });
  //send BookingConfirmationEmail

  const checkInDate = trip.checkIn.toString();
  const checkOutDate = trip.checkOut.toString();

  await sendEmail({
    to: user.email,
    subject: `Tramona Booking Confirmation ${property.name}`,
    content: ReservationConfirmedEmail({
      userName: user.firstName ?? user.name!,
      propertyName: property.name,
      hostName: property.hostName ?? "",
      //hostImageUrl: property.hostImageUrl ?? "",
      checkInDate: formatDate(checkInDate, "MM/dd/yyyy"),
      checkOutDate: formatDate(checkOutDate, "MM/dd/yyyy"),
      checkInTime: property.checkInTime,
      checkOutTime: property.checkOutTime,
      address: property.address,
      propertyImageLink: property.imageUrls[0] ?? property.imageUrls[1] ?? "",
      tripDetailLink: `https://www.tramona.com/offers/${trip.id}`,
      tramonaPrice: trip.tripCheckout.calculatedTravelerPrice,
      totalPrice: trip.tripCheckout.totalTripAmount,
      numOfNights: numOfNights,
      serviceFee: serviceFee,
      adults: property.maxNumGuests,
    }),
  });

  // const twilioMutation = api.twilio.sendSMS.useMutation();
  // const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();

  // if (user?.isWhatsApp) {
  //   await twilioWhatsAppMutation.mutateAsync({
  //     templateId: "HXb0989d91e9e67396e9a508519e19a46c",
  //     to: paymentIntentSucceeded.metadata.phoneNumber!,
  //   });
  // } else {
  //   await twilioMutation.mutateAsync({
  //     to: paymentIntentSucceeded.metadata.phoneNumber!,
  //     msg: "Your Tramona booking is confirmed! Please see the My Trips page to access your trip information!",
  //   });
  // }
}

export async function captureTripPaymentWithoutSuperhog({
  paymentIntentId,
  propertyId,
  trip,
}: {
  paymentIntentId: string;
  propertyId: number;
  trip: Trip;
}) {
  const intent =
    await stripeWithSecretKey.paymentIntents.capture(paymentIntentId); //will capture the authorized amount by default
  // Update trips table
  await db
    .update(trips)
    .set({ paymentCaptured: new Date() })
    .where(eq(trips.id, trip.id));

  await sendSlackMessage({
    isProductionOnly: true,
    channel: "tramona-bot",
    text: [
      `Direct Booking Trip success: TRIP ID  ${trip.id} was created successfully for property ${propertyId}`,
    ].join("\n"),
  });
  return intent;
}

export async function updateICalAfterBookingTrip(
  currentTripWCheckout: TripWCheckout,
) {
  console.log("Updating Ical");
  await db.insert(reservedDateRanges).values({
    start: currentTripWCheckout.checkIn.toISOString(),
    end: currentTripWCheckout.checkOut.toISOString(),
    platformBookedOn: "tramona",
    propertyId: currentTripWCheckout.propertyId,
  });

  await db
    .update(properties)
    .set({
      datesLastUpdated: new Date(),
    })
    .where(eq(properties.id, currentTripWCheckout.propertyId));
  return;
}
