import { MinimalRequest, NewProperty } from "../db/schema";
import { scrapeUrl } from "../server-utils";
import { z } from "zod";
import { getNumNights, parseCurrency } from "@/utils/utils";
import { sortBy } from "lodash";
import { scrapeAirbnbListing } from "./scrapeAirbnbListing";

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

  return await Promise.allSettled(
    sortedListings.map(
      async ({ originalListingId, nightlyPrice, originalNightlyPrice }) => {
        const { property, reviews } =
          await scrapeAirbnbListing(originalListingId);

        const completeProperty: NewProperty = {
          ...property,
          originalNightlyPrice,
          originalListingId,
          originalListingPlatform: "Airbnb",
          originalListingUrl: `https://www.airbnb.com/rooms/${originalListingId}`,
          airbnbUrl: `https://www.airbnb.com/rooms/${originalListingId}`,
          bookOnAirbnb: true,
        };

        return {
          property: completeProperty,
          reviews,
          nightlyPrice,
        };
      },
    ),
  ).then((r) => r.filter((r) => r.status === "fulfilled").map((r) => r.value));
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

  const ret = await scrapeUrl(url)
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
      ? Math.round(parseCurrency(discountedPriceStr) / numNights)
      : undefined;

    const originalPriceStr =
      pricingQuote.structuredStayDisplayPrice.primaryLine.originalPrice;

    const originalNightlyPrice = originalPriceStr
      ? Math.round(parseCurrency(originalPriceStr) / numNights)
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
