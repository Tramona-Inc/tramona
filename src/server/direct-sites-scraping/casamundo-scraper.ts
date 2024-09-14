import {
  DirectSiteScraper,
  SubsequentScraper,
  ScrapedListing,
} from "@/server/direct-sites-scraping";
import { Review } from "@/server/db/schema";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";
import { ALL_PROPERTY_TYPES, PropertyType } from "@/server/db/schema/common";
import { ListingSiteName } from "@/server/db/schema/common";
import { getNumNights } from "@/utils/utils";
import { parseHTML } from "@/utils/utils";

const offerSchema = z.object({
  id: z.string(),
  geoLocation: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
});

type CasamundoOffer = z.infer<typeof offerSchema>;

const mapPropertyType = (type: string): PropertyType => {
  const normalizedType = type
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  if (ALL_PROPERTY_TYPES.includes(normalizedType as PropertyType)) {
    return normalizedType as PropertyType;
  }
  return "Other";
};

interface Suggestion {
  id: string;
  fullTitle: string;
  trail: string;
}

interface AutocompleteResponse {
  suggestions: Suggestion[];
}

interface ScoredSuggestion {
  suggestion: Suggestion | null;
  score: number;
}

function scoreMatch(suggestion: Suggestion, locationParts: string[]): number {
  const fullTitle = suggestion.fullTitle.toLowerCase();
  const trail = suggestion.trail.toLowerCase();
  let score = 0;

  if (fullTitle === locationParts[0]) {
    score += 100;
  } else if (fullTitle.includes(locationParts[0])) {
    score += 50;
  }
  if (
    locationParts.every(
      (part) => fullTitle.includes(part) || trail.includes(part),
    )
  ) {
    score += 25;
  }
  score -= fullTitle.split(" ").length;

  return score;
}

async function getLocationId(location: string): Promise<string> {
  const autocompleteUrl = "https://www.casamundo.com/api/v2/autocomplete";
  const params = new URLSearchParams({
    q: location,
    limit: "10",
  });

  try {
    const response: AxiosResponse<AutocompleteResponse> = await axios.get(
      `${autocompleteUrl}?${params.toString()}`,
    );
    const suggestions = response.data.suggestions;

    if (suggestions.length > 0) {
      const locationParts = location
        .toLowerCase()
        .split(",")
        .map((part) => part.trim());

      const bestMatch = suggestions.reduce<ScoredSuggestion>(
        (best, current) => {
          const currentScore = scoreMatch(current, locationParts);
          return currentScore > best.score
            ? { suggestion: current, score: currentScore }
            : best;
        },
        { suggestion: null, score: -Infinity },
      ).suggestion;

      if (bestMatch) {
        return bestMatch.id;
      }
      
      return suggestions[0].id;
    } else {
      throw new Error("No location found");
    }
  } catch (error) {
    console.error("Error fetching location ID:", error);
    throw error;
  }
}
interface OfferResponse {
  offers: Array<unknown>;
}

async function getOfferIds(
  locationId: string,
  checkIn: Date,
  checkOut: Date,
  numOffers: number,
  numGuests?: number,
): Promise<CasamundoOffer[]> {
  const url = `https://www.casamundo.com/search/${locationId}`;

  const headers: Record<string, string> = {
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
    adults: numGuests?.toString() ?? "1",
    arrival: checkIn.toISOString().split("T")[0] ?? '',
    duration: getNumNights(checkIn, checkOut).toString(),
    _format: "json",
  });

  try {
    const response: AxiosResponse<OfferResponse> = await axios.get(
      `${url}?${params.toString()}`,
      {
        headers,
      },
    );

    const offers = response.data.offers;

    const parsedOffers = offers.map((offer: unknown) =>
      offerSchema.parse(offer),
    );

    return parsedOffers;
  } catch (error) {
    console.error("Error fetching offer IDs:", error);
    throw error;
  }
}

function getDatesArray(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0] ?? "");
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

interface CalendarResponse {
  content: {
    days: Record<string, number>;
  };
}

async function checkAvailability(
  offerId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<boolean> {
  const url = `https://www.casamundo.com/api/v2/calendar/${offerId}`;

  let currentYear: number = checkIn.getFullYear();
  let currentMonth: number = checkIn.getMonth() + 1;

  try {
    const days: Record<string, number> = {};

    while (
      currentYear < checkOut.getFullYear() ||
      (currentYear === checkOut.getFullYear() &&
        currentMonth <= checkOut.getMonth() + 1)
    ) {
      const response: AxiosResponse<CalendarResponse> = await axios.get(url, {
        params: {
          year: currentYear,
          month: currentMonth,
        },
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
        },
      });

      Object.assign(days, response.data.content.days);

      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }

    const stayDates: string[] = getDatesArray(checkIn, checkOut);

    for (const date of stayDates) {
      if (!days.hasOwnProperty(date) || days[date] !== 2) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error(`Error checking availability for ${offerId}:`, error);
    return false;
  }
}

interface PriceExtractionParams {
  offerId: string;
  numGuests: number;
  checkIn: Date;
  duration: number;
}

interface PriceDetails {
  travelPrice: {
    raw: number;
  };
  currency: string;
  isAvailable: boolean;
}

interface ApiResponse {
  hasErrors: boolean;
  errorMessage?: string;
  content: {
    priceDetails: PriceDetails;
  };
}

interface PriceResult {
  price: number;
  currency: string;
  id: string;
}

const fetchPrice = async (
  params: PriceExtractionParams,
): Promise<PriceResult> => {
  const url = `https://www.casamundo.com/booking/checkout/priceDetails/${params.offerId}`;

  const queryParams = new URLSearchParams({
    sT: "withDates",
    adults: params.numGuests.toString(),
    children: "0",
    pets: "0",
    arrival: params.checkIn.toISOString().split("T")[0] ?? '',
    c: "USD",
    duration: params.duration.toString(),
    pricetype: "perNight",
    country: "US",
    isExtrasTouched: "0",
    action: "pageOpen",
    pageType: "details",
    isCachedPaymentMethods: "true",
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
  };

  const maxRetries = 3;
  const retryDelay = 2000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${url}?${queryParams.toString()}`,
        null,
        { headers },
      );
      const data = response.data;

      if (!data.hasErrors) {
        return {
          price: data.content.priceDetails.travelPrice.raw,
          currency: data.content.priceDetails.currency,
          id: params.offerId,
        };
      }

      if (data.hasErrors && data.errorMessage === "price_not_available") {
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }
      }
      return {
        price: -1,
        currency: "N/A",
        id: params.offerId,
      };
    } catch (error) {
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        return {
          price: -1,
          currency: "N/A",
          id: params.offerId,
        };
      }
    }
  }
  return {
    price: -1,
    currency: "N/A",
    id: params.offerId,
  };
};

interface ReviewResponse {
  average: {
    value: number;
    count: number;
  };
  list: Array<{
    text?: string;
    nickname: string;
    rating: {
      value: number;
    };
  }>;
}

const fetchReviews = async (
  offerId: string,
): Promise<{
  avgRating: number;
  numRatings: number;
  reviews: Review[];
}> => {
  try {
    const response = await axios.get<ReviewResponse>(
      `https://www.casamundo.com/reviews/list/${offerId}?scale=5&bcEnabled=false&googleReviews=false`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "sec-ch-ua":
            '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "Referrer-Policy": "no-referrer-when-downgrade",
        },
      },
    );

    const data: ReviewResponse = response.data;
    const avgRating: number = data.average.value || 0;
    const numRatings: number = data.average.count || 0;
    const reviews: Review[] = data.list
      .filter((review): review is typeof review & { text: string } =>
        Boolean(review.text),
      )
      .map((review) => ({
        name: review.nickname ?? "Anonymous",
        profilePic: "",
        rating: review.rating.value,
        review: review.text,
      }));

    return { avgRating, numRatings, reviews };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { avgRating: 0, numRatings: 0, reviews: [] };
  }
};

async function fetchPropertyDetails(
  offerId: string,
  checkIn: string,
  checkOut: string,
  adults: number,
  location: string,
  price: { price: number; currency: string; id: string },
): Promise<ScrapedListing> {
  const url = `https://www.casamundo.com/rental/offer/${offerId}`;

  const params = new URLSearchParams({
    adults: adults.toString(),
    arrival: checkIn,
    duration: getNumNights(new Date(checkIn), new Date(checkOut)).toString(),
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

  interface AmenityGroup {
    name: string;
    list: Array<{ label: string }>;
  }

  interface PropertyImage {
    medium: string;
  }

  interface Room {
    roomType: string;
    beds: string[];
  }

  interface PropertyData {
    infoGroups: AmenityGroup[];
    images: PropertyImage[];
    rooms: Room[];
    generalTitle?: string;
    description?: {
      unit?: {
        content?: string;
      };
    };
    type: string;
    locationShorted?: string;
    geoLocation: {
      lon: number;
      lat: number;
    };
    persons?: number;
    bedrooms?: number;
    bathrooms?: number;
  }

  try {
    const response = await axios.get<PropertyData>(
      `${url}?${params.toString()}`,
      {
        headers,
      },
    );
    const data: PropertyData = response.data;

    const amenities: string[] =
      data.infoGroups
        .find((group) => group.name === "amenities")
        ?.list.map((item) => item.label) ?? [];

    const imageUrls: string[] = data.images.map((img) => `https:${img.medium}`);

    const countBeds = (rooms: Room[]): number => {
      return rooms
        .filter((room) => room.roomType.toLowerCase().includes("bedroom"))
        .reduce((total, room) => {
          return (
            total +
            room.beds.reduce((bedCount, bedDescription) => {
              const bedNumber = bedDescription.split(" ")[0] ?? "";
              const count = parseInt(bedNumber) || 1;
              return bedCount + count;
            }, 0)
          );
        }, 0);
    };

    const aboutSection = data.description?.unit?.content ?? "";

    const { avgRating, numRatings, reviews } = await fetchReviews(offerId);

    const latLngPoint = {
      x: data.geoLocation.lon,
      y: data.geoLocation.lat,
    };

    const numNights = getNumNights(new Date(checkIn), new Date(checkOut));

    return {
      originalListingId: offerId,
      name: data.generalTitle ?? "",
      about: parseHTML(aboutSection),
      propertyType: mapPropertyType(data.type),
      address: data.locationShorted ?? "",
      city: data.locationShorted ?? "",
      latLngPoint,
      maxNumGuests: data.persons ?? 0,
      numBeds: countBeds(data.rooms),
      numBedrooms: data.bedrooms ?? 0,
      numBathrooms: data.bathrooms ?? 0,
      amenities,
      otherAmenities: [],
      imageUrls,
      originalListingUrl: `https://www.casamundo.com/rental/${offerId}`,
      avgRating,
      numRatings,
      originalListingPlatform: "Casamundo" as ListingSiteName,
      originalNightlyPrice: Math.round((price.price / numNights) * 100),
      reviews: reviews,
      scrapeUrl: `${url}?${params.toString()}`,
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
  numGuests?: number,
): Promise<ScrapedListing> {
  try {
    if (!numGuests) {
      throw new Error(
        "Number of guests must be provided for Casamundo scraper",
      );
    }

    const isAvailable = await checkAvailability(offerId, checkIn, checkOut);

    if (!isAvailable) {
      return {} as ScrapedListing;
    }

    const price = await fetchPrice({
      offerId,
      numGuests,
      checkIn: checkIn,
      duration: getNumNights(checkIn, checkOut),
    });

    if (price.price === -1) {
      return {} as ScrapedListing;
    }

    const propertyDetails = await fetchPropertyDetails(
      offerId,
      checkIn.toISOString().split("T")[0] ?? "",
      checkOut.toISOString().split("T")[0] ?? "",
      numGuests,
      locationId,
      price,
    );

    return propertyDetails;
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
  numGuests,
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
      numGuests,
    );

    const scrapedListings: ScrapedListing[] = [];

    for (const offer of offerIds) {
      if (scrapedListings.length >= numOfOffersInEachScraper) {
        break;
      }
      const propertyWithDetails = await scrapeProperty(
        offer.id,
        locationId,
        checkIn,
        checkOut,
        numOfOffersInEachScraper,
        numGuests,
      );

      if (Object.keys(propertyWithDetails).length > 0) {
        scrapedListings.push(propertyWithDetails);
      }
    }
    // console.log("scrapedListings!!", scrapedListings);
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
  const url = new URL(scrapeUrl);
  const numGuests = parseInt(url.searchParams.get("adults") ?? "", 10);
  const numNights = getNumNights(checkIn, checkOut);

  try {
    const isAvailable = await checkAvailability(
      originalListingId,
      checkIn,
      checkOut,
    );

    const price = await fetchPrice({
      offerId: originalListingId,
      numGuests,
      checkIn: checkIn,
      duration: numNights,
    });

    if (!isAvailable || price.price === -1) {
      return {
        isAvailableOnOriginalSite: false,
        availabilityCheckedAt: new Date(),
      };
    }

    return {
      isAvailableOnOriginalSite: true,
      availabilityCheckedAt: new Date(),
      originalNightlyPrice: Math.round((price.price / numNights) * 100),
    };
  } catch (error) {
    console.error("Error in casamundoSubScraper");
    return {
      isAvailableOnOriginalSite: false,
      availabilityCheckedAt: new Date(),
    };
  }
};

// cancellation policy, what are we doing with requestNightlyPrice and requestId
