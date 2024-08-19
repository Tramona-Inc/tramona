import { NewProperty } from "../db/schema";
import { exampleScraper } from "./example";

export type DirectSiteScraper = () => Promise<
  (NewProperty & {
    originalListingUrl: string; // enforce that its non-null
    reservedDateRanges: { start: Date; end: Date }[];
  })[]
>;

export const directSiteScrapers: DirectSiteScraper[] = [
  // add more scrapers here
  exampleScraper,
];
