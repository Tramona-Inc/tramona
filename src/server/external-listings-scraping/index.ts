import { sortBy } from "lodash";
import { db } from "../db";
import {
  ExternalListing,
  externalListings,
  MinimalRequest,
} from "../db/schema";
import { scrapeAirbnbListings } from "./scrapeAirbnbListings";
import { getNumNights } from "@/utils/utils";

export type ExternalListingScraper = (
  request: MinimalRequest,
) => Promise<ExternalListing[]>;

const listingScrapers: ExternalListingScraper[] = [scrapeAirbnbListings];

/**
 * Scrapes external listings for a request so travelers can see what kind of prices
 * are already out there -- but they won't be booking these properties, hence the new
 * ExternalListing type/table
 */
export async function scrapeExternalListings(request: MinimalRequest) {
  const numNights = getNumNights(request.checkIn, request.checkOut);
  const requstedNightlyPrice = request.maxTotalPrice / numNights;

  const listings = await Promise.all(
    listingScrapers.map((scrapeListings) => scrapeListings(request)),
  )
    .then((r) => r.flat())
    .then((listings) =>
      sortBy(listings, (l) => Math.abs(l.nightlyPrice - requstedNightlyPrice)),
    )
    .then((listings) => listings.slice(0, 10));

  await db
    .insert(externalListings)
    .values(listings.map((l) => ({ ...l, requestId: request.id })));
}
