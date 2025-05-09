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
import {
  properties,
  propertyInsertSchema,
  requests,
  reviewsInsertSchema,
} from "../db/schema";
import { NewOffer, NewProperty, Offer, offers, reviews } from "../db/schema";
import { arizonaScraper, arizonaSubScraper } from "./integrity-arizona";
import { redawningScraper } from "./redawning";

import { getCoordinates } from "../google-maps";
import { eq, and, inArray } from "drizzle-orm";
import {
  createRandomMarkupEightToFourteenPercent,
  getNumNights,
  logAndFilterSettledResults,
} from "@/utils/utils";
import { DIRECT_LISTING_MARKUP } from "@/utils/constants";
import { createLatLngGISPoint, sendText } from "@/server/server-utils";
import { cleanbnbScraper, cleanbnbSubScraper } from "./cleanbnb-scrape";
import { z } from "zod";
import { formatZodError } from "../../utils/zod-utils";
import { env } from "@/env";
import { getTravelerOfferedPrice } from "@/utils/payment-utils/paymentBreakdown";

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

const scrapedListingSchema = propertyInsertSchema
  .omit({ latLngPoint: true, hostTeamId: true })
  .extend({
    originalListingUrl: z.string(),
    reviews: reviewsInsertSchema.omit({ propertyId: true }).array(),
    scrapeUrl: z.string(),
    latLngPoint: z.object({ lat: z.number(), lng: z.number() }).optional(),
    nightlyPrice: z.number().optional(),
  });

export type ScrapedListing = z.infer<typeof scrapedListingSchema>;

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
// TODO
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
      //log(`Starting ${s.name} for request ${options.requestId}`);
      return s.scraper(options).then((res) => {
        try {
          return scrapedListingSchema.array().parse(res);
        } catch (e) {
          if (e instanceof z.ZodError) {
            throw new Error(`Error parsing ${s.name}:\n\n${formatZodError(e)}`);
          }
          throw e;
        }
      });
    }),
  );

  // log each errored scraper
  scraperResults.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `Error in ${directSiteScrapers[i]!.name}:\n`,
        r.reason instanceof Error ? r.reason.toString() : r.reason,
      );
    }
  });

  if (scraperResults.every((r) => r.status === "rejected")) {
    throw new Error("All scrapers errored");
  }

  const flatListings = scraperResults.flatMap((r) =>
    r.status === "fulfilled" ? r.value : [],
  );

  // todo: handle if all the scrapers error (dont send out text)

  const userFromRequest = await db.query.requests
    .findFirst({
      where: eq(requests.id, options.requestId!),
      with: {
        madeByGroup: { with: { owner: { columns: { phoneNumber: true, isBurner: true } } } },
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

  await db.delete(offers).where(inArray(offers.id, scrapedOfferIds));

  let listings = [] as ScrapedListing[];

  const fairListings = flatListings.filter((listing) => {
    return (
      listing.originalNightlyPrice !== null &&
      listing.originalNightlyPrice !== undefined
    );
  });

  function getCloseness(listing: ScrapedListing) {
    const discountPercentage = Math.abs(
      1 - listing.originalNightlyPrice! / requestNightlyPrice,
    );

    if (discountPercentage <= 0.2) return "close";
    if (discountPercentage <= 0.5) return "mid";
    return "wide";
  }

  const closeMatches = fairListings
    .filter((l) => getCloseness(l) === "close")
    .sort((a, b) => {
      const aDiff = Math.abs(
        (a.originalNightlyPrice ?? 0) - requestNightlyPrice,
      );
      const bDiff = Math.abs(
        (b.originalNightlyPrice ?? 0) - requestNightlyPrice,
      );
      return aDiff - bDiff;
    });
  const midMatches = fairListings
    .filter((l) => getCloseness(l) === "mid")
    .sort((a, b) => {
      const aDiff = Math.abs(
        (a.originalNightlyPrice ?? 0) - requestNightlyPrice,
      );
      const bDiff = Math.abs(
        (b.originalNightlyPrice ?? 0) - requestNightlyPrice,
      );
      return aDiff - bDiff;
    });
  const wideMatches = fairListings.filter((l) => getCloseness(l) === "wide");

  console.log("closeMatches: ", closeMatches.length);
  console.log("midMatches: ", midMatches.length);
  console.log("wideMatches: ", wideMatches.length);

  if (
    closeMatches.length === 0 &&
    midMatches.length === 0 &&
    wideMatches.length === 0
  ) {
    console.log("Case 1: No properties in the area");
    if (userFromRequest && !userFromRequest.isBurner) {
      await sendText({
        to: userFromRequest.phoneNumber!,
        content: `Tramona: We’re not live in ${options.location} just yet, but we’re actively working on it! We’ll send you an email as soon as we launch there.\n\nIn the meantime, if you’re flexible with your travel plans, feel free to submit a request for a different location and discover the great deals our hosts can offer you.\n\nThank you for your interest in Tramona!`,
      });
      // await sendScheduledText({
      //   to: userFromRequest.phoneNumber!,
      //   content: `Tramona: Your request for ${options.location} for ${formatCurrency(options.requestNightlyPrice)}/night didn't yield any offers in the last 24 hours.
      //   Consider submitting a new request with a different price range or a broader location to increase your chances of finding a match`,
      //   sendAt: addHours(new Date(), 24),
      // });
    }
  } else if (closeMatches.length === 0 && midMatches.length === 0) {
    console.log(
      "Case 2: No matches within the price range (all matches are 50% + outside)",
    );
    if (userFromRequest) {
      await db
        .update(requests)
        .set({ messageCase: "No matches within price range" })
        .where(eq(requests.id, options.requestId!));
    }
  } else if (closeMatches.length > 0 && closeMatches.length <= 3) {
    console.log("Case 3: 1-3 matches within 0-20%, but more in 20-50%");
    listings = closeMatches.concat(midMatches).slice(0, 10);
    if (userFromRequest) {
      await db
        .update(requests)
        .set({ messageCase: "Some close matches" })
        .where(eq(requests.id, options.requestId!));
    }
  } else if (closeMatches.length === 0 && midMatches.length > 0) {
    console.log("Case 4: No close matches, but some in 20-50%");
    if (userFromRequest) {
      await db
        .update(requests)
        .set({ messageCase: "No close matches" })
        .where(eq(requests.id, options.requestId!));
    }
    listings = midMatches.slice(0, 10); // Send 20-50% matches
  } else if (closeMatches.length > 3) {
    listings = closeMatches.slice(0, 10); // Send 0-20% matches
    console.log("Case 5: 4 or more close matches (0-20%)");
    if (userFromRequest) {
      await db
        .update(requests)
        .set({ messageCase: "Many close matches" })
        .where(eq(requests.id, options.requestId!));
    }
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
        const { location } = await getCoordinates(listing.address);
        let formattedlatLngPoint = null;
        if (listing.latLngPoint) {
          formattedlatLngPoint = createLatLngGISPoint({
            lat: listing.latLngPoint.lat,
            lng: listing.latLngPoint.lng,
          });
        } else {
          if (!location)
            throw new Error("Could not get coordinates for address");
          formattedlatLngPoint = createLatLngGISPoint({
            lat: location.lat,
            lng: location.lng,
          });
        }
        const newPropertyListing = {
          ...filterNewPropertyFields(listing),
          hostTeamId: env.ADMIN_TEAM_ID,
          latLngPoint: formattedlatLngPoint,
        };
        if (existingOriginalPropertyId) {
          const tramonaProperty = await trx
            .update(properties)
            .set(newPropertyListing) // Only keeps fields that are defined in the NewProperty schema
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
            const originalTotalBasePriceBeforeFees =
              realNightlyPrice *
              getNumNights(options.checkIn, options.checkOut);

            // ----- create checkout and offer
            const calculatedTravelerPrice = getTravelerOfferedPrice({
              totalBasePriceBeforeFees: originalTotalBasePriceBeforeFees,
              travelerMarkup: DIRECT_LISTING_MARKUP,
            });

            const newOffer: NewOffer = {
              propertyId: tramonaPropertyId,
              checkIn: options.checkIn,
              checkOut: options.checkOut,
              totalBasePriceBeforeFees: originalTotalBasePriceBeforeFees,
              hostPayout: originalTotalBasePriceBeforeFees,
              calculatedTravelerPrice,
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
          const propertyId = await trx
            .insert(properties)
            .values(newPropertyListing)
            .returning()
            .then((res) => res[0]!.id);

          if (listing.reviews.length > 0) {
            await trx.insert(reviews).values(
              listing.reviews.map((review) => ({
                ...review,
                propertyId,
              })),
            );
          }

          const existingOffers = await trx
            .select({ id: offers.id })
            .from(offers)
            .where(
              and(
                eq(offers.propertyId, propertyId),
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

            const originalTotalBasePriceBeforeFees =
              realNightlyPrice *
              getNumNights(options.checkIn, options.checkOut);

            const calculatedTravelerPrice = getTravelerOfferedPrice({
              totalBasePriceBeforeFees: originalTotalBasePriceBeforeFees,
              travelerMarkup: DIRECT_LISTING_MARKUP,
            });

            await trx.insert(offers).values({
              propertyId,
              checkIn: options.checkIn,
              checkOut: options.checkOut,
              totalBasePriceBeforeFees: originalTotalBasePriceBeforeFees,
              hostPayout: originalTotalBasePriceBeforeFees,
              calculatedTravelerPrice,
              scrapeUrl: listing.scrapeUrl,
              isAvailableOnOriginalSite: true,
              availabilityCheckedAt: new Date(),
              randomDirectListingDiscount:
                createRandomMarkupEightToFourteenPercent(),
              becomeVisibleAt: new Date(becomeVisibleAtNumber),
              ...(options.requestId && { requestId: options.requestId }),
            });
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
            updateIntegrityArizonaData.totalBasePriceBeforeFees =
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
            updateCleanbnbData.totalBasePriceBeforeFees =
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
            updateCBIslandVacationsData.totalBasePriceBeforeFees =
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
            updateData.totalBasePriceBeforeFees =
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
          {
            const updateData: Partial<Offer> = {
              isAvailableOnOriginalSite:
                subScrapedResultEvolve.isAvailableOnOriginalSite,
              availabilityCheckedAt:
                subScrapedResultEvolve.availabilityCheckedAt,
            };

            if (subScrapedResultEvolve.originalNightlyPrice) {
              updateData.totalBasePriceBeforeFees =
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

export const checkAvailabilityForProperties = async (options: {
  propertyIds: number[];
  originalListingIds: string[];
  originalListingPlatforms: string[];
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
}) => {
  const {
    propertyIds,
    originalListingIds,
    originalListingPlatforms,
    checkIn,
    checkOut,
    numGuests,
  } = options;

  const availabilityPromises = propertyIds.map((propertyId, index) => {
    const originalListingId = originalListingIds[index];
    const originalListingPlatform = originalListingPlatforms[index];

    const subScraperOptions = {
      originalListingId: originalListingId!,
      scrapeUrl: "",
      checkIn,
      checkOut,
      numGuests,
    };

    type casamundoRes = {
      subScrapedResult: SubScrapedResult;
    };

    const timerLabel = `Property ${propertyId}`;

    console.time(timerLabel);

    return (async () => {
      switch (originalListingPlatform) {
        case "Casamundo":
          //const res = await axios.post<casamundoRes>("https://tramona.com/api/bookitnow", subScraperOptions);
          const res = await casamundoSubScraper(subScraperOptions);
          console.timeEnd(timerLabel); // End timing for this property
          // return {...res.data.subScrapedResult, propertyId};
          return { ...res, propertyId };

        case "IntegrityArizona":
          const arizonaResult = await arizonaSubScraper(subScraperOptions);
          console.timeEnd(timerLabel); // End timing for this property
          return { ...arizonaResult, propertyId };

        case "Evolve":
          const evolveResult =
            await evolveVacationRentalSubScraper(subScraperOptions);
          console.timeEnd(timerLabel); // End timing for this property
          return { ...evolveResult, propertyId };

        // Add other cases here as needed
        default:
          throw new Error("No subScrapedResult found");
      }
    })();
  });

  console.log("here");
  console.time("checkAvailability");

  const results = logAndFilterSettledResults(
    await Promise.allSettled(availabilityPromises),
  );

  const availabilityResults = results.filter(
    (r) => r.isAvailableOnOriginalSite && r.originalNightlyPrice !== undefined,
  );

  return availabilityResults;
};
