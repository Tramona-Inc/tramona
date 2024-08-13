import { NewOffer, Request } from "../db/schema";
import { airbnbOfferScraper } from "./airbnbOfferScraper";

export type OfferScraper = (request: Request) => Promise<NewOffer[]>;

const offerScrapers: OfferScraper[] = [airbnbOfferScraper];

export async function scrapeOffers(request: Request) {
  const offers = await Promise.all(
    offerScrapers.map((scraper) => scraper(request)),
  );
  return offers.flat();
}
