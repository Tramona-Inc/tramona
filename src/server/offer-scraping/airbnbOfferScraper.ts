import { type OfferScraper } from ".";
import { scrapeUrl } from "../server-utils";

export const airbnbOfferScraper: OfferScraper = async (request) => {
  const serpUrl = `https://www.airbnb.com/s/?query=${request.location}&checkin=${request.checkIn.toISOString().split("T")[0]}&checkout=${request.checkOut.toISOString().split("T")[0]}&adults=${request.numGuests}`;

  const $ = await scrapeUrl(serpUrl);

  return [];
};
