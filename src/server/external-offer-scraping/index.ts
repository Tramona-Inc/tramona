import { ExternalOffer, MinimalRequest } from "../db/schema";
import { airbnbOfferScraper } from "./airbnbOfferScraper";

export type ExternalOfferScraper = (
  request: MinimalRequest,
) => Promise<ExternalOffer[]>;

const offerScrapers: ExternalOfferScraper[] = [airbnbOfferScraper];

export async function scrapeOffers(request: MinimalRequest) {
  const offers = await Promise.all(
    offerScrapers.map((scraper) => scraper(request)),
  );
  return offers.flat();
}
