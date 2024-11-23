import { env } from "@/env";
import { db } from "@/server/db";
import {
  groupMembers,
  groups,
  hostTeamMembers,
  properties,
  requestsToBook,
  offers,
  trips,
  users,
  tripCheckouts,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { breakdownPaymentByPropertyAndTripParams } from "../payment-utils/paymentBreakdown";
import {
  captureTripPaymentWithoutSuperhog,
  sendEmailAndWhatsupConfirmation,
  TripWCheckout,
} from "./trips-utils";
import { createSuperhogReservation } from "./superhog-utils";

import { sendSlackMessage } from "@/server/slack";
import { formatDateMonthDay } from "../utils";
import { TRAVELER_MARKUP } from "../constants";

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
  travelerPriceBeforeFees,
  checkIn,
  checkOut,
  propertyId,
  userId,
  isDirectListingCharge,
  source,
}: {
  paymentIntentId: string;
  travelerPriceBeforeFees: number;
  numOfGuests: number;
  checkIn: Date;
  checkOut: Date;
  propertyId: number;
  userId: string;
  isDirectListingCharge: boolean;
  source: "Book it now" | "Request to book";
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
    travelerPriceBeforeFees: travelerPriceBeforeFees,
    property: property,
  };

  const priceBreakdown = breakdownPaymentByPropertyAndTripParams(params);
  // 2. Using breakdown create a tripCheckout and trip

  const tripCheckout = await db
    .insert(tripCheckouts)
    .values({
      paymentIntentId,
      travelerOfferedPriceBeforeFees: travelerPriceBeforeFees,
      totalTripAmount: priceBreakdown.totalTripAmount,
      taxesPaid: priceBreakdown.taxesPaid,
      superhogFee: priceBreakdown.superhogFee,
      stripeTransactionFee: priceBreakdown.stripeTransactionFee,
      totalSavings: priceBreakdown.totalSavings,
      securityDeposit: property.currentSecurityDeposit,
    })
    .returning()
    .then((r) => r[0]!);

  const currentTrip = await db
    .insert(trips)
    .values({
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
    await createSuperhogReservation({
      paymentIntentId,
      propertyId: property.id,
      userId: userId,
      trip: currentTrip,
    }); //creating a superhog reservation
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
  await sendSlackMessage({
    isProductionOnly: true,
    channel: "tramona-bot",
    text: [
      `*${user.email} just booked a trip: ${property.name}*`,
      `*${property.city}*`,
      `through ${isDirectListingCharge ? "a different platform (direct listing)" : "Tramona"} · ${formatDateMonthDay(checkIn)}-${formatDateMonthDay(checkOut)}`,
      `<https://tramona.com/admin|Go to admin dashboard>`,
    ].join("\n"),
  });
}

export async function createRequestToBook({
  paymentIntentId,
  numOfGuests,
  travelerPriceBeforeFees,
  checkIn,
  checkOut,
  propertyId,
  userId,
  isDirectListingCharge,
}: {
  paymentIntentId: string;
  travelerPriceBeforeFees: number;
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
    amountAfterTravelerMarkupAndBeforeFees: Math.floor(
      travelerPriceBeforeFees * TRAVELER_MARKUP,
    ), //we add markup here
    isDirectListing: isDirectListingCharge,
  });

  //    ------2 CASES: 1.)no direct listing so send to the host 2.) isDirectLIsting send message to us

  // Case 1 : DIRECT LISTING. SEND SLACK
  if (isDirectListingCharge) {
    await sendSlackMessage({
      isProductionOnly: true,
      channel: "tramona-bot",
      text: [
        `*${user.email} just requested to book: ${property.name}*`,
        `*${property.city}*`,
        `through ${"a different platform (direct listing)"} · ${formatDateMonthDay(checkIn)}-${formatDateMonthDay(checkOut)}`,
        `<https://tramona.com/admin|Go to admin dashboard>`,
      ].join("\n"),
    });
  } else {
    // Case 2: Not DirectListing so we need to send the request to the host
    const members = await db.query.hostTeamMembers.findMany({
      where: eq(hostTeamMembers.hostTeamId, properties.hostTeamId),
    });

    for (const member of members) {
      console.log(member.userId); //send notifcation to host??
    }

    await sendSlackMessage({
      isProductionOnly: true,
      channel: "tramona-bot",
      text: [
        `*${user.email} just requested to book: ${property.name}*`,
        `*${property.city}*`,
        `through one of our properties· ${formatDateMonthDay(checkIn)}-${formatDateMonthDay(checkOut)}`,
        `<https://tramona.com/admin|Go to admin dashboard>`,
      ].join("\n"),
    });
  }
  return;
}
