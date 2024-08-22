import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { trips, tripCancellations, superhogRequests } from "@/server/db/schema";
import { cancelSuperhogReservation } from "./superhog-utils";
import { formatInterval, getNumNights } from "../utils";
import type { User, Trip, Offer, Property } from "../../server/db/schema";
import { getPriceBreakdown, convertTo24HourFormat } from "../utils";
import { TAX_PERCENTAGE, SUPERHOG_FEE } from "../constants";
import { sendEmail } from "@/server/server-utils";
import { formatDate } from "date-fns";
import ReservationConfirmedEmail from "packages/transactional/emails/ReservationConfirmedEmail";

export async function cancelTripByPaymentIntent({
  paymentIntentId,
  reason,
}: {
  paymentIntentId: string;
  reason: string;
}) {
  const currentTrip = await db
    .update(trips)
    .set({
      tripsStatus: "Cancelled",
    })
    .where(eq(trips.paymentIntentId, paymentIntentId))
    .returning()
    .then((res) => res[0]);

  if (!currentTrip) {
    console.log("TRIP NOT FOUND");
    return;
  }
  //add the reason in the cancellation table
  console.log("ABOUT TO CREATE CANCELLATION");
  await db.insert(tripCancellations).values({
    reason,
    tripId: currentTrip.id,
  });
  console.log("cancellation created");

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
  }
}

export async function sendEmailAndWhatsup({
  trip,
  user,
  offer,
  property,
}: {
  trip: Trip;
  user: User;
  offer: Offer;
  property: Property;
}) {
  //get price breakdown
  console.log("SENDING EMAIL");
  const numOfNights = getNumNights(trip.checkIn, trip.checkOut);

  const { serviceFee } = getPriceBreakdown({
    bookingCost: offer.travelerOfferedPrice,
    numNights: numOfNights,
    superhogFee: SUPERHOG_FEE,
    tax: TAX_PERCENTAGE,
  });
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
      checkInTime: property.checkInTime ?? "12.00 PM",
      checkOutTime: property.checkOutTime ?? "12.00 PM",
      address: property.address,
      propertyImageLink: property.imageUrls[0] ?? property.imageUrls[1] ?? "",
      tripDetailLink: `https://www.tramona.com/offers/${trip.id}`,
      tramonaPrice: offer.travelerOfferedPrice,
      totalPrice: trip.totalPriceAfterFees!,
      numOfNights: numOfNights,
      serviceFee: serviceFee,
      adults: property.maxNumGuests,
    }),
  });
  console.log("EMAIL SENT");
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

  // console.log("PaymentIntent was successful!");
}
