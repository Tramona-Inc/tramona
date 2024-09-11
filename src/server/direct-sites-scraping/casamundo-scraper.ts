import {
  DirectSiteScraper,
  SubsequentScraper,
  ScrapedListing,
} from "@/server/direct-sites-scraping";
import { Review } from "@/server/db/schema";
import axios from "axios";
import { z } from "zod";
import { PropertyType } from "@/server/db/schema/common";
import { ListingSiteName } from "@/server/db/schema/common";
import { getNumNights } from "@/utils/utils";
import { getCoordinates } from "../google-maps";

const offerSchema = z.object({
  id: z.string(),
  geoLocation: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
});

type CasamundoOffer = z.infer<typeof offerSchema>;

const mapPropertyType = (type: string): PropertyType => {
  switch (type.toLowerCase()) {
    case "house":
      return "House";
    case "accommodation":
      return "Other";
    default:
      return "Other";
  }
};

async function getLocationId(location: string): Promise<string> {
  const autocompleteUrl = "https://www.casamundo.com/api/v2/autocomplete";
  const params = new URLSearchParams({
    q: location,
    limit: "10",
  });

  try {
    const response = await axios.get(`${autocompleteUrl}?${params.toString()}`);
    const suggestions = response.data.suggestions;
    console.log("Casamundo location suggestions:", suggestions);

    if (suggestions.length > 0) {
      // Split the input location into parts
      const locationParts = location
        .toLowerCase()
        .split(",")
        .map((part) => part.trim());

      // Function to score a suggestion based on how well it matches the input
      const scoreMatch = (suggestion) => {
        const fullTitle = suggestion.fullTitle.toLowerCase();
        const trail = suggestion.trail.toLowerCase();
        let score = 0;

        // Exact match for full title gets highest score
        if (fullTitle === locationParts[0]) {
          score += 100;
        } else if (fullTitle.includes(locationParts[0])) {
          score += 50;
        }

        // Check if all parts of the input location are present in either the fullTitle or trail
        if (
          locationParts.every(
            (part) => fullTitle.includes(part) || trail.includes(part),
          )
        ) {
          score += 25;
        }

        // Penalize for additional words in the title (to prefer general over specific)
        score -= fullTitle.split(" ").length;

        return score;
      };

      // Find the suggestion with the highest score
      const bestMatch = suggestions.reduce(
        (best, current) => {
          const currentScore = scoreMatch(current);
          return currentScore > best.score
            ? { suggestion: current, score: currentScore }
            : best;
        },
        { suggestion: null, score: -Infinity },
      ).suggestion;

      if (bestMatch) {
        console.log("Found best match:", bestMatch);
        return bestMatch.id;
      }

      // If no best match, use the first suggestion
      console.log("Using first suggestion:", suggestions[0]);
      return suggestions[0].id;
    } else {
      throw new Error("No location found");
    }
  } catch (error) {
    console.error("Error fetching location ID:", error);
    throw error;
  }
}

async function getOfferIds(
  locationId: string,
  checkIn: Date,
  checkOut: Date,
  numOffers: number,
): Promise<CasamundoOffer[]> {
  const url = `https://www.casamundo.com/search/${locationId}`;

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua":
      '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
  };

  const params = new URLSearchParams({
    fieldTreeId: "SearchDetailsFields.SERP",
    adults: "2",
    arrival: checkIn.toISOString().split("T")[0],
    duration: getNumNights(checkIn, checkOut).toString(),
    _format: "json",
  });

  // Make the initial GET request to fetch the offer IDs
  try {
    console.log(
      "Making initial GET request to:",
      `${url}?${params.toString()}`,
    );
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers,
    });

    const offers = response.data.offers;

    const parsedOffers = offers.map((offer: any) => offerSchema.parse(offer));
    // console.log("done parsing offers", parsedOffers);
    return parsedOffers;
    // Process the parsed offers and return the results
  } catch (error) {
    console.error("Error fetching offer IDs:", error);
    throw error;
  }
}

async function checkAvailability(
  offerId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<boolean> {
  const months = new Set();
  let currentDate = new Date(checkIn);
  while (currentDate <= checkOut) {
    months.add(
      `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`,
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }

  for (const month of months) {
    const [year, monthNum] = month.split("-");
    const url = `https://www.casamundo.com/api/v2/calendar/${offerId}?year=${year}&month=${monthNum}`;

    try {
      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
        },
      });

      const { days } = response.data.content;

      currentDate = new Date(checkIn);
      while (currentDate <= checkOut) {
        const dateString = currentDate.toISOString().split("T")[0];
        if (days[dateString] !== 2) {
          return false; // Not available for this date
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } catch (error) {
      console.error(
        `Error fetching availability for ${offerId} in ${month}:`,
        error,
      );
      return false; // Assume not available if there's an error
    }
  }

  return true; // Available for all dates
}

interface PriceDetails {
  totalPrice: number;
  pricePerNight: number;
  currency: string;
}

async function fetchPropertyPrice(
  offerId: string,
  checkIn: string,
  duration: number,
  adults: number,
  children: number,
  pets: number,
  location: string,
  clickId: string,
): Promise<PriceDetails | null> {
  const baseUrl = `https://www.casamundo.com/booking/checkout/priceDetails/${offerId}`;

  // Generate a timestamp
  const timestamp = Math.floor(Date.now() / 1000);

  const params = new URLSearchParams({
    sT: "withDates",
    clickId: clickId,
    pCon: `829.73|USD|${checkIn}|${duration}|${adults}|${timestamp}|${children}|${pets}|${timestamp - 156163}|2|0|0|93|502.85|0`,
    adults: `${adults}`,
    children: `${children}`,
    pets: `${pets}`,
    arrival: checkIn,
    duration: `${duration}`,
    location: location,
    pricetype: "perNight",
    bounds: "37.94885,-122.68652;37.56613,-122.18733",
    isExtrasTouched: "0",
    action: "pageOpen",
    pageType: "details",
    isCachedPaymentMethods: "true",
    offerId: offerId,
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await axios.post(url, null, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua":
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        // 'sec-ch-ua-platform': '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        // 'Referer': `https://www.casamundo.com/rental/${offerId}?${params.toString()}`,
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
    });

    if (response.data.hasErrors) {
      console.error(
        "Error fetching price details:",
        response.data.errorMessage,
      );
      return null;
    }

    const priceDetails = response.data.content?.priceDetails;
    // if (!priceDetails || !priceDetails.travelPrice || !priceDetails.nightPrice) {
    //   console.error('Unexpected response structure:', response.data);
    //   return null;
    // }

    return {
      totalPrice: priceDetails.travelPrice.raw,
      pricePerNight: priceDetails.nightPrice.raw,
      currency: priceDetails.currency,
    };
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
}

async function fetchPropertyDetails(
  offerId: string,
  checkIn: string,
  checkOut: string,
  adults: number,
  location: string,
  clickId: string,
): Promise<ScrapedListing> {
  const url = `https://www.casamundo.com/rental/offer/${offerId}`;


  const params = new URLSearchParams({
    adults: adults.toString(),
    arrival: checkIn,
    duration: "5",
    location: location,
    persons: adults.toString(),
    pricetype: "perNight",
    prodName: "JM",
    prodSource: "Search",
    sT: "withDates",
    screen: "search",
  });

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua":
      '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "Referrer-Policy": "no-referrer-when-downgrade",
  };

  try {
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers,
    });
    const data = response.data;
    // console.log('Raw API response:', JSON.stringify(data, null, 2));
    const amenities =
      data.infoGroups
        .find((group) => group.name === "amenities")
        ?.list.map((item) => item.label) || [];
    const imageUrls = data.images.map((img) => img.large) || [];

    const countBeds = (rooms: any[]): number => {
      return rooms
        .filter(room => room.roomType.toLowerCase().includes('bedroom'))
        .reduce((total, room) => {
          return total + room.beds.reduce((bedCount, bedDescription) => {
            const count = parseInt(bedDescription.split(' ')[0]) || 1;
            return bedCount + count;
          }, 0);
        }, 0);
    };
    const latLngPoint = data.geoLocation ? {
      type: "point",
      coordinates: [data.geoLocation.lat, data.geoLocation.lon], // Note: lat first for xy mode
      srid: 4326
    } : null;

    return {
      originalListingId: offerId,
      name: data.generalTitle || "",
      about: data.description?.unit?.content || "",
      // propertyType: mapPropertyType(data.type),
      propertyType: data.type,
      address: data.locationShorted || "",
      city: data.locationShorted || "",
      latLngPoint,
      maxNumGuests: data.persons || 0,
      numBeds: countBeds(data.rooms || []),
      numBedrooms: data.bedrooms || 0,
      numBathrooms: data.bathrooms || 0,
      amenities,
      otherAmenities: [],
      imageUrls,
      originalListingUrl: url,
      avgRating: 0, // Not available in the provided response
      numRatings: 0, // Not available in the provided response
      originalListingPlatform: "Casamundo" as ListingSiteName,
      originalNightlyPrice: 0, // Not available in the provided response
      reviews: [],
      scrapeUrl: url,
    };
  } catch (error) {
    console.error("Error fetching property details:", error);
    return {} as ScrapedListing;
  }
}

async function scrapeProperty(
  offerId: string,
  locationId: string,
  checkIn: Date,
  checkOut: Date,
  numOffers: number,
): Promise<ScrapedListing> {
  try {
    // const url = `https://www.casamundo.com/rental/${offerId}`;

    // make request to their calendar API to see if the property is actually available, 0, 1, or 2

    const isAvailable = await checkAvailability(offerId, checkIn, checkOut);
    console.log("isAvailable", isAvailable, "ID:", offerId);
    if (!isAvailable) {
      console.log("Property not available for the specified dates");
      return {} as ScrapedListing;
    }

    // const price = await fetchPropertyPrice(offerId, checkIn.toISOString().split("T")[0] ?? "", 5, 2, "58e20f3888673", "5RDFJ31GFPM7WPLZ")
    // console.log("price", price);

    const propertyDetails = await fetchPropertyDetails(
      offerId,
      checkIn.toISOString().split("T")[0] ?? "",
      checkOut.toISOString().split("T")[0] ?? "",
      2,
      locationId,
      "5RDFJ31GFPM7WPLZ",
    );

    return propertyDetails as ScrapedListing;
  } catch (error) {
    console.error("Error fetching property details:", error);
    throw error;
  }
}

export const casamundoScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  numOfOffersInEachScraper = 5,
  requestNightlyPrice,
  requestId,
  location,
}) => {
  if (!location) {
    throw new Error("Location must be provided for Casamundo scraper");
  }
  try {
    const locationId = await getLocationId(location);
    const offerIds = await getOfferIds(
      locationId,
      checkIn,
      checkOut,
      numOfOffersInEachScraper,
    );
    console.log("offerIds and locations", offerIds);
    const scrapedListings: ScrapedListing[] = [];

    for (const offer of offerIds.slice(0, 3)) {
      // for (const offer of offerIds) {
      if (scrapedListings.length >= numOfOffersInEachScraper) {
        break;
      }
      const propertyWithDetails = await scrapeProperty(
        offer.id,
        locationId,
        checkIn,
        checkOut,
        numOfOffersInEachScraper,
      );
      console.log("propertyWithDetails", propertyWithDetails);
      if (Object.keys(propertyWithDetails).length > 0) {
        scrapedListings.push(propertyWithDetails);
      }
    }

    return scrapedListings;
  } catch (error) {
    console.error("Error scraping Casamundo:", error);
    return [];
  }
};

export const casamundoSubScraper: SubsequentScraper = async ({
  originalListingId,
  scrapeUrl,
  checkIn,
  checkOut,
}) => {
  // Implementation for subsequent scraping
  // This would be similar to the main scraper, but focusing on a single listing
  // You'll need to implement this based on how Casamundo's API handles individual property requests
  return {
    isAvailableOnOriginalSite: false,
    availabilityCheckedAt: new Date(),
  };
};

// Get price (maybe just scrape html), reviews, other stuff, may just scrape html with cheerio
