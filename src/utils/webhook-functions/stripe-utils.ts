import { env } from "@/env";
import { db } from "@/server/db";
import { and, eq, or, sql } from "drizzle-orm";
import {
  groupMembers,
  groups,
  properties,
  requestsToBook,
  offers,
  trips,
  users,
  tripCheckouts,
} from "@/server/db/schema";
import Stripe from "stripe";
import { breakdownPaymentByPropertyAndTripParams } from "../payment-utils/paymentBreakdown";
import {
  captureTripPaymentWithoutSuperhog,
  sendEmailAndWhatsupConfirmation,
  TripWCheckout,
  updateICalAfterBookingTrip,
} from "./trips-utils";
import { createSuperhogReservation } from "./superhog-utils";

import { sendSlackMessage } from "@/server/slack";
import { formatDateMonthDay, removeTravelerMarkup } from "../utils";
import { sendText } from "@/server/server-utils";
import { sendTextToHostTeamMembers } from "@/server/server-utils";

export const stripe = new Stripe(env.STRIPE_RESTRICTED_KEY_ALL);
const stripeWithSecretKey = new Stripe(env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export async function createSetupIntent({
  customerId,
  paymentMethodId,
  userId,
}: {
  customerId: string;
  paymentMethodId: string;
  userId: string;
}) {
  //now we need to update the customer account with the attached payment method
  await stripeWithSecretKey.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  //first we need to create the setup Inten using information from the booking

  const setupIntent = await stripeWithSecretKey.setupIntents.create({
    customer: customerId,
    payment_method: paymentMethodId,
    metadata: {
      user_id: userId,
    },
  });

  //now we need to update DB to  the setUptIntent to be used for future payments
  await db
    .update(users)
    .set({
      setupIntentId: setupIntent.id,
    })
    .where(eq(users.id, userId));
}

export async function chargeForDamagesOrMisc({
  amount,
  customerId,
  paymentMethodId,
  description,
  currency = "usd",
}: {
  amount: number;
  customerId: string;
  paymentMethodId: string;
  description: string;
  currency?: string;
}) {
  try {
    const paymentIntent = await stripeWithSecretKey.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true, // Tries to confirm immediately
      description,
    });

    // Check the status of the PaymentIntent
    if (paymentIntent.status === "succeeded") {
      console.log("Charge successful:", paymentIntent);
      return paymentIntent; // Payment was completed successfully
    } else if (
      paymentIntent.status === "requires_action" ||
      paymentIntent.status === "requires_confirmation"
    ) {
      console.log("Additional action required for:", paymentIntent);
      // You need to handle the additional action on the client side
      return paymentIntent;
    } else {
      console.error("PaymentIntent status:", paymentIntent.status);
      throw new Error("Failed to complete the charge.");
    }
  } catch (error) {
    console.error("Charge error:", error);
    throw error;
  }
}

//helper functions in stripe webhook
export async function getRequestIdByOfferId(
  offerId: string | number | undefined,
) {
  if (!offerId) return null;

  if (typeof offerId === "string") {
    offerId = parseInt(offerId, 10);
  }
  const curRequest = await db
    .select({ id: offers.requestId })
    .from(offers)
    .where(eq(offers.id, offerId))
    .then((res) => res[0]!);

  return curRequest.id ? curRequest.id : null;
}

export async function finalizeTrip({
  paymentIntentId,
  numOfGuests,
  calculatedTravelerPrice,
  additionalFeesFromWebhook,
  checkIn,
  checkOut,
  propertyId,
  userId,
  isDirectListingCharge,
  source,
  requestToBookId, // AKA REQUEST TO BID ID
}: {
  paymentIntentId: string;
  calculatedTravelerPrice: number;
  additionalFeesFromWebhook: number;
  numOfGuests: number;
  checkIn: Date;
  checkOut: Date;
  propertyId: number;
  userId: string;
  isDirectListingCharge: boolean;
  source: "Book it now" | "Request to book";
  requestToBookId?: number;
}) {
  //1.) create  groupId
  const madeByGroupId = await db
    .insert(groups)
    .values({ ownerId: userId })
    .returning()
    .then((res) => res[0]!.id);

  await db.insert(groupMembers).values({
    userId: userId,
    groupId: madeByGroupId,
  });

  //1.get user for setup
  const user = await db.query.users
    .findFirst({
      where: eq(users.id, userId),
    })
    .then((res) => res!);

  // 2.) create params for breakdown
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId),
    with: {
      hostTeam: {
        with: {
          owner: {
            columns: {
              image: true,
              firstName: true,
              lastName: true,
              email: true,
              id: true,
              about: true,
              location: true,
            },
            // with: {
            //   hostProfile: {
            //     columns: { curTeamId: true },
            //   },
            // },
          },
        },
      },
      reviews: true,
    },
  });
  if (!property) throw new Error("no property");

  const params = {
    dates: {
      checkIn: checkIn,
      checkOut: checkOut,
    },
    calculatedTravelerPrice: calculatedTravelerPrice,
    property: property,
  };

  const priceBreakdown = breakdownPaymentByPropertyAndTripParams(params);
  // 2. Using breakdown create a tripCheckout and trip

  const tripCheckout = await db
    .insert(tripCheckouts)
    .values({
      paymentIntentId,
      calculatedTravelerPrice: calculatedTravelerPrice,
      totalTripAmount: priceBreakdown.totalTripAmount,
      taxesPaid: priceBreakdown.taxesPaid,
      superhogFee: priceBreakdown.superhogFee,
      stripeTransactionFee: priceBreakdown.stripeTransactionFee,
      totalSavings: priceBreakdown.totalSavings,
      additionalFees: additionalFeesFromWebhook, // we need data from webhook just incase the host changes price between bid creatation and accepting it
      securityDeposit: property.currentSecurityDeposit,
    })
    .returning()
    .then((r) => r[0]!);

  console.log();
  const currentTrip = await db
    .insert(trips)
    .values({
      ...(requestToBookId && { requestToBookId: requestToBookId }),
      checkIn: checkIn,
      checkOut: checkOut,
      numGuests: numOfGuests,
      groupId: madeByGroupId,
      tripSource: source,
      propertyId: property.id,
      paymentIntentId,
      totalPriceAfterFees: priceBreakdown.totalTripAmount,
      tripCheckoutId: tripCheckout.id,
    })
    .returning()
    .then((res) => res[0]!);

  const currentTripWCheckout: TripWCheckout = {
    ...currentTrip,
    tripCheckout,
  };

  //create superhog request
  //<___creating a superhog  oreservationnly if does not exist__>

  if (!currentTrip.superhogRequestId && !isDirectListingCharge) {
    //1. create superhog, and update ICAL
    await createSuperhogReservation({
      paymentIntentId,
      propertyId: property.id,
      userId: userId,
      trip: currentTrip,
    }); //creating a superhog reservation

    await updateICalAfterBookingTrip(currentTripWCheckout);
  } else {
    if (isDirectListingCharge) {
      await captureTripPaymentWithoutSuperhog({
        paymentIntentId,
        propertyId: property.id,
        trip: currentTrip,
      });
    } else {
      console.log("Superhog reservation already exists");
    }
  }
  //<<--------------------->>

  //send email and whatsup (whatsup is not implemented yet)
  console.log("Sending email and whatsup");
  await sendEmailAndWhatsupConfirmation({
    trip: currentTripWCheckout,
    user: user,
    property: property,
  });
  // //redeem the traveler and host refferal code
  // if (user?.referralCodeUsed) {
  //   await completeReferral({ user: user, offerId: offer.id });
  // }
  // //validate the host discount referral
  // if (currentProperty?.hostTeam.ownerId) {
  //   await validateHostDiscountReferral({
  //     hostUserId: currentProperty.hostTeam.ownerId,
  //   });
  // }
  // if (paymentIntentSucceeded.metadata.user_id) {
  //   await createConversationWithOfferAfterBooking({
  //     offerId: offer.id.toString(),
  //     offerHostId: currentProperty!.hostTeam.ownerId,
  //     offerPropertyName: currentProperty!.name,
  //     travelerId: paymentIntentSucceeded.metadata.user_id,
  //   });
  // }
  // ------ Send Slack When trip is booked ------
  await withdrawOverlappingOffersAndRequestsToBook({
    propertyId: property.id,
    checkIn,
    checkOut,
  });
  await sendSlackMessage({
    isProductionOnly: false,
    channel: "tramona-bot",
    text: [
      `*${user.email} just booked a trip: ${property.name}*`,
      `*${property.city}*`,
      `through ${isDirectListingCharge ? "a different platform (direct listing)" : "Tramona"} · ${formatDateMonthDay(checkIn)}-${formatDateMonthDay(checkOut)}`,
      `<https://tramona.com/admin|Go to admin dashboard>`,
    ].join("\n"),
  });

  if (source === "Book it now") {
    //send that there is a new booking to the host TODO
    await sendTextToHostTeamMembers({
      hostTeamId: property.hostTeamId,
      message: `${user.email} just booked your property`,
    });
  } else {
    //send text to traveler
    await sendText({
      to: user.phoneNumber!,
      content: `Your request to book ${property.name} has been accepted by the host. You're going to ${property.city} from ${formatDateMonthDay(checkIn)} to ${formatDateMonthDay(checkOut)}!`,
    });
  }
}

export async function createRequestToBook({
  paymentIntentId,
  numOfGuests,
  calculatedTravelerPrice,
  additionalFeesFromWebhook,
  checkIn,
  checkOut,
  propertyId,
  userId,
  isDirectListingCharge,
}: {
  paymentIntentId: string;
  calculatedTravelerPrice: number;
  additionalFeesFromWebhook: number;
  numOfGuests: number;
  checkIn: Date;
  checkOut: Date;
  propertyId: number;
  userId: string;
  isDirectListingCharge: boolean;
}) {
  const user = await db.query.users
    .findFirst({
      where: eq(users.id, userId),
    })
    .then((res) => res!);

  const property = await db.query.properties
    .findFirst({
      where: eq(properties.id, propertyId),
    })
    .then((res) => res!);

  //create group
  const madeByGroupId = await db
    .insert(groups)
    .values({ ownerId: userId })
    .returning()
    .then((res) => res[0]!.id);

  await db.insert(groupMembers).values({
    userId: userId,
    groupId: madeByGroupId,
  });

  console.log(
    calculatedTravelerPrice,
    removeTravelerMarkup(calculatedTravelerPrice),
  );
  await db.insert(requestsToBook).values({
    hostTeamId: property.hostTeamId,
    createdAt: new Date(),
    propertyId,
    userId: userId,
    madeByGroupId: madeByGroupId,
    paymentIntentId,
    checkIn,
    checkOut,
    numGuests: numOfGuests,
    calculatedBasePrice: removeTravelerMarkup(calculatedTravelerPrice),
    calculatedTravelerPrice: Math.floor(calculatedTravelerPrice),
    additionalFees: additionalFeesFromWebhook,
    isDirectListing: isDirectListingCharge,
  });

  //    ------2 CASES: 1.)no direct listing so send to the host 2.) isDirectLIsting send message to us

  // Case 1 : DIRECT LISTING. SEND SLACK
  if (isDirectListingCharge) {
    await sendSlackMessage({
      isProductionOnly: true,
      channel: "tramona-bot",
      text: [
        `*${user.firstName} just requested to book: ${property.name}*`,
        `*${property.city}*`,
        `through ${"a different platform (direct listing)"} · ${formatDateMonthDay(checkIn)}-${formatDateMonthDay(checkOut)}`,
        `<https://tramona.com/admin|Go to admin dashboard>`,
      ].join("\n"),
    });
  } else {
    // Case 2: Not DirectListing so we need to send the request to the host
    await sendTextToHostTeamMembers({
      hostTeamId: property.hostTeamId,
      message: `${user.firstName} just requested to book your property`,
    });

    await sendSlackMessage({
      isProductionOnly: true,
      channel: "tramona-bot",
      text: [
        `*${user.firstName} just requested to book: ${property.name}*`,
        `*${property.city}*`,
        `through one of our properties· ${formatDateMonthDay(checkIn)}-${formatDateMonthDay(checkOut)}`,
        `<https://tramona.com/admin|Go to admin dashboard>`,
      ].join("\n"),
    });
  }
  return;
}

export async function withdrawOverlappingOffersAndRequestsToBook({
  propertyId,
  checkIn,
  checkOut,
  excludeOfferId,
}: {
  propertyId: number;
  checkIn: Date;
  checkOut: Date;
  excludeOfferId?: number;
}) {
  // find pending offers for this property that overlap with the date range of accepted offer/book it now
  // an offer overlaps if:
  // 1. check-in date falls between the booked check-in and check-out dates
  // 2. check-out date falls between the booked check-in and check-out dates
  // 3. dates completely encompasses the booked dates
  const checkInStr = checkIn.toISOString();
  const checkOutStr = checkOut.toISOString();

  const overlappingRequestsToBookQuery = db
    .update(requestsToBook)
    .set({
      status: "Withdrawn",
    })
    .where(
      and(
        eq(requestsToBook.propertyId, propertyId),
        eq(requestsToBook.status, "Pending"),
        or(
          and(
            sql`${requestsToBook.checkIn}::date >= ${checkInStr}::date`,
            sql`${requestsToBook.checkIn}::date < ${checkOutStr}::date`,
          ),
          and(
            sql`${requestsToBook.checkOut}::date > ${checkInStr}::date`,
            sql`${requestsToBook.checkOut}::date <= ${checkOutStr}::date`,
          ),
          and(
            sql`${requestsToBook.checkIn}::date <= ${checkInStr}::date`,
            sql`${requestsToBook.checkOut}::date >= ${checkOutStr}::date`,
          ),
        ),
      ),
    );

  const overlappingOffersQuery = db
    .update(offers)
    .set({
      status: "Withdrawn",
    })
    .where(
      and(
        eq(offers.propertyId, propertyId),
        eq(offers.status, "Pending"),
        excludeOfferId ? sql`${offers.id} != ${excludeOfferId}` : undefined,
        or(
          // if offer check-in falls within booked period
          and(
            sql`${offers.checkIn}::date >= ${checkInStr}::date`,
            sql`${offers.checkIn}::date < ${checkOutStr}::date`,
          ),
          // if offer check-out falls within booked period
          and(
            sql`${offers.checkOut}::date > ${checkInStr}::date`,
            sql`${offers.checkOut}::date <= ${checkOutStr}::date`,
          ),
          // if offer completely overlaps booked period
          and(
            sql`${offers.checkIn}::date <= ${checkInStr}::date`,
            sql`${offers.checkOut}::date >= ${checkOutStr}::date`,
          ),
        ),
      ),
    )
    .returning();

  const rejectedOffers = await overlappingOffersQuery;
  const rejectedRequestsToBook = await overlappingRequestsToBookQuery;
  return { rejectedOffers, rejectedRequestsToBook };
}
