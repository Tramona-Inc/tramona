import { ListingSiteUrlParams } from "@/utils/listing-sites";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { urlScrape } from "./server-utils";

// TODO: add support for other listing sites
export async function scrapeAirbnbPrice({
  airbnbListingId,
  params,
}: {
  airbnbListingId: string;
  params: ListingSiteUrlParams;
}) {
  const checkoutUrl =
    Airbnb.createListing(airbnbListingId).getCheckoutUrl(params);
  const $ = await urlScrape(checkoutUrl);
  const jsonStr = $("#data-deferred-state-0").text();
  const priceRegex =
    /"priceBreakdown":.*"total":.*"total":.*"amountMicros":"(\d+)"/;

  const match = jsonStr.match(priceRegex);

  if (!match?.[1])
    throw new Error(
      "Unable to retrieve the Airbnb price. The property may have already been booked, or the minimum stay requirements may not be met:",
    );

  // "amountMicros" are ten-thousands of cents (e.g. $100 <-> 100,000,000)
  return Math.round(Number(match[1]) / 10000);
}
