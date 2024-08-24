import { NewProperty, Review } from "../db/schema";
import { cleanbnbScraper } from "./cleanbnb-scrape";
import { arizonaScraper } from "./integrity-arizona";
import { db } from "../db";
import { properties } from "../db/schema";
import { eq } from 'drizzle-orm';
import { PropertyType, ALL_PROPERTY_TYPES, ListingSiteName } from "@/server/db/schema/common";

export type DirectSiteScraper = (options: {
  checkIn: Date;
  checkOut: Date;
}) => Promise<
  ScrapedListing[]
>;

type ScrapedListing = 
  (NewProperty & {
    originalListingUrl: string; // enforce that its non-null
    reviews: Review[];
  });

export const directSiteScrapers: DirectSiteScraper[] = [
  // add more scrapers here
  cleanbnbScraper,
  arizonaScraper,
];


// Helper function to filter out fields not in NewProperty
const filterNewPropertyFields = (listing: ScrapedListing): NewProperty => {
  const newPropertyKeys = Object.keys(properties).filter(key => key !== 'id');
  return Object.fromEntries(
    Object.entries(listing).filter(([key]) => newPropertyKeys.includes(key))
  ) as NewProperty;
};

// handle the scraped properties and reviews
export const scrapeDirectListings = async (options: {
  checkIn: Date;
  checkOut: Date;
}) => {
  const allListings = await Promise.all(
    directSiteScrapers.map((scraper) => scraper(options)),
  );
  const listings = allListings.flat();
  if (listings.length > 0) {
    await db.transaction(async (trx) => {
      // for each listing, insert or update the property, and insert the reviews
      for (const listing of listings) {
        if(!listing.originalListingId) {continue;}
        const existingPropertyIdList = await trx.select({id: properties.originalListingId})
          .from(properties)
          .where(eq(properties.originalListingId, listing.originalListingId));
        const existingPropertyId = existingPropertyIdList[0]?.id;

        const newPropertyListing = filterNewPropertyFields(listing);
        let tramonaPropertyId = null;
        if (existingPropertyId) {
          await trx.update(properties)
          .set({ ...newPropertyListing }) // Only keeps fields that are defined in the NewProperty schema
          .where(eq(properties.originalListingId, existingPropertyId)) 
        } else {
          tramonaPropertyId = await trx.insert(properties).values(newPropertyListing).returning({id: properties.id});
          console.log('Inserted new property with id:', tramonaPropertyId);
        }
      }
    });
  }

  return listings;
};