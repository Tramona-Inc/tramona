import { NewProperty, Review } from "../db/schema";
import { exampleScraper } from "./example";

export type DirectSiteScraper = (options: {
  checkIn?: Date;
  checkOut?: Date;
}) => Promise<
  (NewProperty & {
    originalListingUrl: string; // enforce that its non-null
    reservedDateRanges: { start: Date; end: Date }[];
    reviews: Review[];
  })[]
>;

export const directSiteScrapers: DirectSiteScraper[] = [
  // add more scrapers here
  exampleScraper,
];
