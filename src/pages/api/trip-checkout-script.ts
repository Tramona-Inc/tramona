import { db } from "@/server/db";
import { tripCheckouts, trips, offers, Offer } from "@/server/db/schema";
import { isNull, eq, and } from "drizzle-orm";
import { NextApiResponse } from "next";
import { breakdownPayment } from "@/utils/payment-utils/paymentBreakdown";

// create a script that will allow me to populate the tripscheckout for each offer

console.log("hi");
export default async function populateTripCheckout(res: NextApiResponse) {
  const allOffersWithoutCheckout = await db.query.offers.findMany({
    where: isNull(offers.tripCheckoutId),
  });
  console.log(allOffersWithoutCheckout);

  //now that we got all of the offers
  //im going to create function that takes only one offer at a tume
  await Promise.all(
    allOffersWithoutCheckout.map((offer) => createTripCheckout(offer)),
  );
}

async function createTripCheckout(curOffer: Offer) {
  //for each offer
  const brokeDownPayment = breakdownPayment({
    checkIn: curOffer.checkIn,
    checkOut: curOffer.checkOut,
    travelerOfferedPriceBeforeFees: curOffer.travelerOfferedPriceBeforeFees,
    isScrapedPropery: curOffer.scrapeUrl ? true : false,
    originalPrice: curOffer.datePriceFromAirbnb,
  });

  const insertedTripCheckout = await db
    .insert(tripCheckouts)
    .values({
      totalTripAmount: brokeDownPayment.totalTripAmount,
      travelerOfferedPriceBeforeFees: curOffer.travelerOfferedPriceBeforeFees,
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
  console.log("here is the inserted trip ", insertedTripCheckout);

  await db
    .update(offers)
    .set({
      tripCheckoutId: insertedTripCheckout.id,
    })
    .where(and(eq(offers.id, curOffer.id), isNull(offers.tripCheckoutId)));

  //update any null trips
  await db
    .update(trips)
    .set({
      tripCheckoutId: insertedTripCheckout.id,
    })
    .where(and(eq(trips.offerId, curOffer.id), isNull(trips.tripCheckoutId)));
}
