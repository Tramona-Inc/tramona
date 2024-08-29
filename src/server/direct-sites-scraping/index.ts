import { NewProperty, Review } from "../db/schema";
import { cleanbnbScraper } from "./cleanbnb-scrape";
import { exampleScraper } from "./example";

export type DirectSiteScraper = (options: {
  checkIn: Date;
  checkOut: Date;
}) => Promise<
  (NewProperty & {
    originalListingUrl: string; // enforce that its non-null
    reviews: Review[];
  })[]
>;

export const directSiteScrapers: DirectSiteScraper[] = [
  // add more scrapers here
  cleanbnbScraper,
  exampleScraper,
];
