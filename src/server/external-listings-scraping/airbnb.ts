import { MinimalRequest } from "../db/schema";
import { urlScrape } from "../server-utils";
import { z } from "zod";
import { containsHTML, getNumNights, parseCurrency } from "@/utils/utils";
import { aiJson } from "@/server/aiJson";
import { propertyInsertSchema, reviewsInsertSchema } from "@/server/db/schema";
import { getCity, getCoordinates } from "@/server/google-maps";
import { sortBy } from "lodash";

export const scrapeAirbnbListings = async ({
  request,
  limit,
}: {
  request: MinimalRequest | { checkIn: Date; checkOut: Date };
  limit?: number;
}) => {
  const serpUrl = getSerpUrl({ request });

  const pageData = await scrapePage(serpUrl).then(async (unparsedData) => {
    // await writeFile(
    //   "airbnb-serp-page-data.json",
    //   JSON.stringify(unparsedData, null, 2),
    // );
    return serpPageSchema.parse(unparsedData);
  });

  const cursors = pageData.staysSearch.results.paginationInfo.pageCursors;
  const pageUrls = cursors.map((cursor) => getSerpUrl({ request, cursor }));
  const pages = await Promise.all(pageUrls.map(scrapePage));

  const numNights = getNumNights(request.checkIn, request.checkOut);

  const allListings = pages
    .map((page) => serpPageSchema.parse(page))
    .flatMap((data) => data.staysSearch.results.searchResults)
    .map((searchResult) => transformSearchResult({ searchResult, numNights }))
    .filter(Boolean);

  const filteredListings = sortBy(allListings, (l) => {
    if (!("maxTotalPrice" in request)) return 0; // no sorting
    const diff = Math.abs(l.nightlyPrice - request.maxTotalPrice);
    const multiplier = l.nightlyPrice < request.maxTotalPrice ? 2 : 1; // $100 cheaper = $50 more expensive
    return diff * multiplier;
  }).slice(0, limit);

  const sortedListings = sortBy(
    filteredListings,
    (l) => l.nightlyPrice / l.originalNightlyPrice, // sort by discount
  );

  return await Promise.all(
    sortedListings.map(
      async ({ originalListingId, nightlyPrice, originalNightlyPrice }) => {
        const { property, reviews } =
          await scrapeAirbnbListing(originalListingId);

        return {
          property: {
            ...property,
            originalNightlyPrice,
            originalListingId,
            originalListingUrl: `https://www.airbnb.com/rooms/${originalListingId}`,
          },
          reviews,
          nightlyPrice,
        };
      },
    ),
  );
};

function getSerpUrl({
  request,
  priceRange,
  cursor,
}: {
  request: MinimalRequest | { checkIn: Date; checkOut: Date };
  priceRange?: { minUSD: number; maxUSD: number };
  cursor?: string;
}) {
  const checkInStr = request.checkIn.toISOString().split("T")[0]!;
  const checkOutStr = request.checkOut.toISOString().split("T")[0]!;

  const url = new URL(`https://www.airbnb.com/s`);

  url.searchParams.set("currency", "USD");
  url.searchParams.set("checkin", checkInStr);
  url.searchParams.set("checkout", checkOutStr);

  if ("location" in request) {
    url.searchParams.set("query", request.location);
  }

  if ("numGuests" in request) {
    url.searchParams.set("adults", request.numGuests.toString());
  }

  if (priceRange) {
    url.searchParams.set("price_min", priceRange.minUSD.toString());
    url.searchParams.set("price_max", priceRange.maxUSD.toString());
  }

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  return url.toString();
}

async function scrapePage(url: string) {
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
    .then((unparsedData) => pageDataSchema.parse(unparsedData))
    .then((data) => data.niobeMinimalClientData[0][1].data.presentation);

  // await writeFile("airbnb-page-data.json", JSON.stringify(ret, null, 2));

  return ret;
}

const serpPageSchema = z.object({
  staysSearch: z.object({
    results: z.object({
      paginationInfo: z.object({ pageCursors: z.string().array() }),
      searchResults: z.array(
        z.object({
          listing: z.object({ id: z.string() }),
          pricingQuote: z.object({
            structuredStayDisplayPrice: z.union([
              z.object({
                primaryLine: z.object({
                  discountedPrice: z.string(),
                  originalPrice: z.string(),
                  price: z.undefined(),
                }),
              }),
              z.object({
                primaryLine: z.object({
                  discountedPrice: z.undefined(),
                  originalPrice: z.undefined(),
                  price: z.string(),
                }),
              }),
            ]),
          }),
        }),
      ),
    }),
  }),
});

type SearchResult = z.infer<
  typeof serpPageSchema
>["staysSearch"]["results"]["searchResults"][number];

function transformSearchResult({
  searchResult: { listing, pricingQuote },
  numNights,
}: {
  searchResult: SearchResult;
  numNights: number;
}) {
  {
    const discountedPriceStr =
      pricingQuote.structuredStayDisplayPrice.primaryLine.discountedPrice;

    const nightlyPrice = discountedPriceStr
      ? parseCurrency(discountedPriceStr) / numNights
      : undefined;

    const originalPriceStr =
      pricingQuote.structuredStayDisplayPrice.primaryLine.originalPrice;

    const originalNightlyPrice = originalPriceStr
      ? parseCurrency(originalPriceStr) / numNights
      : undefined;

    if (nightlyPrice === undefined || originalNightlyPrice === undefined) {
      return undefined;
    }

    return {
      nightlyPrice,
      originalNightlyPrice,
      originalListingId: listing.id,
    };
  }
}

export const airbnbScraperSchema = z.object({
  scrapedProperty: propertyInsertSchema
    .pick({
      name: true,
      about: true,
      imageUrls: true,
      amenities: true,
      propertyType: true,
      roomType: true,
      roomsWithBeds: true,

      avgRating: true,
      numRatings: true,

      numBeds: true,
      numBedrooms: true,
      numBathrooms: true,
      maxNumGuests: true,

      hostName: true,
      hostProfilePic: true,
      hostNumReviews: true,
      hostRating: true,

      // latLngPoint: true,

      // latitude: true,
      // longitude: true,

      checkInInfo: true,
      checkInTime: true,
      checkOutTime: true,
      petsAllowed: true,
      smokingAllowed: true,
      ageRestriction: true,
      otherHouseRules: true,
    })
    .required({
      // TODO: make non-null/remove defaults in the schema
      numBathrooms: true,
      imageUrls: true,
      petsAllowed: true,
      smokingAllowed: true,
      avgRating: true,
      numRatings: true,
      amenities: true,
    })
    .superRefine((data, ctx) => {
      if (containsHTML(data.about)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "About section contains HTML",
        });

        if (data.otherHouseRules && containsHTML(data.otherHouseRules)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Other house rules section contains HTML",
          });
        }
      }
    }),

  reviews: reviewsInsertSchema.omit({ id: true, propertyId: true }).array(),
});

function encodeAirbnbId(id: string) {
  return Buffer.from(`StayListing:${id}`).toString("base64");
}

export async function scrapeAirbnbListing(id: string) {
  const encodedId = encodeAirbnbId(id);
  const data = await Promise.all(
    [
      // `https://www.airbnb.com/rooms/${id}`,

      `https://www.airbnb.com/api/v3/StaysPdpSections/160265f6bdbacc2084cdf7de8641926c5ee141c3a2967dca0407ee47cec2a7d1?operationName=StaysPdpSections&locale=en&currency=USD&variables={"id":"${encodedId}","pdpSectionsRequest":{"adults":"1","layouts":["SIDEBAR","SINGLE_COLUMN"],"checkIn":"2024-09-15","checkOut":"2024-09-20"}}&extensions={"persistedQuery":{"version":1,"sha256Hash":"160265f6bdbacc2084cdf7de8641926c5ee141c3a2967dca0407ee47cec2a7d1"}}`,

      `https://www.airbnb.com/api/v3/StaysPdpReviewsQuery/dec1c8061483e78373602047450322fd474e79ba9afa8d3dbbc27f504030f91d?operationName=StaysPdpReviewsQuery&locale=en&currency=USD&variables={"id":"${encodedId}","pdpReviewsRequest":{"fieldSelector":"for_p3_translation_only","forPreview":false,"limit":10,"offset":"0","showingTranslationButton":false,"first":24,"sortingPreference":"RATING_DESC","checkinDate":"2024-09-19","checkoutDate":"2024-09-24"}}`,
    ].map((url) =>
      // axiosWithRetry.get<string>(url, {
      //   headers: {
      //     "x-airbnb-api-key": "d306zoyjsyarp7ifhu67rjxn52tv0t20",
      //   },
      // }),
      fetch(url, {}).then((r) => r.json()),
    ),
  ).then((r) => r.join("\n\n"));

  const { reviews, scrapedProperty } = await aiJson({
    prompt: `Extract listing data and reviews from the following data. For bodies of text like the about and rules sections, parse HTML/markdown as a plain string:\n\n${data}`,
    schema: airbnbScraperSchema,
  });

  const { location } = await getCoordinates(scrapedProperty.address);
    if (!location) throw new Error("Could not get coordinates for address");

  const city = await getCity({
    lat: location.lat,
    lng: location.lng,
  });

  const property = {
    ...scrapedProperty,
    city,
    address: city,
  };

  return { property, reviews };
}
