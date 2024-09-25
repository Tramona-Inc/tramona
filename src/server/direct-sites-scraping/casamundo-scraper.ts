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
import { getNumNights } from "@/utils/utils";
import { parseHTML } from "@/utils/utils";
import { proxyAgent } from "../server-utils";

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
    { httpsAgent: proxyAgent },
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
    { headers, httpsAgent: proxyAgent },
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

async function checkAvailability(
  offerId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<boolean> {
  const url = `https://www.casamundo.com/api/v2/calendar/${offerId}`;

  let currentYear: number = checkIn.getFullYear();
  let currentMonth: number = checkIn.getMonth() + 1;

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
      httpsAgent: proxyAgent,
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

const fetchPrice = async (
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
        { headers, httpsAgent: proxyAgent },
      );
      const data = response.data;

      const cancellationDetails = CancellationDetailsSchema.parse(
        data.content.bookingDetails.cancellationDetails,
      );

      const formattedCancellationPolicy =
        formatCancellationPolicy(cancellationDetails);

      if (!data.hasErrors) {
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
      .optional(),
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

  const numNights = getNumNights(new Date(checkIn), new Date(checkOut));

  return {
    originalListingId: offerId,
    name: data.generalTitle,
    about: parseHTML(aboutSection),
    propertyType: mapPropertyType(data.type),
    address: data.locationShorted,
    city: data.locationShorted,
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
  ).then((results) =>
    results
      .filter((result) => {
        if (result.status === "rejected") console.error(result.reason);
        return result.status === "fulfilled";
      })
      .map((result) => result.value),
  );
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
