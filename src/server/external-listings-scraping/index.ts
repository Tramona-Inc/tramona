import { sortBy } from "lodash";
import { db } from "../db";
import { MinimalRequest, NewProperty, offers, properties } from "../db/schema";
import { getNumNights } from "@/utils/utils";
import { HOST_MARKUP, TRAVELER__MARKUP } from "@/utils/constants";

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

  await db.insert(offers).values(
    listings.map(({ totalPrice }, index) => ({
      propertyId: propertyIds[index]!,
      requestId: request.id,
      totalPrice,
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      hostPayout: totalPrice * HOST_MARKUP,
      travelerOfferedPrice: totalPrice * TRAVELER__MARKUP,
    })),
  );
}
