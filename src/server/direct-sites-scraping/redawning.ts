// curl 'https://api.redawning.com/v1/propertycollections/1503/listings' \
//   -H 'x-api-key: ehMtnGSw4i7dFqngWo8M15cWaqzKPM4V2jeU3zty'
import { scrapeUrlLikeHuman } from "@/server/server-utils";
import { DirectSiteScraper, ScrapedListing, SubsequentScraper } from ".";
import { z } from "zod";
import { axiosWithRetry } from "@/server/server-utils";
import { formatDateYearMonthDay, getNumNights, parseHTML } from "@/utils/utils";
import {
  PropertyType,
  ListingSiteName,
  ALL_PROPERTY_TYPES,
} from "@/server/db/schema/common";
import { CancellationPolicyWithInternals } from "../db/schema/tables/properties";
import { log } from "@/pages/api/script";
import { googleMaps } from "../google-maps";
import { env } from "@/env";
import axios from "axios";

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
    cancellationPolicy: z.string().nullable().optional(),
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

const cancellationPolicySchema = z.object({
  deposit_percentage: z.number(),
  balance_due_days: z.number(),
  offset_days: z.number(), // number of days before arrival to apply policy
});

const propertyTypeMapping: Record<string, PropertyType> = {
  Home: "House",
  Condo: "Condominium",
  Suite: "Guest Suite",
  Apts: "Apartment",
  "Hotel Room": "Hotel",
};

const mapPropertyType = (originalType: string): PropertyType => {
  if (ALL_PROPERTY_TYPES.includes(originalType)) {
    return originalType as PropertyType;
  }
  if (propertyTypeMapping[originalType]) {
    return propertyTypeMapping[originalType];
  } else {
    console.error("RedAwning scraper - Unknown property type: ", originalType);
    return "Other";
  }
};

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

function ensureHttps(url: string): string {
  if (url.startsWith("http:")) {
    return url.replace("http:", "https:");
  }
  return url; // Return the original URL if it's already 'https:'
}

function extractAmenities(htmlString: string): string[] {
  // Decode any escaped characters (e.g., `\/` to `/`)
  const decodedHtml = htmlString.replace(/\\\//g, "/");

  // Use a regular expression to capture the text inside <li> tags
  const amenitiesList = [...decodedHtml.matchAll(/<li.*?>(.*?)<\/li>/g)];
  // Map over the matches and extract the content inside <li> tags
  const amenities = amenitiesList
    .map((match) => {
      if (match[1]) {
        return match[1] // Extract the content inside <li> tags
          .replace(/<.*?>/g, "") // Remove any remaining HTML tags (like <i> or <span>)
          .trim();
      }
      return ""; // Return an empty string if match[1] is undefined
    })
    .filter(Boolean); // Filter out any empty strings

  return amenities;
}

export const mapTaxodataToScrapedListing = async (
  taxodata: z.infer<typeof taxoDataSchema>,
  checkIn: Date,
  checkOut: Date,
): Promise<ScrapedListing[]> => {
  return await Promise.all(
    taxodata.map(async (property) => {
      // scrape the property page
      const safeUrl = ensureHttps(property.url);
      const $ = await scrapeUrlLikeHuman(safeUrl);

      // Scrape the "Sleeps 12" from the HTML
      const propDetails = $(".qb-prop-details").text();
      const sleepsMatch = propDetails.match(/Sleeps\s(\d+)/);
      const maxNumGuests = sleepsMatch
        ? sleepsMatch[1]
          ? parseInt(sleepsMatch[1])
          : 0
        : 0;
      const locationMatch = propDetails.match(/([A-Za-z\s]+,\s[A-Z]{2})/);
      const city = locationMatch?.[1]?.trim();

      if (!city) {
        throw new Error(`Failed to find city for property: ${property.pid}`);
      }

      const typeElement = $(".property-quick-info li .fas.fa-home").parent(); // Navigate to the parent element of the <i> tag (the <span> containing "Home")
      let originalType = "";
      // Check if there is a span with the class "quick-info-value details-label" (e.g. "Home")
      const homeLabel = typeElement
        .find(".quick-info-value.details-label")
        .text()
        .trim();
      // Check if there is an additional <span> after "1,100 Sq. Ft." ("Condo" in the next span)
      const additionalLabel = typeElement
        .find("span:not(.details-label)")
        .last()
        .text()
        .trim();

      if (additionalLabel) {
        originalType = additionalLabel;
      } else if (homeLabel) {
        originalType = homeLabel;
      }

      const imageUrls: string[] = [];
      const imageElements = $("input.pswpImages");
      imageElements.each((index, element) => {
        if (imageUrls.length < 10) {
          // Limit the number of images to 10
          const imageUrl = $(element).attr("value");
          if (imageUrl) {
            imageUrls.push(imageUrl); // Add the URL to the array
          }
        }
      });
      const metaDescription = $('meta[property="og:description"]').attr(
        "content",
      );
      const description = metaDescription ? metaDescription : "";

      const scriptContent = $("script")
        .toArray()
        .find((script) => $(script).html()!.includes("show_all_amenities"));

      let amenities: string[] = [];
      if (scriptContent) {
        const scriptText = $(scriptContent).html();
        const amenitiesMatch = scriptText?.match(
          /"show_all_amenities":"(.*?)","/,
        );
        if (amenitiesMatch?.[1]) {
          const showAllAmenities = amenitiesMatch[1];
          // Decode HTML entities and parse the amenities
          const decodeHtmlEntities = (str: string) => {
            return str
              .replace(/\\u003C/g, "<")
              .replace(/\\u0022/g, '"')
              .replace(/\\u003E/g, ">")
              .replace(/\\u002F/g, "/");
          };
          const decodedAmenities = decodeHtmlEntities(showAllAmenities);
          // Use regex to extract the text between <li> and </li> tags
          amenities = extractAmenities(decodedAmenities);
        } else {
          console.error("No amenities found");
        }
      }
      return {
        originalListingId: property.pid.toString(),
        name: property.title,
        about: parseHTML(description),
        propertyType: mapPropertyType(originalType),
        address: city, // cannot find detailed address in the website
        city: city,
        latLngPoint: {
          lng: parseFloat(property.longitude),
          lat: parseFloat(property.latitude),
        },
        maxNumGuests: maxNumGuests,
        numBeds: property.bedrooms,
        numBedrooms: property.bedrooms,
        numBathrooms: property.bathrooms,
        amenities: amenities,
        otherAmenities: [],
        imageUrls: imageUrls,
        originalListingUrl: safeUrl,
        avgRating: 0, // cannot find rating in the website
        numRatings: 0, // cannot find rating in the website
        originalListingPlatform: "RedAwning" as ListingSiteName,
        reservedDateRanges: [
          {
            start: checkIn,
            end: checkOut,
          },
        ],
        originalNightlyPrice:
          property.totalPrice && getNumNights(checkIn, checkOut) > 0
            ? Math.round(property.totalPrice / getNumNights(checkIn, checkOut))
            : 0,
        reviews: [], // looks like there are no reviews in this website
        scrapeUrl: safeUrl,
        cancellationPolicy:
          property.cancellationPolicy as CancellationPolicyWithInternals,
      };
    }),
  );
};

export const redawningScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  requestNightlyPrice,
  location,
  latitude,
  longitude,
}) => {
  const result = await googleMaps
    .geocode({
      params: { address: location, key: env.GOOGLE_MAPS_KEY },
    })
    .then((res) => res.data.results[0]);

  if (!result) {
    throw new Error(`Failed to geocode location: ${location}`);
  }

  const lat = result.geometry.location.lat;
  const lng = result.geometry.location.lng;

  const ptype = result.types.find(
    (type) =>
      !["political", "point_of_interest", "establishment"].includes(type),
  );

  if (!ptype) {
    throw new Error(
      `Failed to find a valid property type for location "${location}"`,
    );
  }

  const pcountry = result.address_components.find((c) =>
    c.types.includes("country"),
  )?.short_name;

  if (!pcountry) {
    throw new Error(
      `Failed to find a valid country for location "${location}" `,
    );
  }

  const url = `https://www.redawning.com/search/properties?ptype=${ptype}&platitude=${lat}&plongitude=${lng}&pcountry=${pcountry}&pname=${location}&sleepsmax=1TO100&dates=${convertToEpochAt7AM(checkIn)}TO${convertToEpochAt7AM(checkOut)}`;

  log(`url: ${url}`);

  const $ = await scrapeUrlLikeHuman(url);

  // Find the script containing 'taxodata' and parse its contents
  const scriptContent = $("script")
    .toArray()
    .find((script) => $(script).html()!.includes("var taxodata"))!;

  const scriptText = $(scriptContent).html();
  if (scriptText === 'var taxodata = "";') {
    return [];
  }

  const dataStart = scriptText!.indexOf("[{");
  const dataEnd = scriptText!.lastIndexOf("}]") + 2;
  const taxoDataJsonString = scriptText!.substring(dataStart, dataEnd);

  let taxodata = taxoDataSchema
    .parse(JSON.parse(taxoDataJsonString))
    .slice(0, 25);

  const numOfNights = getNumNights(checkIn, checkOut);
  if (taxodata.length === 0) {
    return [];
  }
  if (taxodata.length > 0) {
    const processedTaxoData = await Promise.all(
      taxodata.map(async (property) => {
        try {
          // const propertyUrl = property.url;
          const propertyId = property.pid;
          const priceQuoteUrl = `https://api.redawning.com/v1/listings/${propertyId}/quote?checkin=${formatDateYearMonthDay(checkIn)}&checkout=${formatDateYearMonthDay(checkOut)}&numadults=1&numchild=0&travelinsurance=false`;
          const priceQuote = await axios
            .get<string>(priceQuoteUrl, {
              headers: {
                "x-api-key": "ehMtnGSw4i7dFqngWo8M15cWaqzKPM4V2jeU3zty",
              },
              timeout: 10000,
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
          property.totalPrice = priceQuote.totalPrice;

          const cancellationPolicyUrl = `https://www.redawning.com/cancellation-policy-details?nid=${propertyId}&arrival_date=${formatDateYearMonthDay(checkIn)}`;
          const dayOffsetForFullRefund = await axios
            .get<string>(cancellationPolicyUrl, {
              timeout: 10000,
            })
            .then((response) => response.data)
            .then((data) => cancellationPolicySchema.parse(data))
            .then((c) => {
              return c.offset_days;
            });
          // all the RedAwning properties I've checked so far have a full refund deadline of either 7 or 14 days
          if (dayOffsetForFullRefund <= 7) {
            property.cancellationPolicy = "RedAwning 7 Days";
          } else if (dayOffsetForFullRefund <= 14) {
            property.cancellationPolicy = "RedAwning 14 Days";
          } else {
            property.cancellationPolicy = "Non-refundable";
          }

          return property;
        } catch (error) {
          console.error(
            `Skip RedAwning property: ${property.pid}, as failed to fetch price or cancellation policy.`,
          );
          return null;
        }
      }),
    );
    taxodata = processedTaxoData.filter((property) => property !== null);
  } else {
    console.error("RedAwning scraper: No available properties found");
  }

  const listings = await mapTaxodataToScrapedListing(
    taxodata,
    checkIn,
    checkOut,
  );

  return listings;
};

export const redawningSubScraper: SubsequentScraper = async ({
  originalListingId,
  scrapeUrl,
  checkIn,
  checkOut,
}) => {
  const priceQuoteUrl = `https://api.redawning.com/v1/listings/${originalListingId}/quote?checkin=${formatDateYearMonthDay(checkIn)}&checkout=${formatDateYearMonthDay(checkOut)}&numadults=1&numchild=0&travelinsurance=false`;
  try {
    const priceQuote = await axios
      .get<string>(priceQuoteUrl, {
        headers: {
          "x-api-key": "ehMtnGSw4i7dFqngWo8M15cWaqzKPM4V2jeU3zty",
        },
      })
      .then((response) => response.data)
      .then((data) => priceQuoteSchema.parse(data))
      .then((quote) => {
        const totalPrice = quote.payment_schedule.reduce(
          (acc, curr) => acc + curr.amount,
          0,
        );
        const formattedTotalPrice = Math.ceil(totalPrice * 100); // to cents
        return { ...quote, totalPrice: formattedTotalPrice };
      });
    const originalNightlyPrice = priceQuote.totalPrice
      ? Math.round(priceQuote.totalPrice / getNumNights(checkIn, checkOut))
      : undefined;

    return {
      originalNightlyPrice: originalNightlyPrice,
      isAvailableOnOriginalSite: priceQuote.status === "success",
      availabilityCheckedAt: new Date(),
    };
  } catch (error) {
    console.error(
      "This listing is already booked for days you have selected, or unavailable for other reasons.",
    );
    return {
      isAvailableOnOriginalSite: false,
      availabilityCheckedAt: new Date(),
    };
  }
};
