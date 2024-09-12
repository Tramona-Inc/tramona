import { getNumNights } from "@/utils/utils";
import { DirectSiteScraper, SubsequentScraper } from ".";
import * as cheerio from "cheerio";
import { v2 } from "@google-cloud/translate";
import { env } from "@/env";
import { ListingSiteName, PropertyType } from "../db/schema";
import { urlScrape } from "../server-utils";

const { Translate } = v2;

const translate = new Translate({ key: env.GOOGLE_MAPS_KEY });

async function translateText(
  text: string,
  targetLanguage = "en",
): Promise<string> {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Return original text if translation fails
  }
}

const propertyTypeMapping: Record<string, PropertyType> = {
  Apartment: "Apartment",
  Studio: "Apartment",
  Suite: "Apartment",
  Villa: "Villa",
  Twin: "Apartment",
  "Room in apartment": "Guest Suite",
  Double: "Apartment",
  Quadruple: "Apartment",
  Triple: "Apartment",
  Family: "Apartment",
  "Holiday home": "House",
};

const mapPropertyType = (type: string): PropertyType => {
  return propertyTypeMapping[type] ?? "Apartment";
};

// async function fetchWithRetry(
//   url: string,
//   retries = 3,
//   delayMs = 2000,
// ): Promise<{ text: string; url: string } | null> {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const response = await fetch(url);
//       if (response.ok) {
//         const text = await response.text();
//         return { text, url };
//       } else if (attempt < retries) {
//         await delay(delayMs); // Wait before retrying
//       } else {
//         console.error(`HTTP error! Status: ${response.status}`, url);
//         return null;
//       }
//     } catch (e) {
//       console.error(`Error fetching URL: ${url} on attempt ${attempt}`, e);
//       if (attempt === retries) {
//         return null; // Stop after max retries
//       }
//       await delay(delayMs); // Wait before retrying
//     }
//   }
//   return null;
// }

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function extractNumber(str: string): number {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

interface ScrapedData {
  name: string;
  description: string;
  url: string;
  address: {
    streetAddress: string;
  };
  city: string;
  latitude: number;
  longitude: number;
  numberOfRooms: number;
  amenityFeature:
  | {
    name: string;
  }[]
  | null;
  image: string[];
  containsPlace: {
    occupancy: {
      value: number;
    };
  };
}

interface PropertyInfo {
  id: string;
  url: string;
  city: string;
  address: string;
  maxOccupancy: string;
  maxBedrooms: number;
  maxBathrooms: number;
  name: string;
}

interface PropertyData {
  url: string;
  images: string[];
  address: string;
  city: string;
  name: string;
  description: string;
  max_occupancy_str: string;
  max_n_bedrooms_str: string;
  max_n_bathrooms_str: string;
}

interface JsonLdData {
  "@context": string;
  "@type": string;
}

function extractPrice($: cheerio.CheerioAPI): string {
  let price = "";
  $("div.min-price").each((_, element) => {
    const infoButton = $(element).find("a.infobutton");
    const dataContent = infoButton.attr("data-content");

    if (dataContent && dataContent === "Cancellazione non consentita") {
      const priceText = $(element).find("div.avgTotPriceRow").text().trim();
      price = priceText.replace("€", "").replace(",", ".").trim();
      return false; // Exit the loop once we find the matching element
    }
  });
  return price;
}

function extractCleaningFee($: cheerio.CheerioAPI): number {
  let priceService = 0;
  let foundMandatoryServicesRates = false;

  $("script").each((_, script) => {
    const scriptContent = $(script).html();

    if (
      scriptContent &&
      scriptContent.includes("var mandatory_services_rates")
    ) {
      foundMandatoryServicesRates = true;
    }

    if (
      foundMandatoryServicesRates &&
      scriptContent &&
      scriptContent.includes("mandatory_services_rates[")
    ) {
      try {
        const regex = /mandatory_services_rates\[\d+\]\s*=\s*(\[.*?\]);/s;
        const match = scriptContent.match(regex);

        if (match?.[1]) {
          const servicesData = JSON.parse(match[1]) as {
            price_service: number;
          }[];
          if (
            Array.isArray(servicesData) &&
            servicesData.length > 0 &&
            servicesData[0]
          ) {
            priceService = servicesData[0].price_service;
          }
        } else {
          console.log("No match found or match[1] is undefined");
        }
      } catch (e) {
        console.error("Error parsing price service data:", e);
      }
      return false; // Exit the loop once we find the matching script
    }
  });
  return priceService;
}

function extractCheckInCheckOutTime($: cheerio.CheerioAPI): {
  checkInTime: string | null;
  checkOutTime: string | null;
} {
  let checkInTime: string | null = null;
  let checkOutTime: string | null = null;

  // Find the check-in time
  $('.checkInOutBadge:contains("Check-in:")').each((_, element) => {
    const text = $(element).text().trim();
    const match = text.match(/Check-in:\s*(\d{2}:\d{2})/);
    if (match?.[1]) {
      checkInTime = match[1];
      return false; // Exit the loop once we find the check-in time
    }
  });

  // Find the check-out time
  $('.checkInOutBadge:contains("Check-out:")').each((_, element) => {
    const text = $(element).text().trim();
    const match = text.match(/Check-out:\s*(\d{2}:\d{2})/);
    if (match?.[1]) {
      checkOutTime = match[1];
      return false; // Exit the loop once we find the check-out time
    }
  });

  return { checkInTime, checkOutTime };
}

function extractTotalBeds($: cheerio.CheerioAPI): number {
  let totalBeds = 0;
  $(".apt-amenity").each((_, element) => {
    const amenity = $(element).text().trim();
    const bedMatches = amenity.match(/(\d+)\s*x\s*/i);

    if (bedMatches) {
      totalBeds += parseInt(bedMatches[1]!);
    }
  });
  return totalBeds;
}

const getAllProperties = async (baseUrl: string, checkInDate: string, checkOutDate: string) => {
  const $ = await urlScrape(`${baseUrl}?from=${checkInDate}&to=${checkOutDate}`);

  const scriptTags = $("script");

  const properties: PropertyInfo[] = [];

  // extract property URLs from script tags + additional data
  scriptTags.each((_, script) => {
    const scriptContent = $(script).html();
    if (scriptContent && scriptContent.includes('"url":')) {
      try {
        const idRegex = /additional_data\['apt-(\d+)'\]/;
        const idMatch = scriptContent.match(idRegex);
        const id = idMatch ? idMatch[1] : '';
        const jsonRegex = /{[^{}]*}/g;

        console.log("id:", id);
        let match;
        while ((match = jsonRegex.exec(scriptContent)) !== null) {
          try {
            // Ensure the base URL and correct query parameters are added
            const jsonString = match[0].replace(/\\"/g, '"').replace(/\\/g, "");
            const data = JSON.parse(jsonString) as PropertyData;

            if (data.url) {
              let url = "https://www.cleanbnb.house" + data.url.split("?")[0];
              url += `?from=${checkInDate}&to=${checkOutDate}`;

              if (data.url.split("?")[0]?.startsWith("/")) {
                const property: PropertyInfo = {
                  id: id ?? "",
                  url: url,
                  city: data.city || "",
                  address: data.address || "",
                  maxOccupancy: data.max_occupancy_str || "",
                  maxBedrooms: extractNumber(data.max_n_bedrooms_str || ""),
                  maxBathrooms: extractNumber(data.max_n_bathrooms_str || ""),
                  name: data.name || "",
                };
                properties.push(property);
              } else {
                console.log("skipping url:", url);
              }
            }
          } catch (innerError) {
            console.error(
              "Error processing individual URL:",
              match[0],
              "Error:",
              innerError,
            );
          }
        }
      } catch (outerError) {
        console.error("Error extracting URLs from script content:", outerError);
      }
    }
  });
  return properties;
}

export const cleanbnbScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  numOfOffersInEachScraper,
  numGuests,
}) => {
  const checkInDate = formatDate(checkIn);
  const checkOutDate = formatDate(checkOut);

  const res: Awaited<ReturnType<DirectSiteScraper>> = [];
  const baseUrl = numGuests
    ? `https://www.cleanbnb.house/it/appartamenti?guests_rooms=${encodeURIComponent(`${numGuests},0;`)}`
    : "https://www.cleanbnb.house/it/appartamenti";

  const properties = await getAllProperties(baseUrl, checkInDate, checkOutDate);

  // Fetch data from all URLs concurrently
  const fetchedData = await Promise.allSettled(
    properties.map(async (property) => urlScrape(property.url)),
  );
  const validData = fetchedData.filter((data) => data.status === "fulfilled").map((data) => data.value);

  // Process the fetched data
  for (const $ of validData) {

    const jsonLdScripts = $('script[type="application/ld+json"]');

    // Process each script tag
    const jsonLdData = jsonLdScripts
      .map((_, script) => {
        const scriptContent = $(script).html()?.trim(); // Extract script content and trim whitespace
        if (scriptContent) {
          try {
            // Parse JSON content
            return JSON.parse(scriptContent);
          } catch (e) {
            console.error("Error parsing JSON from script content:", e);
            return null;
          }
        }
        return null;
      })
      .get() as JsonLdData[];

    // Grab the specific JSON-LD data object we need
    const info = jsonLdData.filter(
      (data) =>
        data.hasOwnProperty("@type") && data["@type"] === "VacationRental",
    );
    if (info[0] === undefined) {
      // This hits a lot, 429 errors
      continue;
    }
    const scrapedData = info[0] as unknown as ScrapedData;

    const price = extractPrice($);
    const cleaningFee = extractCleaningFee($);
    const { checkInTime, checkOutTime } = extractCheckInCheckOutTime($);
    const extractedPropertyType = $(".apt-address span").text().trim();
    const propertyType = mapPropertyType(
      await translateText(extractedPropertyType),
    );
    const totalBeds = extractTotalBeds($);

    // This is not working rn - also only fixes a few cases so might not be worth it
    const normalizeString = (str: string) => {
      if (str) {
        return str
          .normalize("NFKC")
          .replace(/\u00a0/g, " ")
          .trim();
      }
    };

    const property = properties.filter(
      (property) => property.url.split("?")[0] === scrapedData.url,
    )[0]
      ? properties.filter(
        (property) => property.url.split("?")[0] === scrapedData.url,
      )[0]
      : properties.filter(
        (property) =>
          normalizeString(property.name) ===
          normalizeString(scrapedData.name),
      )[0];

    if (property === undefined) {
      if (info.length > 0) {
        // This is the case that isnt hit very frequently
        console.log("GGGGGGGGGGGG; ", scrapedData.name);
      } else {
        console.log("Property not found:", info);
      }
      continue;
    }
    let amenities;

    const name = await translateText(scrapedData.name);
    const about = await translateText(scrapedData.description);
    const address = property.address;
    const city = property.city;
    // const latitude = scrapedData.latitude;
    // const longitude = scrapedData.longitude;
    const maxNumGuests = scrapedData.containsPlace.occupancy.value;
    const originalListingId = property.id;
    const numBeds = totalBeds;
    const numBedrooms = property.maxBedrooms;
    const numBathrooms = property.maxBathrooms;
    try {
      if (scrapedData.amenityFeature && scrapedData.amenityFeature.length > 0) {
        amenities = await Promise.all(
          scrapedData.amenityFeature.map(async (amenity) =>
            translateText(amenity.name),
          ),
        );
      } else {
        amenities = [];
      }
    } catch (error) {
      console.error("Error translating amenities:", error);
    }
    const imageUrls = scrapedData.image;
    const originalListingUrl = property.url;
    const originalNightlyPrice =
      parseFloat(price) + cleaningFee / getNumNights(checkIn, checkOut);


    res.push({
      name,
      about,
      address,
      city,
      maxNumGuests,
      numBeds,
      numBedrooms,
      numBathrooms,
      amenities,
      imageUrls,
      originalListingUrl,
      originalNightlyPrice,
      originalListingId,
      propertyType,
      checkInTime,
      checkOutTime,
      currency: "EUR",
      cancellationPolicy: "Non-refundable",
      reviews: [],
      scrapeUrl: baseUrl,
      originalListingPlatform: "Cleanbnb" as ListingSiteName,
    });
  }
  return numOfOffersInEachScraper ? res.splice(0, numOfOffersInEachScraper) : res;
};

export const cleanbnbSubScraper: SubsequentScraper = async ({
  checkIn,
  checkOut,
  scrapeUrl,
  originalListingId,
}) => {
  const checkInDate = formatDate(checkIn);
  const checkOutDate = formatDate(checkOut);
  const properties = await getAllProperties(scrapeUrl, checkInDate, checkOutDate);

  // extract property URLs from script tags + additional data
  const matchingProperty = properties.filter(
    (property) => property.id === originalListingId,
  )[0];

  if (!matchingProperty) {
    return {
      isAvailableOnOriginalSite: false,
      availabilityCheckedAt: new Date(),
    };
  }
  const scrapedMatchingProperty = await urlScrape(matchingProperty.url);
  const price = extractPrice(scrapedMatchingProperty);
  const cleaningFee = extractCleaningFee(scrapedMatchingProperty);
  return {
    originalNightlyPrice: (parseFloat(price) + cleaningFee) / getNumNights(checkIn, checkOut),
    isAvailableOnOriginalSite: true,
    availabilityCheckedAt: new Date(),
  };
}