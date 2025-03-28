import {
  DirectSiteScraper,
  SubsequentScraper,
  ScrapedListing,
} from "@/server/direct-sites-scraping";
import { NewReview } from "@/server/db/schema";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";
import { ALL_PROPERTY_TYPES, PropertyType } from "@/server/db/schema/common";
import { ListingSiteName } from "@/server/db/schema/common";
import { getNumNights, logAndFilterSettledResults } from "@/utils/utils";
import { parseHTML } from "@/utils/utils";
import { proxyAgent } from "../server-utils";
import { getAddress } from "../google-maps";

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
  } else if (fullTitle.includes(locationParts[0]!)) {
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

  const response: AxiosResponse<AutocompleteResponse> = await axios.get(
    `${autocompleteUrl}?${params.toString()}`,
    {
      httpsAgent: proxyAgent,
    },
  );
  const suggestions = response.data.suggestions;

  if (suggestions.length > 0 && suggestions[0]) {
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
}
interface OfferResponse {
  offers: Array<unknown>;
}

async function getOfferIds(
  locationId: string,
  checkIn: Date,
  checkOut: Date,
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
    arrival: checkIn.toISOString().split("T")[0] ?? "",
    duration: getNumNights(checkIn, checkOut).toString(),
    _format: "json",
  });

  const response: AxiosResponse<OfferResponse> = await axios.get(
    `${url}?${params.toString()}`,
    {
      headers,
      httpsAgent: proxyAgent,
    },
  );

  return response.data.offers.map((offer) => offerSchema.parse(offer));
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
type AvailabilityResponse = Record<string, number>;
export async function getAvailability(
  offerId: string,
): Promise<AvailabilityResponse> {
  const url = `https://www.casamundo.com/api/v2/calendar/${offerId}`;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Generate an array of { year, month } objects for the next 12 months
  const monthsToFetch = Array.from({ length: 12 }, (_, i) => {
    const month = ((currentMonth + i - 1) % 12) + 1;
    const year = currentYear + Math.floor((currentMonth + i - 1) / 12);
    return { year, month };
  });

  type MonthData = Record<string, number>;

  const fetchMonthData = async (
    year: number,
    month: number,
  ): Promise<MonthData> => {
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response: AxiosResponse<CalendarResponse> = await axios.get(url, {
          params: { year, month },
          // httpsAgent: proxyAgent,
          headers: {
            accept: "application/json",
            "accept-language": "en-US,en;q=0.9",
          },
          timeout: 10000,
        });
        return response.data.content.days;
      } catch (error: any) {
        // console.error(`Error fetching data for ${year}-${month}:`, error);
        if (attempt === maxRetries - 1) {
          console.error(`Failed to fetch data for ${year}-${month}, ${error}`);
          throw error; // Throw if all retries fail
        }
      }
    }
    return {}; // Empty response if all retries fail
  };

  // Fetch all months in parallel
  const allMonthsData: MonthData[] = await timeoutPromise(
    Promise.all(
      monthsToFetch.map(({ year, month }) => fetchMonthData(year, month)),
    ),
    60000,
  );

  // Combine all the days data into a single object
  const availability: AvailabilityResponse = {};
  allMonthsData.forEach((days) => Object.assign(availability, days));

  return availability;
}

const timeoutPromise = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race<T>([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout exceeded")), ms),
    ),
  ]);
};

async function checkAvailability(
  offerId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<boolean> {
  const url = `https://www.casamundo.com/api/v2/calendar/${offerId}`;

  const currentDate = new Date();

  let currentYear: number = checkIn.getFullYear();
  if (checkIn < currentDate) {
    currentYear = currentDate.getFullYear() + 1;
  }
  let currentMonth: number = checkIn.getMonth() + 1;

  const days: Record<string, number> = {};

  const maxRetries = 3;

  while (
    currentYear < checkOut.getFullYear() ||
    (currentYear === checkOut.getFullYear() &&
      currentMonth <= checkOut.getMonth() + 1)
  ) {
    let success = false;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response: AxiosResponse<CalendarResponse> = await axios.get(url, {
          params: {
            year: currentYear,
            month: currentMonth,
          },
          httpsAgent: proxyAgent,
          headers: {
            accept: "application/json",
            "accept-language": "en-US,en;q=0.9",
          },
        });

        Object.assign(days, response.data.content.days);
        success = true;
        break; // Success, exit retry loop
      } catch (error) {
        console.log("retrying", attempt);
        if (axios.isAxiosError(error)) {
          console.error(
            `Axios error for ${currentYear}-${currentMonth}:`,
            error.message,
          );
          if (error.response?.status === 522) {
            console.error("Connection timeout error (522). Retrying...");
          }
        } else {
          console.error(
            `Non-Axios error for ${currentYear}-${currentMonth}:`,
            error,
          );
        }
        // No delay here, it will immediately retry
      }
    }

    if (!success) {
      console.error(
        `Failed to fetch data for ${currentYear}-${currentMonth} after ${maxRetries} attempts`,
      );
      return false; // Consider the property unavailable if we can't fetch the data
    }

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  const stayDates = getDatesArray(checkIn, checkOut);
  return stayDates.every((date) => days[date] === 2);
}

interface PriceExtractionParams {
  offerId: string;
  numGuests?: number;
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

const CancellationDataFrameSchema = z.object({
  date: z.string(),
  text: z.string(),
  percentage: z.number(),
  type: z.string(),
});

const CancellationDetailsSchema = z.object({
  dataFrames: z.array(CancellationDataFrameSchema),
});

type CancellationDetails = z.infer<typeof CancellationDetailsSchema>;

interface BookingDetails {
  cancellationDetails: CancellationDetails;
}

interface ApiResponse {
  hasErrors: boolean;
  errorMessage?: string;
  content: {
    priceDetails: PriceDetails;
    bookingDetails: BookingDetails;
  };
}

interface PriceResult {
  price: number;
  currency: string;
  id: string;
  cancellationPolicy: string;
}

type OnlyPriceResult =
  | {
      status: "success";
      price: number;
      currency: string;
      id: string;
    }
  | {
      status: "failed" | "unavailable";
    };

function formatCancellationPolicy(
  cancellationDetails: CancellationDetails,
): string {
  if (cancellationDetails.dataFrames.length === 0) {
    return "Cancellation policy information is not available.";
  }

  if (
    cancellationDetails.dataFrames.length === 2 &&
    cancellationDetails.dataFrames[0]?.text === "No refund" &&
    cancellationDetails.dataFrames[0]?.percentage === 0
  ) {
    return "Cancellation Policy:\n\n- Non-refundable";
  }

  let policyString = "Cancellation Policy:\n\n";

  cancellationDetails.dataFrames.forEach((frame) => {
    if (frame.type !== "checkin") {
      policyString += `- ${frame.date}: `;
      if (frame.percentage === 100 && !frame.text.includes("minus")) {
        policyString += "Full refund";
      } else if (frame.percentage === 100 && frame.text.includes("minus")) {
        policyString += frame.text;
      } else if (frame.percentage > 0) {
        policyString += `${frame.percentage}% refund`;
      } else {
        policyString += "No refund";
      }
      policyString += "\n";
    }
  });

  return policyString;
}

export const fetchPrice = async (
  params: PriceExtractionParams,
): Promise<PriceResult> => {
  const url = `https://www.casamundo.com/booking/checkout/priceDetails/${params.offerId}`;

  const queryParams = new URLSearchParams({
    sT: "withDates",
    adults: params.numGuests?.toString() ?? "1",
    children: "0",
    pets: "0",
    arrival: params.checkIn.toISOString().split("T")[0] ?? "",
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
        {
          headers,
          httpsAgent: proxyAgent,
        },
      );
      const data = response.data;

      const cancellationDetails = CancellationDetailsSchema.parse(
        data.content.bookingDetails.cancellationDetails,
      );

      const formattedCancellationPolicy =
        formatCancellationPolicy(cancellationDetails);

      if (!data.hasErrors) {
        console.log(data);
        return {
          price: data.content.priceDetails.travelPrice.raw,
          currency: data.content.priceDetails.currency,
          id: params.offerId,
          cancellationPolicy: formattedCancellationPolicy,
        };
      }

      if (data.errorMessage === "price_not_available") {
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }
      }
      return {
        price: -1,
        currency: "N/A",
        id: params.offerId,
        cancellationPolicy: "N/A",
      };
    } catch (error) {
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        return {
          price: -1,
          currency: "N/A",
          id: params.offerId,
          cancellationPolicy: "N/A",
        };
      }
    }
  }
  return {
    price: -1,
    currency: "N/A",
    id: params.offerId,
    cancellationPolicy: "N/A",
  };
};

export const fetchPriceNoRateLimit = async (
  params: PriceExtractionParams,
): Promise<OnlyPriceResult> => {
  const url = `https://www.casamundo.com/booking/checkout/priceDetails/${params.offerId}`;
  const queryParams = new URLSearchParams({
    sT: "withDates",
    adults: params.numGuests?.toString() ?? "1",
    children: "0",
    pets: "0",
    arrival: params.checkIn.toISOString().split("T")[0] ?? "",
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
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    Referer: "https://www.casamundo.com/",
    Origin: "https://www.casamundo.com",
    // "sec-ch-ua":
    //   '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    // "sec-ch-ua-mobile": "?0",
    // "sec-ch-ua-platform": '"macOS"',
    // "sec-fetch-dest": "empty",
    // "sec-fetch-mode": "cors",
    // "sec-fetch-site": "same-origin",
  };

  const maxRetries = 2;
  const retryDelay = 2000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${url}?${queryParams.toString()}`,
        null,
        {
          headers,
          // httpsAgent: proxyAgent,
        },
      );

      const data = response.data;
      console.log(data);

      if (!data.hasErrors && data.content.priceDetails.isAvailable) {
        return {
          status: "success",
          price: data.content.priceDetails.travelPrice.raw,
          currency: data.content.priceDetails.currency,
          id: params.offerId,
        };
      }

      if (data.errorMessage === "price_not_available") {
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }
      }

      if (data.content.priceDetails.isAvailable === false) {
        return {
          status: "unavailable",
        };
      }
    } catch (error) {
      console.log(error);
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        return {
          status: "failed",
        };
      }
    }
  }
  return {
    status: "failed",
  };
};

const reviewResponseSchema = z.object({
  average: z
    .object({
      value: z.number().optional(),
      count: z.number().optional(),
    })
    .optional(),
  list: z.array(
    z.object({
      text: z.string().nullable().optional(),
      nickname: z.string().optional(),
      rating: z.object({
        value: z.number(),
      }),
    }),
  ),
});

const fetchReviews = async (
  offerId: string,
): Promise<{
  avgRating: number;
  numRatings: number;
  reviews: NewReview[];
}> => {
  const data = await axios
    .get(
      `https://www.casamundo.com/reviews/list/${offerId}?scale=5&bcEnabled=false&googleReviews=false`,
      {
        httpsAgent: proxyAgent,
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
    )
    .then((res) => res.data as unknown)
    .then((res) => reviewResponseSchema.parse(res));

  const avgRating: number = data.average?.value ?? 0;
  const numRatings: number = data.average?.count ?? 0;
  const reviews: NewReview[] = data.list
    .filter((review): review is typeof review & { text: string } =>
      Boolean(review.text),
    )
    .map((review) => ({
      name: review.nickname ?? "Anonymous",
      rating: review.rating.value,
      review: review.text,
    }));

  return { avgRating, numRatings, reviews };
};

async function fetchPropertyDetails(
  offerId: string,
  checkIn: string,
  checkOut: string,
  adults: number,
  location: string,
  price: {
    price: number;
    currency: string;
    id: string;
    cancellationPolicy: string;
  },
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

  const propertyDataSchema = z.object({
    infoGroups: z.array(
      z.object({
        name: z.string(),
        list: z.array(
          z.object({
            label: z.string(),
            icon: z.string().optional(),
          }),
        ),
      }),
    ),
    images: z.array(
      z.object({
        medium: z.string(),
      }),
    ),
    rooms: z.array(
      z.object({
        roomType: z.string(),
        beds: z.array(z.string()),
      }),
    ),
    generalTitle: z.string(),
    description: z.object({
      unit: z.object({
        content: z.string(),
      }),
    }),
    type: z.string(),
    locationShorted: z.string(),
    geoLocation: z.object({
      lon: z.number(),
      lat: z.number(),
    }),
    persons: z.number(),
    petFriendly: z.boolean().optional(),
    bedrooms: z.number().nullable(),
    bathrooms: z.number().optional(),
    checkInCheckOutTime: z
      .object({
        checkInTimeFrom: z.string(),
        checkOutTimeTo: z.string(),
        message: z.string().nullable(),
        reloadOnArrivalChange: z.boolean(),
      })
      .nullish(),
  });

  const data = await axios
    .get(`${url}?${params.toString()}`, {
      httpsAgent: proxyAgent,
      headers,
    })
    .then((res) => res.data as unknown)
    .then((res) => propertyDataSchema.parse(res));

  let smokingAllowed = true;
  const amenities: string[] = [];

  data.infoGroups.forEach((group) => {
    group.list.forEach((item) => {
      amenities.push(item.label);
      if (item.icon && item.icon === "smoking_not_allowed") {
        smokingAllowed = false;
      }
    });
  });

  const imageUrls: string[] = data.images.map((img) => `https:${img.medium}`);

  const numBeds = data.rooms
    .filter((room) => room.roomType.toLowerCase().includes("bedroom"))
    .reduce(
      (total, room) =>
        total +
        room.beds.reduce((bedCount, bedDescription) => {
          const bedNumber = bedDescription.split(" ")[0] ?? "";
          const count = parseInt(bedNumber) || 1;
          return bedCount + count;
        }, 0),
      0,
    );

  const aboutSection = data.description.unit.content;

  const { avgRating, numRatings, reviews } = await fetchReviews(offerId);

  const latLngPoint = {
    lng: data.geoLocation.lon,
    lat: data.geoLocation.lat,
  };

  const addressComponents = await getAddress(latLngPoint);

  const numNights = getNumNights(new Date(checkIn), new Date(checkOut));

  return {
    originalListingId: offerId,
    name: data.generalTitle,
    about: parseHTML(aboutSection),
    propertyType: mapPropertyType(data.type),
    address: data.locationShorted,
    city: addressComponents.city,
    stateName: addressComponents.stateName,
    stateCode: addressComponents.stateCode,
    country: addressComponents.country,
    countryISO: addressComponents.countryISO,
    latLngPoint,
    maxNumGuests: data.persons,
    numBeds,
    numBedrooms: data.bedrooms ?? 1,
    numBathrooms: data.bathrooms,
    amenities,
    otherAmenities: [],
    imageUrls,
    originalListingUrl: `https://www.casamundo.com/rental/${offerId}`,
    avgRating,
    numRatings,
    checkInTime: data.checkInCheckOutTime?.checkInTimeFrom,
    checkOutTime: data.checkInCheckOutTime?.checkOutTimeTo,
    originalListingPlatform: "Casamundo" as ListingSiteName,
    originalNightlyPrice: Math.round((price.price / numNights) * 100),
    petsAllowed: data.petFriendly ?? false,
    smokingAllowed,
    cancellationPolicy: price.cancellationPolicy,
    reviews: reviews,
    scrapeUrl: `${url}?${params.toString()}`,
  };
}

async function scrapeProperty(
  offerId: string,
  locationId: string,
  checkIn: Date,
  checkOut: Date,
  numGuests?: number,
) {
  if (!numGuests) {
    throw new Error("Number of guests must be provided for Casamundo scraper");
  }

  const isAvailable = await checkAvailability(offerId, checkIn, checkOut);

  if (!isAvailable) throw new Error("Property is not available");

  const price = await fetchPrice({
    offerId,
    numGuests,
    checkIn: checkIn,
    duration: getNumNights(checkIn, checkOut),
  });

  if (price.price === -1) throw new Error("Price is not available");

  const propertyDetails = await fetchPropertyDetails(
    offerId,
    checkIn.toISOString().split("T")[0] ?? "",
    checkOut.toISOString().split("T")[0] ?? "",
    numGuests,
    locationId,
    price,
  );
  return propertyDetails;
}

export const casamundoScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  requestNightlyPrice,
  requestId,
  location,
  numGuests,
}) => {
  if (!location) {
    throw new Error("Location must be provided for Casamundo scraper");
  }

  const locationId = await getLocationId(location);
  const offerIds = await getOfferIds(locationId, checkIn, checkOut, numGuests);

  // const scrapedListings: ScrapedListing[] = [];

  // for (const offer of offerIds) {
  //   const propertyWithDetails = await scrapeProperty(
  //     offer.id,
  //     locationId,
  //     checkIn,
  //     checkOut,
  //     numGuests,
  //   );

  //   if (Object.keys(propertyWithDetails).length > 0) {
  //     scrapedListings.push(propertyWithDetails);
  //   }
  // }

  return await Promise.allSettled(
    offerIds.map((offer) =>
      scrapeProperty(offer.id, locationId, checkIn, checkOut, numGuests),
    ),
  ).then(logAndFilterSettledResults);
};

export const casamundoSubScraper: (
  options: Parameters<SubsequentScraper>[0] & { numGuests?: number },
) => ReturnType<SubsequentScraper> = async ({
  originalListingId,
  scrapeUrl,
  checkIn,
  checkOut,
  numGuests: initialNumGuests,
}) => {
  let numGuests = initialNumGuests;

  if (scrapeUrl) {
    try {
      const url = new URL(scrapeUrl);
      numGuests =
        parseInt(url.searchParams.get("adults") ?? "", 10) || initialNumGuests;
    } catch (error) {
      console.error("Invalid scrapeUrl provided:", error);
    }
  }

  const numNights = getNumNights(checkIn, checkOut);

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
};

// export const casamundoSubScraper: SubsequentScraper = async ({
//   originalListingId,
//   scrapeUrl,
//   checkIn,
//   checkOut,
// }) => {
//   const url = new URL(scrapeUrl);
//   const numGuests = parseInt(url.searchParams.get("adults") ?? "", 10);
//   const numNights = getNumNights(checkIn, checkOut);

//   const isAvailable = await checkAvailability(
//     originalListingId,
//     checkIn,
//     checkOut,
//   );

//   const price = await fetchPrice({
//     offerId: originalListingId,
//     numGuests,
//     checkIn: checkIn,
//     duration: numNights,
//   });

//   if (!isAvailable || price.price === -1) {
//     return {
//       isAvailableOnOriginalSite: false,
//       availabilityCheckedAt: new Date(),
//     };
//   }

//   return {
//     isAvailableOnOriginalSite: true,
//     availabilityCheckedAt: new Date(),
//     originalNightlyPrice: Math.round((price.price / numNights) * 100),
//   };
// };
