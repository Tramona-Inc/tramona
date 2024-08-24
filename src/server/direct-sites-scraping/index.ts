import { NewOffer, NewProperty, offers, Review, reviews } from "../db/schema";
import { cleanbnbScraper } from "./cleanbnb-scrape";
import { arizonaScraper } from "./integrity-arizona";
import { db } from "../db";
import { properties } from "../db/schema";
import { eq, and } from 'drizzle-orm';
import { PropertyType, ALL_PROPERTY_TYPES, ListingSiteName } from "@/server/db/schema/common";
import { tr } from "date-fns/locale";

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
      // for each listing, insert the property and reviews OR update them if they already exist
      // then create offers if the offers don't exist
      for (const listing of listings) {
        if(!listing.originalListingId) {continue;}
        const existingOriginalPropertyIdList = await trx.select({id: properties.originalListingId})
          .from(properties)
          .where(eq(properties.originalListingId, listing.originalListingId));
        const existingOriginalPropertyId = existingOriginalPropertyIdList[0]?.id;

        const newPropertyListing = filterNewPropertyFields(listing);
        if (existingOriginalPropertyId) {
            const tramonaProperty = await trx.update(properties)
              .set({ ...newPropertyListing }) // Only keeps fields that are defined in the NewProperty schema
              .where(eq(properties.originalListingId, existingOriginalPropertyId))
              .returning({ id: properties.id });

          const tramonaPropertyId = tramonaProperty[0]?.id;
          if (tramonaPropertyId) {
            if(listing.reviews.length > 0){
              await trx.delete(reviews).where(eq(reviews.propertyId, tramonaPropertyId));
              await trx.insert(reviews).values(listing.reviews.map((review) => ({
                ...review,
                propertyId: tramonaPropertyId,
              })));
            }

            const existingOffers = await trx.select({id: offers.id})
                .from(offers)
                .where(and(
                  eq(offers.propertyId, tramonaPropertyId),
                  eq(offers.checkIn, listing.reservedDateRanges[0]!.start),
                  eq(offers.checkOut, listing.reservedDateRanges[0]!.end)
                ))
              if(existingOffers[0]){
                console.log("existingOffer, offerId: ", existingOffers[0]?.id);
              }
            if(!existingOffers[0]?.id){
              const newOffer: NewOffer = {
                propertyId: tramonaPropertyId,
                checkIn: listing.reservedDateRanges[0]!.start,// or use options.checkIn
                checkOut: listing.reservedDateRanges[0]!.end,// or use options.checkOut
                totalPrice: listing.originalTotalPrice,
                hostPayout: listing.originalTotalPrice,
                travelerOfferedPrice: listing.originalTotalPrice,
              };
              const newOfferId = await trx.insert(offers).values(newOffer).returning({id: offers.id}) 
              console.log("newOfferIdReturned: ", newOfferId);
            }
          }
        } else {
          const tramonaProperty = await trx.insert(properties).values(newPropertyListing).returning({id: properties.id});
          
          const newPropertyId = tramonaProperty[0]?.id;
          if(newPropertyId){
            if(listing.reviews.length > 0){
              await trx.insert(reviews).values(listing.reviews.map((review) => ({
                ...review,
                propertyId: newPropertyId,
              })));
            }

            const existingOffers = await trx.select({id: offers.id})
                .from(offers)
                .where(and(
                  eq(offers.propertyId, newPropertyId),
                  eq(offers.checkIn, listing.reservedDateRanges[0]!.start),
                  eq(offers.checkOut, listing.reservedDateRanges[0]!.end)
                ))
            if(existingOffers[0]){
              console.log("existingOffer, offerId: ", existingOffers[0]?.id);
            }
            if(!existingOffers[0]?.id){
              const newOffer: NewOffer = {
                propertyId: newPropertyId,
                checkIn: listing.reservedDateRanges[0]!.start,// or use options.checkIn
                checkOut: listing.reservedDateRanges[0]!.end,// or use options.checkOut
                totalPrice: listing.originalTotalPrice,
                hostPayout: listing.originalTotalPrice,
                travelerOfferedPrice: listing.originalTotalPrice,
              };
              const newOfferId = await trx.insert(offers).values(newOffer).returning({id: offers.id}) 
              console.log("newOfferIdReturned: ", newOfferId);
            }
          }
        }
      }
    });
  }

  return listings;
};