import { db } from "../db";
import {
  ExternalListing,
  externalListings,
  MinimalRequest,
} from "../db/schema";
import { scrapeAirbnbListings } from "./scrapeAirbnbListings";

export type ExternalListingScraper = (
  request: MinimalRequest,
) => Promise<ExternalListing[]>;

const listingScrapers: ExternalListingScraper[] = [scrapeAirbnbListings];

export async function scrapeListings(request: MinimalRequest) {
  const scrapedListings = await Promise.all(
    listingScrapers.map((scrapeListings) => scrapeListings(request)),
  ).then((r) => r.flat());

  await db
    .insert(externalListings)
    .values(scrapedListings.map((o) => ({ ...o, requestId: request.id })));
}
