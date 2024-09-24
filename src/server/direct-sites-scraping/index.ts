import { db } from "../db";
import {
  evolveVacationRentalScraper,
  evolveVacationRentalSubScraper,
} from "./evolve-scraper";
import {
  cbIslandVacationsScraper,
  cbIslandVacationsSubScraper,
} from "./hawaii-scraper";
import { casamundoScraper, casamundoSubScraper } from "./casamundo-scraper";
import { properties, requests } from "../db/schema";
import {
  NewOffer,
  NewProperty,
  Offer,
  offers,
  NewReview,
  reviews,
} from "../db/schema";
import { arizonaScraper, arizonaSubScraper } from "./integrity-arizona";
import { redawningScraper } from "./redawning";

import { getCoordinates } from "../google-maps";
import { eq, and, inArray } from "drizzle-orm";
import {
  createRandomMarkupEightToFourteenPercent,
  formatCurrency,
  getNumNights,
} from "@/utils/utils";
import { DIRECTLISTINGMARKUP } from "@/utils/constants";
import { createLatLngGISPoint, sendScheduledText } from "@/server/server-utils";
import { cleanbnbScraper, cleanbnbSubScraper } from "./cleanbnb-scrape";
import { log } from "@/pages/api/script";
import { env } from "@/env";
import { addHours } from "date-fns";

type ScraperOptions = {
  location: string;
  checkIn: Date;
  checkOut: Date;
  requestNightlyPrice: number; // when the scraper is used by traveler request page
  requestId?: number; // when the scraper is used by traveler request page
  latitude?: number;
  longitude?: number;
  numGuests?: number;
};

export type DirectSiteScraper = (
  options: ScraperOptions,
) => Promise<ScrapedListing[]>;

export type ScrapedListing = Omit<NewProperty, "latLngPoint"> & {
  originalListingUrl: string; // enforce that it's non-null
  reviews: NewReview[];
  scrapeUrl: string;
  latLngPoint?: { lat: number; lng: number }; // make latLngPoint optional
  nightlyPrice?: number; // airbnb scraper has nightlyPrice as real price and originalNightlyPrice as the price before discount
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

export const directSiteScrapers = [
  // add more scrapers here
  { name: "evolveVacationRentalScraper", scraper: evolveVacationRentalScraper },
  { name: "cleanbnbScraper", scraper: cleanbnbScraper },
  { name: "arizonaScraper", scraper: arizonaScraper },
  { name: "cbIslandVacationsScraper", scraper: cbIslandVacationsScraper },
  { name: "redawningScraper", scraper: redawningScraper },
  { name: "casamundoScraper", scraper: casamundoScraper },
  // { name: "airbnbScraper", scraper: airbnbScraper },
] as const;

// Helper function to filter out fields not in NewProperty
const filterNewPropertyFields = (listing: ScrapedListing): NewProperty => {
  const newPropertyKeys = Object.keys(properties).filter((key) => key !== "id");
  return Object.fromEntries(
    Object.entries(listing).filter(([key]) => newPropertyKeys.includes(key)),
  ) as unknown as NewProperty;
};

// handle the scraped properties and reviews
export const scrapeDirectListings = async (options: ScraperOptions) => {
  const { requestNightlyPrice } = options; // in cents

  const scraperResults = await Promise.allSettled(
    directSiteScrapers.map((s) => {
      log(`Starting ${s.name} for request ${options.requestId}`);
      return s.scraper(options);
    }),
  );

  const rejectedResults = scraperResults.filter(
    (r): r is PromiseRejectedResult => r.status === "rejected",
  );

  const errorsWithScraperNames = rejectedResults.map(({ reason }, i) => {
    const scraper = directSiteScrapers[i];
    return `${scraper?.name} errored:\n\n${reason instanceof Error ? reason.stack : reason}`;
  });

  if (errorsWithScraperNames.length > 0) {
    log(
      `${rejectedResults.length} scrapers errored for request ${options.requestId}: ${errorsWithScraperNames.join("\n\n")}`,
    );
  } else {
    log(`All scrapers completed successfully for request ${options.requestId}`);
  }

  if (rejectedResults.length === directSiteScrapers.length) {
    throw new Error("All scrapers errored");
  }

  const flatListings = scraperResults.flatMap((r) =>
    r.status === "fulfilled" ? r.value : [],
  );

  // todo: handle if all the scrapers error (dont send out text)
  for (const listing of flatListings) {
    console.log("Listing: ", listing.originalListingUrl, listing.originalNightlyPrice, listing.originalListingPlatform);
  }

  const userFromRequest = await db.query.requests
    .findFirst({
      where: eq(requests.id, options.requestId!),
      with: {
        madeByGroup: {
          with: {
            owner: {
              columns: {
                phoneNumber: true,
              },
            },
          },
        },
      },
    })
    .then((res) => res?.madeByGroup.owner);

  const scrapedOffers = await db.query.offers.findMany({
    where: and(eq(offers.requestId, options.requestId!)),
    with: { property: { columns: { originalListingPlatform: true } } },
  });

  const scrapedOfferIds = scrapedOffers
    .filter((o) => o.property.originalListingPlatform !== null)
    .map((o) => o.id);

  log(
    `Scraped ${flatListings.length} listings for request ${options.requestId}, deleting ${scrapedOfferIds.length} old offers`,
  );

  await db.delete(offers).where(inArray(offers.id, scrapedOfferIds));

  //   if (flatListings.length === 0 && userFromRequest) {
  //     await sendText({
  //       to: userFromRequest.phoneNumber!,
  //       content: `Tramona: We’re not live in ${options.location} just yet, but we’re working on it! We’ll send you an email as soon as we launch there.
  // Are you a host in ${options.location}? Sign up here tramona.com/host-onboarding`,
  //     });
  //   }

  // dynamically expand the price range to find at least 1 listing between 50% - 170% of the requested price
  // let upperPercentage = 110;
  // let lowerPercentage = 80;
  // let fairListings;
  // do {
  //   const lowerPrice = requestNightlyPrice * (lowerPercentage / 100);
  //   const upperPrice = requestNightlyPrice * (upperPercentage / 100);

  //   fairListings = flatListings.filter((listing) => {
  //     return (
  //       listing.originalNightlyPrice !== null &&
  //       listing.originalNightlyPrice !== undefined &&
  //       listing.originalNightlyPrice >= lowerPrice &&
  //       listing.originalNightlyPrice <= upperPrice
  //     );
  //   });

  //   if (
  //     fairListings.length < 1 &&
  //     upperPercentage <= 170 &&
  //     lowerPercentage >= 50
  //   ) {
  //     upperPercentage += 20;
  //     lowerPercentage -= 10;
  //   }
  // } while (
  //   fairListings.length < 1 &&
  //   upperPercentage <= 170 &&
  //   lowerPercentage >= 50
  // );

  // const listings = fairListings
  //   .sort((a, b) => {
  //     const aDiff = Math.abs(
  //       (a.originalNightlyPrice ?? 0) - requestNightlyPrice,
  //     );
  //     const bDiff = Math.abs(
  //       (b.originalNightlyPrice ?? 0) - requestNightlyPrice,
  //     );
  //     return aDiff - bDiff;
  //   })
  //   .slice(0, 10); // Grab up to 10 listings

  let listings = [] as ScrapedListing[];

  const fairListings = flatListings.filter((listing) => {
    return (
      listing.originalNightlyPrice !== null &&
      listing.originalNightlyPrice !== undefined
    );
  });

  // fairListings = fairListings.sort((a, b) => {
  //   const aDiff = Math.abs((a.originalNightlyPrice ?? 0) - requestNightlyPrice);
  //   const bDiff = Math.abs((b.originalNightlyPrice ?? 0) - requestNightlyPrice);
  //   return aDiff - bDiff;
  // });

  function getCloseness(listing: ScrapedListing) {
    const discountPercentage =
      Math.abs(1 - listing.originalNightlyPrice! / requestNightlyPrice);

    if (discountPercentage <= 0.2) return "close";
    if (discountPercentage <= 0.5) return "mid";
    return "wide";
  }

  const closeMatches = fairListings.filter((l) => getCloseness(l) === "close");
  const midMatches = fairListings.filter((l) => getCloseness(l) === "mid");
  const wideMatches = fairListings.filter((l) => getCloseness(l) === "wide");

  if (
    closeMatches.length === 0 &&
    midMatches.length === 0 &&
    wideMatches.length === 0
  ) {
    // Case 1: No properties in the area
    if (userFromRequest) {
      void sendScheduledText({
        to: userFromRequest.phoneNumber!,
        content: `Tramona: Your request for ${options.location} for ${formatCurrency(options.requestNightlyPrice)}/night didn't yield any offers in the last 24 hours.
        Consider submitting a new request with a different price range or a broader location to increase your chances of finding a match`,
        sendAt: addHours(new Date(), 24),
      });
    }
  } else if (closeMatches.length === 0 && midMatches.length === 0) {
    // Case 2: No matches within the price range (all matches are 50% + outside)
    if (userFromRequest) {
      void sendScheduledText({
        to: userFromRequest.phoneNumber!,
        content: `Tramona: Thank you for submitting your request! \n Unfortunately, no hosts have submitted a match for your price.
        But don’t worry—our team is actively searching for options that fit your needs. \n Is your budget flexible? We do have hosts with options in ${options.location}.
        Adjust your request if you’d like to explore other possibilities. Thank you for choosing Tramona!`,
        sendAt: addHours(new Date(), 24),
      });
    }
  } else if (closeMatches.length > 0 && closeMatches.length <= 3) {
    // Case 3: 1-3 matches within 0-20%, but more in 20-50%
    listings = closeMatches.concat(midMatches).slice(0, 10);
  } else if (closeMatches.length === 0 && midMatches.length > 0) {
    // Case 4: No close matches, but some in 20-50%
    if (userFromRequest) {
      void sendScheduledText({
        to: userFromRequest.phoneNumber!,
        content: `Tramona: Thank you for submitting your request, please see matches here: ${env.NEXTAUTH_URL}/requests! \n Unfortunately, no hosts have submitted a match for your price.
        But don’t worry—our team is actively searching for options that fit your needs. \n In case your budget is flexible, some hosts sent matches slightly out of your budget take a look here: ${env.NEXTAUTH_URL}/requests.
        We’ll notify you as soon as we find the perfect stay. \n In the meantime, feel free to adjust your request if you’d like to explore other possibilities. Thank you for choosing Tramona!`,
        sendAt: addHours(new Date(), 24),
      });
    }
    listings = midMatches.slice(0, 10); // Send 20-50% matches
  } else if (closeMatches.length > 3) {
    // Case 5: 4 or more close matches (0-20%)
    listings = closeMatches.slice(0, 10); // Send 0-20% matches
  }

  if (listings.length > 0) {
    await db.transaction(async (trx) => {
      // for each listing, insert the property and reviews OR update them if they already exist
      // then create offers if the offers don't exist
      let becomeVisibleAtNumber = Date.now(); // will increment by 5 minutes for each offer
      for (const listing of listings) {
        becomeVisibleAtNumber += 5 * 60 * 1000; // Increment by 5 minutes when processing each listing
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
        if (listing.latLngPoint) {
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
            const realNightlyPrice =
              listing.nightlyPrice ?? listing.originalNightlyPrice;
            const originalTotalPrice =
              realNightlyPrice *
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
              becomeVisibleAt: new Date(becomeVisibleAtNumber),
              randomDirectListingDiscount:
                createRandomMarkupEightToFourteenPercent(),
              ...(options.requestId && { requestId: options.requestId }),
            };

            await trx
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
            const realNightlyPrice =
              listing.nightlyPrice ?? listing.originalNightlyPrice;
            const originalTotalPrice =
              realNightlyPrice *
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
              randomDirectListingDiscount:
                createRandomMarkupEightToFourteenPercent(),
              becomeVisibleAt: new Date(becomeVisibleAtNumber),
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
          property: {
            columns: { originalListingId: true, originalListingPlatform: true },
          },
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
