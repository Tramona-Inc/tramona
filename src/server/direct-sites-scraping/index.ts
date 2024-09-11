import { db } from "../db";
import { exampleScraper } from "./example";
import {
  cbIslandVacationsScraper,
  cbIslandVacationsSubScraper,
} from "./hawaii-scraper";
import { casamundoScraper } from "./casamundo-scraper";
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
import { haversineDistance } from "@/server/server-utils";

export type DirectSiteScraper = (options: {
  checkIn: Date;
  checkOut: Date;
  numOfOffersInEachScraper?: number;
  requestNightlyPrice?: number; // when the scraper is used by traveler request page
  requestId?: number; // when the scraper is used by traveler request page
  location?: string;
}) => Promise<ScrapedListing[]>;

export type ScrapedListing = Omit<NewProperty, "latLngPoint"> & {
  originalListingUrl: string; // enforce that its non-null
  reviews: NewReview[];
  scrapeUrl: string;
};

export type SubsequentScraper = (options: {
  originalListingId: string; // all input params are from offers and properties table
  scrapeUrl: string;
  checkIn: Date;
  checkOut: Date;
}) => Promise<SubScrapedResult>;

export type SubScrapedResult = {
  originalNightlyPrice?: number; // when the offer is avaible on the original site, also refresh the price
  isAvailableOnOriginalSite: boolean;
  availabilityCheckedAt: Date;
};

export type NamedDirectSiteScraper = {
  name: string;
  scraper: DirectSiteScraper;
};

export const directSiteScrapers: NamedDirectSiteScraper[] = [
  // add more scrapers here
  // { name: 'cleanbnbScraper', scraper: cleanbnbScraper },
  // { name: "arizonaScraper", scraper: arizonaScraper },
  // {name: "cbIslandVacationsScraper", scraper: cbIslandVacationsScraper },
  { name: "casamundoScraper", scraper: casamundoScraper },
];

// Helper function to filter out fields not in NewProperty
const filterNewPropertyFields = (listing: ScrapedListing): NewProperty => {
  const newPropertyKeys = Object.keys(properties).filter((key) => key !== "id");
  return Object.fromEntries(
    Object.entries(listing).filter(([key]) => newPropertyKeys.includes(key)),
  ) as unknown as NewProperty;
};

const pickScrapersByLocation = (
  lat: number,
  lng: number,
  radius: number,
): { scrapersList: string[]; formattedLocation: string | null } => {
  const azScraperLocations = [
    { name: "Lake Havasu", lat: 34.4839, lng: -114.3225 },
    { name: "Parker Strip", lat: 34.2983, lng: -114.1439 },
  ];

  for (const location of azScraperLocations) {
    const distance = haversineDistance(lat, lng, location.lat, location.lng);
    if (distance <= radius) {
      return {
        scrapersList: ["arizonaScraper"],
        formattedLocation: location.name,
      };
    }
  }

  // add if statements for other locations here

  // TODO: default scrapersList
  return { scrapersList: [], formattedLocation: null };
};

// handle the scraped properties and reviews
export const scrapeDirectListings = async (options: {
  checkIn: Date;
  checkOut: Date;
  numOfOffersInEachScraper?: number;
  requestNightlyPrice?: number;
  requestId?: number;
  scrapersToExecute?: string[];
  location?: string;
  latitude?: number;
  longitude?: number;
}) => {
  // Create a new options object excluding `scrapersToExecute`
  const { scrapersToExecute, ...scraperOptions } = options;

  let selectedScrapers: NamedDirectSiteScraper[] = [];
  if (scrapersToExecute && scrapersToExecute.length > 0) {
    selectedScrapers = directSiteScrapers.filter((s) =>
      scrapersToExecute.includes(s.name),
    );
  } else {
    // use specific scrapers based on request location
    if (options.latitude && options.longitude) {
      const { scrapersList, formattedLocation } = pickScrapersByLocation(
        options.latitude,
        options.longitude,
        25, // search radius: 25 miles
      );
      if (scrapersList.length > 0) {
        // selectedScrapers is a subset of directSiteScrapers that its name appeared in scrapersList
        selectedScrapers = directSiteScrapers.filter((scraper) =>
          scrapersList.includes(scraper.name),
        );
        if (formattedLocation) {
          scraperOptions.location = formattedLocation;
        }
      }
    } else {
      // THIS IS A TEMPORARY FIX before we have coordinates for each request.
      // Once the latLngPoint works, delete this block and test new request in "Lake Havasu" or "Parker Strip"
      // const formattedLocation = options.location?.split(",")[0]?.trim();
      // if (
      //   formattedLocation === "Lake Havasu" ||
      //   formattedLocation === "Parker Strip"
      // ) {
      //   selectedScrapers = directSiteScrapers.filter(
      //     (s) => s.name === "arizonaScraper",
      //   );
      //   console.log("selectedScrapers", selectedScrapers);
      //   scraperOptions.location = formattedLocation;
      // }
      // TEMPORARY FIX ENDS
      console.error(
        "Latitude and longitude are required for triggering location-based scraping",
      );
    }
    // use default scrapers if no specific scrapers are provided or request location doesn't match any scraper
    if (selectedScrapers.length === 0) {
      // TODO: add default scrapers here
      return;
    }
  }
  const allListings = await Promise.all(
    selectedScrapers.map((s) => s.scraper(scraperOptions)),
  );

  const listings = allListings
    .flat()
    .sort(
      (a, b) => (a.originalNightlyPrice ?? 0) - (b.originalNightlyPrice ?? 0),
    )
    .slice(0, 10); // if the number of listings is less than 10, slice will return the whole array

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

        const { location } = await getCoordinates(listing.address);
        if (!location) throw new Error("Could not get coordinates for address");
        const latLngPoint = sql`ST_SetSRID(ST_MakePoint(${location.lng}, ${location.lat}), 4326)`;

        const newPropertyListing = filterNewPropertyFields(listing);
        if (existingOriginalPropertyId) {
          const tramonaProperty = await trx
            .update(properties)
            .set({ ...newPropertyListing, latLngPoint }) // Only keeps fields that are defined in the NewProperty schema
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
            .values({ ...newPropertyListing, latLngPoint })
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
          if (subScrapedResult) {
            const updateData: Partial<Offer> = {
              isAvailableOnOriginalSite:
                subScrapedResult.isAvailableOnOriginalSite,
              availabilityCheckedAt: subScrapedResult.availabilityCheckedAt,
            };

            if (subScrapedResult.originalNightlyPrice) {
              updateData.totalPrice =
                subScrapedResult.originalNightlyPrice *
                getNumNights(offer.checkIn, offer.checkOut);
            }

            await trx
              .update(offers)
              .set(updateData)
              .where(eq(offers.id, offerId));
            savedResult.push(subScrapedResult);
          }
          break;
        // TODO add other scraping sites here
        case "CB Island Vacations":
          const subScrapedResultCBIsland = await cbIslandVacationsSubScraper({
            originalListingId: offer.property.originalListingId,
            scrapeUrl: offer.scrapeUrl,
            checkIn: offer.checkIn,
            checkOut: offer.checkOut,
          });
          if (subScrapedResultCBIsland) {
            const updateData: Partial<Offer> = {
              isAvailableOnOriginalSite:
                subScrapedResultCBIsland.isAvailableOnOriginalSite,
              availabilityCheckedAt:
                subScrapedResultCBIsland.availabilityCheckedAt,
            };

            if (subScrapedResultCBIsland.originalNightlyPrice) {
              updateData.totalPrice =
                subScrapedResultCBIsland.originalNightlyPrice *
                getNumNights(offer.checkIn, offer.checkOut);
            }

            await trx
              .update(offers)
              .set(updateData)
              .where(eq(offers.id, offerId));
            savedResult.push(subScrapedResultCBIsland);
          }
          break;
      }
    }
  });
  return savedResult;
};
