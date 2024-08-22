import { db } from "../db";
import { NewProperty, Review } from "../db/schema";
import { exampleScraper } from "./example";
import { cbIslandVacationsScraper } from "./hawaii-scraper";
import { properties } from "../db/schema";
import { eq } from 'drizzle-orm'; // Make sure to import this if you're using Drizzle ORM

export type DirectSiteScraper = (options: {
  checkIn?: Date;
  checkOut?: Date;
}) => Promise<
  (NewProperty & {
    originalListingUrl: string;
    reservedDateRanges: { start: Date; end: Date }[];
    reviews: Review[];
  })[]
>;

export const directSiteScrapers: DirectSiteScraper[] = [
  exampleScraper,
  cbIslandVacationsScraper,
];

export async function scrapeDirectListings() {
  console.log("Starting scrapeDirectListings function");
  try {
    const scrapedListings = await Promise.all(
      directSiteScrapers.map(async (scraper, index) => {
        console.log(`Starting scraper ${index + 1}`);
        try {
          const results = await scraper();
          console.log(`Scraper ${index + 1} completed, found ${results.length} listings`);
          return results;
        } catch (error) {
          console.error(`Error in scraper ${index + 1}:`, error);
          return [];
        }
      })
    );

    const allListings = scrapedListings.flat();
    console.log(`Total listings scraped: ${allListings.length}`);

    if (allListings.length > 0) {
      await db.transaction(async (tx) => {
        // Delete existing properties with original_listing_platform as "CB Island Vacations"
        console.log('Deleting existing CB Island Vacations properties');
        await tx.delete(properties).where(eq(properties.originalListingPlatform, "CB Island Vacations"));

        // Insert new properties
        console.log('Inserting new listings into database');
        await tx.insert(properties).values(allListings);
      });

      console.log('Old CB Island Vacations properties deleted and new listings inserted successfully');
    } else {
      console.log('No listings to insert');
    }

    return allListings;
  } catch (error) {
    console.error("Error in scrapeDirectListings:", error);
    throw error;
  }
}