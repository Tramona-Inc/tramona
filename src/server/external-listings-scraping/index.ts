import { sortBy } from "lodash";
import { db } from "../db";
import {
  MinimalRequest,
  NewProperty,
  offers,
  properties,
  tripCheckouts,
} from "../db/schema";
import { getNumNights, getTravelerOfferedPrice } from "@/utils/utils";
import {
  DIRECTLISTINGMARKUP,
  HOST_MARKUP
} from "@/utils/constants";
import { breakdownPayment } from "@/utils/payment-utils/paymentBreakdown";

// maximum discount we want to give, we don't want to go too low
const MAX_DISCOUNT = 0.3;

export type ExternalListingScraper = (
  request: MinimalRequest,
) => Promise<{ property: NewProperty; totalPrice: number }[]>;

const listingScrapers: ExternalListingScraper[] = [];

export async function scrapeExternalListings(request: MinimalRequest) {
  const numNights = getNumNights(request.checkIn, request.checkOut);
  const requstedNightlyPrice = request.maxTotalPrice / numNights;

  const listings = await Promise.all(
    listingScrapers.map((scrapeListings) => scrapeListings(request)),
  )
    .then((r) => r.flat())
    .then((listings) => {
      const filtered = listings.filter(
        (l) => l.totalPrice >= requstedNightlyPrice * (1 - MAX_DISCOUNT),
      );

      return sortBy(filtered, (p) => p.totalPrice);
    })
    .then((listings) => listings.slice(0, 10));

  const propertyIds = await db
    .insert(properties)
    .values(listings.map(({ property }) => property))
    .returning({ id: properties.id })
    .then((res) => res.map((p) => p.id));

  // i know this should be in a transaction but i was in a rush

  await Promise.all(
    listings.map(async ({ totalPrice, property }, index) => {
      const travelerOfferedPriceBeforeFees = getTravelerOfferedPrice({
        propertyPrice: totalPrice,
        travelerMarkup: DIRECTLISTINGMARKUP,
        numNights: getNumNights(request.checkIn, request.checkOut),
      });
      const brokeDownPayment = await breakdownPayment({
        numOfNights: numNights,
        travelerOfferedPriceBeforeFees,
        isScrapedPropery: true,
        lat: property.latLngPoint.y,
        lng: property.latLngPoint.x,
      });

      const tripCheckout = await db
        .insert(tripCheckouts)
        .values({
          totalTripAmount: brokeDownPayment.totalTripAmount,
          travelerOfferedPriceBeforeFees,
          paymentIntentId: "",
          taxesPaid: brokeDownPayment.taxesPaid,
          taxPercentage: brokeDownPayment.taxPercentage,
          superhogFee: brokeDownPayment.superhogFee,
          stripeTransactionFee: brokeDownPayment.stripeTransactionFee,
          checkoutSessionId: "",
          totalSavings: brokeDownPayment.totalSavings,
        })
        .returning({ id: tripCheckouts.id })
        .then((res) => res[0]!);

      await db.insert(offers).values({
        propertyId: propertyIds[index]!,
        requestId: request.id,
        totalPrice,
        checkIn: request.checkIn,
        checkOut: request.checkOut,
        hostPayout: totalPrice * HOST_MARKUP,
        travelerOfferedPriceBeforeFees,
        tripCheckoutId: tripCheckout.id,
      });
    }),
  );

  // await db.insert(offers).values(
  //   listings.map(({ totalPrice }, index) => ({
  //     propertyId: propertyIds[index]!,
  //     requestId: request.id,
  //     totalPrice,
  //     checkIn: request.checkIn,
  //     checkOut: request.checkOut,
  //     hostPayout: totalPrice * HOST_MARKUP,
  //     travelerOfferedPriceBeforeFees: totalPrice * TRAVELER__MARKUP,
  //   })),
  // );
}
