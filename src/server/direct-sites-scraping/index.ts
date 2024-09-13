import { db } from "../db";
import { exampleScraper } from "./example";
import {
  evolveVacationRentalScraper,
  evolveVacationRentalSubScraper,
} from "./evolve-scraper";
import {
  cbIslandVacationsScraper,
  cbIslandVacationsSubScraper,
} from "./hawaii-scraper";
import { casamundoScraper, casamundoSubScraper } from "./casamundo-scraper";
import { properties } from "../db/schema";
import {
  NewOffer,
  NewProperty,
  Offer,
  offers,
  NewReview,
  reviews,
} from "../db/schema";
import { arizonaScraper, arizonaSubScraper } from "./integrity-arizona";

import { getCoordinates } from "../google-maps";
import { eq, and, sql } from "drizzle-orm";
import {
  createRandomMarkupEightToFourteenPercent,
  getNumNights,
} from "@/utils/utils";
import { DIRECTLISTINGMARKUP } from "@/utils/constants";
import { createLatLngGISPoint, haversineDistance } from "@/server/server-utils";
import { cleanbnbScraper, cleanbnbSubScraper } from "./cleanbnb-scrape";

export type DirectSiteScraper = (options: {
  checkIn: Date;
  checkOut: Date;
  requestNightlyPrice?: number; // when the scraper is used by traveler request page
  requestId?: number; // when the scraper is used by traveler request page
  location?: string;
  numGuests?: number;
}) => Promise<ScrapedListing[]>;

export type ScrapedListing = Omit<NewProperty, 'latLngPoint'> & {
  originalListingUrl: string; // enforce that it's non-null
  reviews: NewReview[];
  scrapeUrl: string;
  latLngPoint?: { lat: number; lng: number }; // make latLngPoint optional
};

export type SubsequentScraper = (options: {
  originalListingId: string; // all input params are from offers and properties table
  scrapeUrl: string;
  checkIn: Date;
  checkOut: Date;
}) => Promise<SubScrapedResult>;

export type SubScrapedResult = ({
  originalNightlyPrice?: number, // when the offer is avaible on the original site, also refresh the price
  isAvailableOnOriginalSite: boolean,
  availabilityCheckedAt: Date,
});

export type NamedDirectSiteScraper = {
  name: string;
  scraper: DirectSiteScraper;
};

export const directSiteScrapers: NamedDirectSiteScraper[] = [
  // add more scrapers here
  // cleanbnbScraper,
  // arizonaScraper,
  // cbIslandVacationsScraper,
  { name: "evolveVacationRentalScraper", scraper: evolveVacationRentalScraper },
  { name: "cleanbnbScraper", scraper: cleanbnbScraper },
  { name: "arizonaScraper", scraper: arizonaScraper },
  { name: "cbIslandVacationsScraper", scraper: cbIslandVacationsScraper },
  { name: "casamundoScraper", scraper: casamundoScraper },
];

// Helper function to filter out fields not in NewProperty
const filterNewPropertyFields = (listing: ScrapedListing): NewProperty => {
  const newPropertyKeys = Object.keys(properties).filter((key) => key !== "id");
  return Object.fromEntries(
    Object.entries(listing).filter(([key]) => newPropertyKeys.includes(key)),
  ) as unknown as NewProperty;
};

// handle the scraped properties and reviews
export const scrapeDirectListings = async (options: {
  checkIn: Date;
  checkOut: Date;
  requestNightlyPrice?: number;
  requestId?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  numGuests?: number;
}) => {
  const { requestNightlyPrice } = options;

  if (!requestNightlyPrice) {
    throw new Error("requestNightlyPrice is required");
  }

  const minPrice = requestNightlyPrice * 0.8;
  const maxPrice = requestNightlyPrice * 1.1;

  const allListings = await Promise.all(
    directSiteScrapers.map((s) => s.scraper(options)),
  );

  console.log('DONE');
  console.log(allListings[0]);

  const listings = allListings
    .flat()
    .filter(
      (listing) =>
        listing.originalNightlyPrice !== null &&
        listing.originalNightlyPrice !== undefined &&
        listing.originalNightlyPrice >= minPrice &&
        listing.originalNightlyPrice <= maxPrice
    )
    .sort((a, b) => {
      const aDiff = Math.abs(
        (a.originalNightlyPrice ?? 0) - requestNightlyPrice,
      );
      const bDiff = Math.abs(
        (b.originalNightlyPrice ?? 0) - requestNightlyPrice,
      );
      return aDiff - bDiff;
    })
    .slice(0, 10); // Grab up to 10 listings

  if (listings.length > 0) {
    await db.transaction(async (trx) => {
      // for each listing, insert the property and reviews OR update them if they already exist
      // then create offers if the offers don't exist
      for (const listing of listings) {
        if (!listing.originalListingId) {
          continue;
        }
        const existingOriginalPropertyIdList = await trx
          .select({ id: properties.originalListingId })
          .from(properties)
          .where(eq(properties.originalListingId, listing.originalListingId));
        const existingOriginalPropertyId =
          existingOriginalPropertyIdList[0]?.id;

        let formattedlatLngPoint = null;
        if (listing.latLngPoint?.lat && listing.latLngPoint.lng) {
          formattedlatLngPoint = createLatLngGISPoint({
            lat: listing.latLngPoint.lat,
            lng: listing.latLngPoint.lng,
          });
        } else {
          const { location } = await getCoordinates(listing.address);
          if (!location)
            throw new Error("Could not get coordinates for address");
          formattedlatLngPoint = createLatLngGISPoint({
            lat: location.lat,
            lng: location.lng,
          });
        }

        const newPropertyListing = filterNewPropertyFields(listing);
        if (existingOriginalPropertyId) {
          const tramonaProperty = await trx
            .update(properties)
            .set({ ...newPropertyListing, latLngPoint: formattedlatLngPoint }) // Only keeps fields that are defined in the NewProperty schema
            .where(eq(properties.originalListingId, existingOriginalPropertyId))
            .returning({ id: properties.id });

          const tramonaPropertyId = tramonaProperty[0]!.id;

          if (listing.reviews.length > 0) {
            await trx
              .delete(reviews)
              .where(eq(reviews.propertyId, tramonaPropertyId));
            await trx.insert(reviews).values(
              listing.reviews.map((review) => ({
                ...review,
                propertyId: tramonaPropertyId,
              })),
            );
          }

          const existingOffers = await trx
            .select({ id: offers.id })
            .from(offers)
            .where(
              and(
                eq(offers.propertyId, tramonaPropertyId),
                eq(offers.checkIn, options.checkIn),
                eq(offers.checkOut, options.checkOut),
                options.requestId
                  ? eq(offers.requestId, options.requestId)
                  : undefined,
              ),
            );
          if (existingOffers[0]) {
            console.log("existingOffer, offerId: ", existingOffers[0]?.id);
          }

          if (!existingOffers[0]?.id) {
            if (!listing.originalNightlyPrice) {
              console.log(
                "originalNightlyPrice is not available for this listing: ",
                listing.originalListingUrl,
              );
              continue;
            }
            const originalTotalPrice =
              listing.originalNightlyPrice *
              getNumNights(options.checkIn, options.checkOut);
            const newOffer: NewOffer = {
              propertyId: tramonaPropertyId,
              checkIn: options.checkIn,
              checkOut: options.checkOut,
              totalPrice: originalTotalPrice,
              hostPayout: originalTotalPrice,
              travelerOfferedPrice: Math.ceil(
                originalTotalPrice * DIRECTLISTINGMARKUP,
              ),
              scrapeUrl: listing.scrapeUrl,
              isAvailableOnOriginalSite: true,
              availabilityCheckedAt: new Date(),
              randomDirectListingDiscount:
                createRandomMarkupEightToFourteenPercent(),
              ...(options.requestId && { requestId: options.requestId }),
            };
            const newOfferId = await trx
              .insert(offers)
              .values(newOffer)
              .returning({ id: offers.id });
          }
        } else {
          const tramonaProperty = await trx
            .insert(properties)
            .values({
              ...newPropertyListing,
              latLngPoint: formattedlatLngPoint,
            })
            .returning({ id: properties.id });

          const newPropertyId = tramonaProperty[0]!.id;

          if (listing.reviews.length > 0) {
            await trx.insert(reviews).values(
              listing.reviews.map((review) => ({
                ...review,
                propertyId: newPropertyId,
              })),
            );
          }

          const existingOffers = await trx
            .select({ id: offers.id })
            .from(offers)
            .where(
              and(
                eq(offers.propertyId, newPropertyId),
                eq(offers.checkIn, options.checkIn),
                eq(offers.checkOut, options.checkOut),
                options.requestId
                  ? eq(offers.requestId, options.requestId)
                  : undefined,
              ),
            );

          if (!existingOffers[0]?.id) {
            if (!listing.originalNightlyPrice) {
              console.log(
                "originalNightlyPrice is not available for this listing: ",
                listing.originalListingUrl,
              );
              continue;
            }
            const originalTotalPrice =
              listing.originalNightlyPrice *
              getNumNights(options.checkIn, options.checkOut);
            const newOffer: NewOffer = {
              propertyId: newPropertyId,
              checkIn: options.checkIn,
              checkOut: options.checkOut,
              totalPrice: originalTotalPrice,
              hostPayout: originalTotalPrice,
              travelerOfferedPrice: originalTotalPrice,
              scrapeUrl: listing.scrapeUrl,
              isAvailableOnOriginalSite: true,
              availabilityCheckedAt: new Date(),
              ...(options.requestId && { requestId: options.requestId }),
            };
            const newOfferId = await trx
              .insert(offers)
              .values(newOffer)
              .returning({ id: offers.id });
          }
        }
      }
    });
  }
  return listings;
};

// update availability of properties, and original nightly price
export const subsequentScrape = async (options: { offerIds: number[] }) => {
  const savedResult: SubScrapedResult[] = [];
  await db.transaction(async (trx) => {
    for (const offerId of options.offerIds) {
      const offer = await trx.query.offers.findFirst({
        where: eq(offers.id, offerId),
        with: {
          property: true,
        },
      });

      if (!offer?.property.originalListingId || !offer.scrapeUrl) {
        continue;
      } // skip the non-scraped offers

      switch (offer.property.originalListingPlatform) {
        case "IntegrityArizona":
          const subScrapedResult = await arizonaSubScraper({
            originalListingId: offer.property.originalListingId,
            scrapeUrl: offer.scrapeUrl,
            checkIn: offer.checkIn,
            checkOut: offer.checkOut,
          });
          const updateIntegrityArizonaData: Partial<Offer> = {
            isAvailableOnOriginalSite:
              subScrapedResult.isAvailableOnOriginalSite,
            availabilityCheckedAt: subScrapedResult.availabilityCheckedAt,
          };

          if (subScrapedResult.originalNightlyPrice) {
            updateIntegrityArizonaData.totalPrice =
              subScrapedResult.originalNightlyPrice *
              getNumNights(offer.checkIn, offer.checkOut);
          }

          await trx
            .update(offers)
            .set(updateIntegrityArizonaData)
            .where(eq(offers.id, offerId));
          savedResult.push(subScrapedResult);

          break;
        // TODO add other scraping sites here
        case "Cleanbnb":
          const cleanbnbSubResult = await cleanbnbSubScraper({
            originalListingId: offer.property.originalListingId,
            scrapeUrl: offer.scrapeUrl,
            checkIn: offer.checkIn,
            checkOut: offer.checkOut,
          });
          const updateCleanbnbData: Partial<Offer> = {
            isAvailableOnOriginalSite:
              cleanbnbSubResult.isAvailableOnOriginalSite,
            availabilityCheckedAt: cleanbnbSubResult.availabilityCheckedAt,
          };

          if (cleanbnbSubResult.originalNightlyPrice) {
            updateCleanbnbData.totalPrice =
              cleanbnbSubResult.originalNightlyPrice *
              getNumNights(offer.checkIn, offer.checkOut);
          }

          await trx
            .update(offers)
            .set(updateCleanbnbData)
            .where(eq(offers.id, offerId));
          savedResult.push(cleanbnbSubResult);

          break;
        // TODO add other scraping sites here
        case "CB Island Vacations":
          const subScrapedResultCBIsland = await cbIslandVacationsSubScraper({
            originalListingId: offer.property.originalListingId,
            scrapeUrl: offer.scrapeUrl,
            checkIn: offer.checkIn,
            checkOut: offer.checkOut,
          });
          const updateCBIslandVacationsData: Partial<Offer> = {
            isAvailableOnOriginalSite:
              subScrapedResultCBIsland.isAvailableOnOriginalSite,
            availabilityCheckedAt:
              subScrapedResultCBIsland.availabilityCheckedAt,
          };

          if (subScrapedResultCBIsland.originalNightlyPrice) {
            updateCBIslandVacationsData.totalPrice =
              subScrapedResultCBIsland.originalNightlyPrice *
              getNumNights(offer.checkIn, offer.checkOut);
          }

          await trx
            .update(offers)
            .set(updateCBIslandVacationsData)
            .where(eq(offers.id, offerId));
          savedResult.push(subScrapedResultCBIsland);

          break;

        case "Casamundo":
          const subScrapedResultCasamundo = await casamundoSubScraper({
            originalListingId: offer.property.originalListingId,
            scrapeUrl: offer.scrapeUrl,
            checkIn: offer.checkIn,
            checkOut: offer.checkOut,
          });
          const updateData: Partial<Offer> = {
            isAvailableOnOriginalSite:
              subScrapedResultCasamundo.isAvailableOnOriginalSite,
            availabilityCheckedAt:
              subScrapedResultCasamundo.availabilityCheckedAt,
          };

          if (subScrapedResultCasamundo.originalNightlyPrice) {
            updateData.totalPrice =
              subScrapedResultCasamundo.originalNightlyPrice *
              getNumNights(offer.checkIn, offer.checkOut);
          }

          await trx
            .update(offers)
            .set(updateData)
            .where(eq(offers.id, offerId));
          savedResult.push(subScrapedResultCasamundo);
          break;

        case "Evolve":
          const subScrapedResultEvolve = await evolveVacationRentalSubScraper({
            originalListingId: offer.property.originalListingId,
            scrapeUrl: offer.scrapeUrl,
            checkIn: offer.checkIn,
            checkOut: offer.checkOut,
          });
          if (subScrapedResultEvolve) {
            const updateData: Partial<Offer> = {
              isAvailableOnOriginalSite:
                subScrapedResultEvolve.isAvailableOnOriginalSite,
              availabilityCheckedAt:
                subScrapedResultEvolve.availabilityCheckedAt,
            };

            if (subScrapedResultEvolve.originalNightlyPrice) {
              updateData.totalPrice =
                subScrapedResultEvolve.originalNightlyPrice *
                getNumNights(offer.checkIn, offer.checkOut);
            }

            await trx
              .update(offers)
              .set(updateData)
              .where(eq(offers.id, offerId));
            savedResult.push(subScrapedResultEvolve);
          }
          break;
      }
    }
  });
  return savedResult;
};
