import { ExternalOffer, Request } from "../db/schema";
import { airbnbOfferScraper } from "./airbnbOfferScraper";

export type ExternalOfferScraper = (
  request: Request,
) => Promise<ExternalOffer[]>;

const offerScrapers: ExternalOfferScraper[] = [airbnbOfferScraper];

export async function scrapeOffers(request: Request) {
  const offers = await Promise.all(
    offerScrapers.map((scraper) => scraper(request)),
  );
  return offers.flat();
}
