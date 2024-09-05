// curl 'https://api.redawning.com/v1/propertycollections/1503/listings' \
//   -H 'x-api-key: ehMtnGSw4i7dFqngWo8M15cWaqzKPM4V2jeU3zty'
import { scrapeUrl } from "@/server/server-utils";
import { DirectSiteScraper, SubsequentScraper } from ".";
import { z } from "zod";
import axios from "axios";
import { axiosWithRetry } from "@/server/server-utils";
import { formatDateYearMonthDay, getNumNights } from "@/utils/utils";
import { get } from "lodash";

const taxoDataSchema = z.array(
  z.object({
    pid: z.number(),
    title: z.string(),
    price: z.string(),
    bathrooms: z.number(),
    bedrooms: z.number(),
    urlimage: z.string(),
    url: z.string(),
    region: z.string(),
    content: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    list: z.string(),
    position: z.number(),
    totalPrice: z.number().nullable().optional(),
  }),
);

const priceQuoteSchema = z.object({
  quote_id: z.string(),
  listing_id: z.string(),
  quote_expiration: z.number(), // UNIX epoch time
  rental_price: z.number(),
  original_rental_price: z.number(),
  tax: z.number(),
  original_tax: z.number(),
  cleaning_fee: z.number(),
  service_fee: z.number(),
  num_adults: z.number(),
  num_children: z.number(),
  currency: z.string(),
  checkin_date: z.string(),
  checkout_date: z.string(),
  travel_insurance: z.number(),
  deposit_percent: z.number(),
  min_stay: z.number(),
  max_stay: z.number().nullable(),
  status: z.string(),
  status_message: z.string().nullable(),
  applied_fees: z.array(z.unknown()),
  payment_schedule: z.array(
    z.object({
      due_date: z.string(),
      amount: z.number(),
      description: z.string(),
    }),
  ),
  fee_details: z.array(z.unknown()),
});

function convertToEpochAt7AM(date: Date): number {
  // Create a new Date object with the same year, month, and day at 7 AM UTC
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  // Setting 7 AM UTC
  const dateAt7AMUTC = new Date(Date.UTC(year, month, day, 7, 0, 0));

  // Return the UNIX epoch time in seconds
  return Math.floor(dateAt7AMUTC.getTime() / 1000);
}
interface ScraperParams {
  checkIn: Date;
  checkOut: Date;
  numOfOffersInEachScraper?: number;
}
// currently just scrape UnclaimedOffers
export const redawningScraper = async ({
  // :DirectSiteScraper
  checkIn,
  checkOut,
  numOfOffersInEachScraper = 5,
}: ScraperParams) => {
  const url = `https://www.redawning.com/search/properties?ptype=country&platitude=38.7945952&plongitude=-106.5348379&pcountry=US&pname=United%20States&sleepsmax=1TO100&dates=${convertToEpochAt7AM(checkIn)}TO${convertToEpochAt7AM(checkOut)}`;
  console.log("scrapedRedawningUrl: ", url);
  const $ = await scrapeUrl(url);
  let taxodata = [];

  // Find the script containing 'taxodata' and parse its contents
  const scriptContent = $("script")
    .toArray()
    .find((script) => $(script).html()!.includes("var taxodata"));
  if (scriptContent) {
    const scriptText = $(scriptContent).html();
    const dataStart = scriptText!.indexOf("[{");
    const dataEnd = scriptText!.lastIndexOf("}]") + 2;
    const taxoDataJsonString = scriptText!.substring(dataStart, dataEnd);
    const taxoDataJson = JSON.parse(taxoDataJsonString);
    const taxoDataOg = taxoDataSchema.parse(taxoDataJson);
    taxodata.push(...taxoDataOg.slice(0, numOfOffersInEachScraper));
  }
  const numOfNights = getNumNights(checkIn, checkOut);
  if (taxodata.length > 0) {
    await Promise.all(
      taxodata.map(async (property) => {
        const propertyUrl = property.url;
        const propertyId = property.pid;
        const priceQuoteUrl = `https://api.redawning.com/v1/listings/${propertyId}/quote?checkin=${formatDateYearMonthDay(checkIn)}&checkout=${formatDateYearMonthDay(checkOut)}&numadults=1&numchild=0&travelinsurance=false`;
        const priceQuote = await axiosWithRetry
          .get<string>(priceQuoteUrl, {
            headers: {
              "x-api-key": "ehMtnGSw4i7dFqngWo8M15cWaqzKPM4V2jeU3zty",
            },
          })
          .then((response) => response.data)
          .then((data) => priceQuoteSchema.parse(data))
          .then((quote) => {
            if (numOfNights < quote.min_stay) {
              console.log(
                `Property ${propertyId} requires a minimum stay of ${quote.min_stay} nights. Your stay is ${numOfNights} nights.`,
              );
              return { ...quote, totalPrice: null };
            }
            const totalPrice = quote.payment_schedule.reduce(
              (acc, curr) => acc + curr.amount,
              0,
            );
            const formattedTotalPrice = Math.ceil(totalPrice * 100); // to cents
            return { ...quote, totalPrice: formattedTotalPrice };
          });
        // console.log(
        //   "pid: ",
        //   property.pid,
        //   "total price: ",
        //   priceQuote.totalPrice,
        // );
        property.totalPrice = priceQuote.totalPrice;
      }),
    );
  } else {
    console.error("No available properties found");
  }
  //   console.log(response);
  return taxodata;
};
