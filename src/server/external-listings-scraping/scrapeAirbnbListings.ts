import { type ExternalListingScraper } from ".";
import { ExternalListing, ListingSiteName, MinimalRequest } from "../db/schema";
import { scrapeUrl } from "../server-utils";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { getNumNights, parseCurrency } from "@/utils/utils";

export const scrapeAirbnbListings: ExternalListingScraper = async (request) => {
  const serpUrl = getSerpUrl({ request });

  const pageData = await scrapePage(serpUrl).then((unparsedData) =>
    serpPageSchema.parse(unparsedData),
  );

  const cursors = pageData.staysSearch.results.paginationInfo.pageCursors;
  const pageUrls = cursors.map((cursor) => getSerpUrl({ request, cursor }));
  const pages = await Promise.all(pageUrls.map(scrapePage));

  const numNights = getNumNights(request.checkIn, request.checkOut);

  return pages
    .map((page) => serpPageSchema.parse(page))
    .flatMap((data) => data.staysSearch.results.searchResults)
    .map((searchResult) => transformSearchResult({ searchResult, numNights }))
    .filter(
      (listing): listing is ExternalListing =>
        listing.nightlyPrice !== undefined &&
        listing.originalNightlyPrice !== undefined,
    );
};

function getSerpUrl({
  request,
  priceRange,
  cursor,
}: {
  request: MinimalRequest;
  priceRange?: { minUSD: number; maxUSD: number };
  cursor?: string;
}) {
  const checkInStr = request.checkIn.toISOString().split("T")[0]!;
  const checkOutStr = request.checkOut.toISOString().split("T")[0]!;

  const url = new URL(`https://www.airbnb.com/s`);

  url.searchParams.set("currency", "USD");
  url.searchParams.set("query", request.location);
  url.searchParams.set("checkin", checkInStr);
  url.searchParams.set("checkout", checkOutStr);
  url.searchParams.set("adults", request.numGuests.toString());

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

  await writeFile("airbnb-page-data.json", JSON.stringify(ret, null, 2));

  return ret;
}

const serpPageSchema = z.object({
  staysSearch: z.object({
    results: z.object({
      paginationInfo: z.object({ pageCursors: z.string().array() }),
      searchResults: z.array(
        z.object({
          listing: z.object({
            contextualPictures: z
              .array(z.object({ picture: z.string() }))
              .nonempty(),
            name: z.string(),
            title: z.string(),
            id: z.string(),
          }),
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
  searchResult,
  numNights,
}: {
  searchResult: SearchResult;
  numNights: number;
}) {
  {
    const discountedPriceStr =
      searchResult.pricingQuote.structuredStayDisplayPrice.primaryLine
        .discountedPrice;

    const nightlyPrice = discountedPriceStr
      ? parseCurrency(discountedPriceStr) / numNights
      : undefined;

    const originalPriceStr =
      searchResult.pricingQuote.structuredStayDisplayPrice.primaryLine
        .originalPrice;

    const originalNightlyPrice = originalPriceStr
      ? parseCurrency(originalPriceStr) / numNights
      : undefined;

    return {
      title: searchResult.listing.title,
      url: `https://www.airbnb.com/rooms/${searchResult.listing.id}`,
      description: searchResult.listing.name,
      listingSite: "Airbnb" as ListingSiteName,
      imageUrl: searchResult.listing.contextualPictures[0].picture,
      nightlyPrice,
      originalNightlyPrice,
    };
  }
}
