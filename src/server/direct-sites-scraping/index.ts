import { NewProperty, Review } from "../db/schema";
import { exampleScraper } from "./example";
import { cbIslandVacationsScraper } from "./hawaii-scraper";

export type DirectSiteScraper = () => Promise<
  (NewProperty & {
    originalListingUrl: string; // enforce that its non-null
    reservedDateRanges: { start: Date; end: Date }[];
    reviews: Review[];
  })[]
>;

export const directSiteScrapers: DirectSiteScraper[] = [
  // add more scrapers here
  exampleScraper,
  cbIslandVacationsScraper,
];
