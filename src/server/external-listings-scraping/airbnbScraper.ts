import { DirectSiteScraper } from "../direct-sites-scraping";
import {
  scrapeAirbnbInitialPageHelper,
  scrapeAirbnbPagesHelper,
  urlScrape,
} from "@/server/server-utils";
import { NewProperty } from "@/server/db/schema";
import { z } from "zod";
import { parseCurrency } from "@/utils/utils";
import { sortBy } from "lodash";
import { scrapeAirbnbListing } from "./scrapeAirbnbListing";
export const airbnbScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  requestNightlyPrice,
  numGuests,
  location,
}) => {
  const limit = 100; // in case too many results, could be removed later
  if (!location || !numGuests) {
    throw new Error("Missing required fields");
  }

  const allListings = await scrapeAirbnbSearch({
    checkIn,
    checkOut,
    location,
    numGuests,
  });

  const filteredListings = sortBy(allListings, (l) => {
    if (!requestNightlyPrice) return 0; // no sorting
    const diff = Math.abs(l.nightlyPrice - requestNightlyPrice);
    const multiplier = l.nightlyPrice < requestNightlyPrice ? 2 : 1; // $100 cheaper = $50 more expensive
    return diff * multiplier;
  }).slice(0, limit);

  const sortedListings = sortBy(
    filteredListings,
    (l) => l.nightlyPrice / l.originalNightlyPrice, // sort by discount
  );

  return await Promise.all(
    sortedListings.map(async ({ originalListingId }) => {
      try {
        const { property, reviews, nightlyPrice } = await scrapeAirbnbListing(
          originalListingId,
          { checkIn, checkOut, numGuests },
        );

        const listingUrl = `https://www.airbnb.com/rooms/${originalListingId}`;

        const completeProperty: Omit<NewProperty, "hostTeamId"> = {
          ...property,
          originalListingId,
          originalListingPlatform: "Airbnb",
          originalListingUrl: listingUrl,
          airbnbUrl: listingUrl,
          bookOnAirbnb: true,
        };

        return {
          ...completeProperty,
          scrapeUrl: listingUrl,
          reviews,
          nightlyPrice,
          originalListingUrl: completeProperty.originalListingUrl!,
          latLngPoint: {
            lng: completeProperty.latLngPoint.x,
            lat: completeProperty.latLngPoint.y,
          },
        };
      } catch (e) {
        console.error(`Error scraping Airbnb listing ${originalListingId}:`, e);
        return undefined;
      }
    }),
  ).then((r) => r.filter(Boolean)); // filter out failed scrapes
};

export async function scrapeAirbnbSearch({
  checkIn,
  checkOut,
  location,
  numGuests,
}: {
  checkIn: Date;
  checkOut: Date;
  location: string;
  numGuests: number;
}) {
  const pageData = await scrapeAirbnbInitialPageHelper({
    checkIn,
    checkOut,
    location,
    numGuests,
  });
  // const serpUrl = getSerpUrl({
  //   checkIn,
  //   checkOut,
  //   location,
  //   numGuests,
  // });

  // const pageData = await scrapePage(serpUrl).then(async (unparsedData) => {
  //   return serpPageSchema.parse(unparsedData);
  // });

  const cursors =
    pageData.data.staysSearch.results.paginationInfo.pageCursors.slice(1);
  return await scrapeAirbnbPagesHelper({
    checkIn,
    checkOut,
    location,
    numGuests,
    cursors,
  });
  // const pageUrls = cursors.map((cursor) =>
  //   getSerpUrl({ checkIn, checkOut, location, numGuests, cursor }),
  // );

  // const numNights = getNumNights(checkIn, checkOut);

  // return (await Promise.all(pageUrls.map(scrapePage)))
  //   .flatMap((data) => data.staysSearch.results.searchResults)
  //   .map((searchResult) => transformSearchResult({ searchResult, numNights, numGuests }))
  //   .filter(Boolean);
}

export function getSerpUrl({
  checkIn,
  checkOut,
  location,
  numGuests,
  cursor,
}: {
  checkIn: Date;
  checkOut: Date;
  location: string;
  numGuests: number;
  cursor?: string;
}) {
  const checkInStr = checkIn.toISOString().split("T")[0]!;
  const checkOutStr = checkOut.toISOString().split("T")[0]!;

  const url = new URL(`https://www.airbnb.com/s`);

  url.searchParams.set("currency", "USD");
  url.searchParams.set("checkin", checkInStr);
  url.searchParams.set("checkout", checkOutStr);
  url.searchParams.set("query", location);
  url.searchParams.set("adults", numGuests.toString());
  if (cursor) url.searchParams.set("cursor", cursor);

  return url.toString();
}

export async function scrapePage(url: string) {
  // niobeMinimalClientData[0][1].data.presentation...
  const pageDataSchema = z.object({
    niobeMinimalClientData: z.tuple([
      z.tuple([
        z.unknown(),
        z.object({ data: z.object({ presentation: z.unknown() }) }),
      ]),
    ]),
  });

  const ret = await urlScrape(url)
    .then(($) => $("#data-deferred-state-0").text())
    .then((jsonStr) => JSON.parse(jsonStr))
    .then((unparsedData) => {
      console.log("Raw Airbnb Page Data:", JSON.stringify(unparsedData, null, 2)); // Log with indentation for readability
      return pageDataSchema.parse(unparsedData);
    }).then((data) => data.niobeMinimalClientData[0][1].data.presentation)
    .then((page) => serpPageSchema.parse(page));

  // await writeFile("airbnb-page-data.json", JSON.stringify(ret, null, 2));

  return ret;
}

export const serpPageSchema = z.object({
  staysSearch: z.object({
    results: z.object({
      paginationInfo: z.object({ pageCursors: z.string().array() }),
      searchResults: z.array(
        z.object({
          listing: z.object({
            id: z.string(),
            name: z.string(),
            avgRatingLocalized: z.string().nullish(),
            structuredContent: z.object({ title: z.string().nullish() }),
          }),
          contextualPictures: z.array(z.object({ picture: z.string().url() })),
          structuredDisplayPrice: z.object({ // <-- ADD structuredDisplayPrice SCHEMA
            primaryLine: z.union([ // <-- Define union type for primaryLine
              z.object({
                discountedPrice: z.string(),
                originalPrice: z.string(),
                price: z.undefined(),
              }),
              z.object({
                discountedPrice: z.undefined(),
                originalPrice: z.undefined(),
                price: z.string(),
              }),
            ]),
            secondaryLine: z.object({ // <-- Define secondaryLine schema
              price: z.string(), // <-- Assuming secondaryLine.price is always a string
              accessibilityLabel: z.string().optional(), // <-- Add accessibilityLabel, optional
            }).optional(), // <-- secondaryLine is optional
            explanationData: z.object({ // <-- Define explanationData schema
              priceDetails: z.array( // <-- priceDetails is an array
                z.object({
                  items: z.array( // <-- items is an array
                    z.object({
                      description: z.string().optional(), // <-- description is optional
                      priceString: z.string().optional(), // <-- priceString is optional
                    })
                  ).optional() // <-- items is optional
                })
              ).optional() // <-- priceDetails is optional
            }).optional() // <-- explanationData is optional
          }),
        }),
      ),
    }),
  }),
});

type SearchResult = z.infer<
  typeof serpPageSchema
>["staysSearch"]["results"]["searchResults"][number];

export function transformSearchResult({
  searchResult: { listing, structuredDisplayPrice, contextualPictures }, // <-- Use structuredDisplayPrice
  numNights,
  numGuests,
}: {
  searchResult: SearchResult;
  numNights: number;
  numGuests: number;
}) {
  const discountedPriceStr =
  structuredDisplayPrice.primaryLine.discountedPrice ?? structuredDisplayPrice.primaryLine.price; // <-- Get price from structuredDisplayPrice

if (!discountedPriceStr) return undefined;

const nightlyPrice = Math.round(
  parseCurrency(discountedPriceStr) / numNights,
);

const originalPriceStr =
structuredDisplayPrice.primaryLine.originalPrice; // <-- Get original price from structuredDisplayPrice

  const originalNightlyPrice = originalPriceStr
    ? Math.round(parseCurrency(originalPriceStr) / numNights)
    : nightlyPrice; // <-- Calculate original nightly price if available

  if (!originalPriceStr) return undefined;



  return {
    nightlyPrice,
    originalNightlyPrice,
    originalListingId: listing.id,
    name: listing.name,
    description: listing.structuredContent.title,
    imageUrls: contextualPictures.map((p) => p.picture),
    ratingStr: listing.avgRatingLocalized,
    originalListingPlatform: "Airbnb",
    maxNumGuests: numGuests,
  };
}
