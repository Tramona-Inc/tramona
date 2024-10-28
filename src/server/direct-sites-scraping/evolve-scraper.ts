import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";
import {
  DirectSiteScraper,
  SubsequentScraper,
  ScrapedListing,
} from "@/server/direct-sites-scraping";
import { PropertyType, NewReview } from "@/server/db/schema";
import { ListingSiteName } from "@/server/db/schema/common";
import { getNumNights, logAndFilterSettledResults } from "@/utils/utils";
import { algoliasearch, SearchResponse } from "algoliasearch";
import {
  getAddress,
  getCoordinates,
  getCountryISO,
} from "@/server/google-maps";
import { proxyAgent } from "../server-utils";

const EvolvePropertySchema = z.object({
  id: z.string(),
  name: z.string(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  maxOccupancy: z.number(),
  propertyType: z.string(),
  amenities: z.array(z.string()),
  imageUrls: z.array(z.string()),
  latitude: z.number(),
  longitude: z.number(),
  averageRating: z.number().optional(),
  reviewCount: z.number().optional(),
  areaDescription: z.string().optional(),
  price: z.number(),
  description: z.string(),
  otherHouseRules: z.string().optional(),
  checkInInfo: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
});

const evolvePropertyTypes: Record<string, PropertyType> = {
  Condo: "Condominium",
  Apartment: "Apartment",
  House: "House",
  Villa: "Villa",
  Cottage: "Cottage",
  Townhome: "Townhouse",
  Studio: "Apartment",
  Cabin: "Cabin",
  Bungalow: "Bungalow",
  Chalet: "Chalet",
  Lodge: "Nature lodge",
  Resort: "Hotel",
  Hotel: "Hotel",
  Boat: "Boat",
  RV: "Camper/RV",
  Tent: "Tent",
  Camper: "Camper/RV",
  Treehouse: "Treehouse",
  "Tiny house": "Tiny House",
  Guesthouse: "Guesthouse",
  "Farm stay": "Farm Stay",
  Barn: "Barn",
  Castle: "Castle",
  Dorm: "Dorm",
  Hostel: "Hostel",
  Loft: "Loft",
  Yurt: "Yurt",
  Tipi: "Tipi",
  Cave: "Cave",
  Island: "Island",
  Houseboat: "Houseboat",
  Train: "Train",
  Plane: "Plane",
  Igloo: "Igloo",
  Lighthouse: "Lighthouse",
  "Earth house": "Earth House",
  "Dome house": "Dome House",
  Windmill: "Windmill",
  Container: "Shipping Container",
  Riad: "Riad",
  Trullo: "Trullo",
  "Bed & breakfast": "Bed & Breakfast",
  "Guest suite": "Guest Suite",
};

const QuoteResponseSchema = z.object({
  price: z.object({
    total: z.number(),
  }),
  cancelPolicy: z.array(
    z.object({
      refundType: z.string().optional(),
      refundTime: z.string(),
      refundPercent: z.number(),
      refundDate: z.string(),
      disclaimerDescription: z.string(),
      gracePeriod: z.boolean().optional(),
      gracePeriodHours: z.string().optional(),
    }),
  ),
});

type QuoteResponse = z.infer<typeof QuoteResponseSchema>;

function mapPropertyType(scrapedType: string): PropertyType {
  const normalizedType = scrapedType.trim().toLowerCase();
  for (const [key, value] of Object.entries(evolvePropertyTypes)) {
    if (normalizedType.includes(key.toLowerCase())) {
      return value;
    }
  }
  return "Other";
}

const EvolveSearchResultSchema = z.object({
  objectID: z.string(),
  Headline: z.string(),
  Bathrooms: z.number(),
  Bedrooms: z.number(),
  "Total Beds": z.number(),
  "Max Occupancy": z.number(),
  _geoloc: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

type EvolveSearchResult = z.infer<typeof EvolveSearchResultSchema>;

// function formatCancellationPolicy(cancelPolicy: QuoteResponse['cancelPolicy']): string {
//   const formatDate = (dateString: string, timeString: string) => {
//     const date = new Date(`${dateString}T${timeString}`);
//     return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
//   };

//   const cashRefundPolicy = cancelPolicy.find(policy => policy.refundType === 'Cash' && policy.refundPercent > 0);
//   const noRefundPolicy = cancelPolicy.find(policy => policy.refundPercent === 0);

//   if (!cashRefundPolicy) {
//     return "Non-refundable";
//   }

//   let policyString = "";

//   if (cashRefundPolicy.gracePeriod && cashRefundPolicy.gracePeriodHours) {
//     policyString += `This booking is eligible for a ${cashRefundPolicy.refundPercent}% refund within ${cashRefundPolicy.gracePeriodHours} hours after booking.\n`;
//   } else {
//     const formattedDate = formatDate(cashRefundPolicy.refundDate, cashRefundPolicy.refundTime);
//     policyString += `This booking is eligible for a ${cashRefundPolicy.refundPercent}% refund until ${formattedDate}.`;
//   }

//   if (noRefundPolicy) {
//     policyString += `After that, your trip will no longer be eligible for a refund.\n`;
//   }

//   policyString += "Note: Cancellation policy times are in the listing's time zone.";

//   return policyString;
// }

const fetchSearchResults = async (
  lat: number,
  lng: number,
  checkIn: Date,
  checkOut: Date,
  numGuests?: number,
  scrapeUrl?: string,
  _requestNightlyPrice?: number,
): Promise<EvolveSearchResult[]> => {
  const client = algoliasearch(
    "2U6AXFDIV3",
    "bb822d4fb11ce6c3a7356f182a0d5c90",
  );

  let searchLat = lat;
  let searchLng = lng;
  let searchNumGuests = numGuests;

  if (scrapeUrl) {
    const url = new URL(scrapeUrl);
    const urlParts = url.pathname.split("/").filter((part) => part);
    const [country, state, city] = urlParts.slice(-3);

    const geocodingResult = await getCoordinates(
      `${city}, ${state}, ${country}`,
    );
    if (geocodingResult.location) {
      searchLat = geocodingResult.location.lat;
      searchLng = geocodingResult.location.lng;
    }

    const searchGuests = url.searchParams.get("adults");
    if (searchGuests) {
      searchNumGuests = parseInt(searchGuests, 10);
    }
  }

  // const startDate = checkIn.toISOString().split("T")[0]?.replace(/-/g, "");
  const numNights = getNumNights(checkIn, checkOut);

  const availabilityFilters = [];
  const minStayFilters = [];
  for (let i = 0; i < numNights; i++) {
    const currentDate = new Date(checkIn);
    currentDate.setDate(currentDate.getDate() + i);
    const dateString = currentDate
      .toISOString()
      .split("T")[0]
      ?.replace(/-/g, "");
    availabilityFilters.push(
      `(Availability.${dateString}:DC OR Availability.${dateString}:D${i === 0 ? "I" : "X"}${i === numNights - 1 ? " OR Availability." + dateString + ":DO OR Availability." + dateString + ":NO" : ""})`,
    );
    minStayFilters.push(`MinStay.${dateString} <= ${numNights}`);
  }

  const filters = [...availabilityFilters, ...minStayFilters].join(" AND ");

  // let numericFilters = [
  //   `Max Occupancy>=${searchNumGuests}`,
  //   "Max Occupancy<=99",
  // ];

  // if (requestNightlyPrice) {
  //   const minPrice = Math.round(requestNightlyPrice * 0.8); // assuming requestNightlyPrice is in dollars
  //   const maxPrice = Math.round(requestNightlyPrice * 1.1);
  //   numericFilters.push(`LOS_PriceAverages.${startDate}.${numNights}>=${minPrice}`);
  //   numericFilters.push(`LOS_PriceAverages.${startDate}.${numNights}<=${maxPrice}`);
  // }

  const { results } = await client.search([
    {
      indexName: "prod_EvolveListings",
      params: {
        aroundLatLng: `${searchLat}, ${searchLng}`,
        aroundPrecision: 8000,
        aroundRadius: 48280, // about 30 miles
        filters,
        attributesToRetrieve: ["*", "-amenities"],
        clickAnalytics: true,
        facets: [
          "amenities.Amenities",
          "amenities.Accessibility",
          "amenities.Area Activities",
          "minLOS_PriceAverages",
          "maxLOS_PriceAverages",
          "Max Occupancy",
          "Bedrooms",
          "Total Beds",
          "Bathrooms",
          "Average Per Night",
          "Property Type",
          "amenities.Location",
          "amenities.View",
        ],
        getRankingInfo: true,
        maxValuesPerFacet: 300,
        // numericFilters,
        page: 0,
        hitsPerPage: 24,
        analytics: true,
        ruleContexts: ["isDatedSearch"],
      },
    },
  ]);

  const searchResponse = results[0] as SearchResponse<EvolveSearchResult>;
  return searchResponse.hits.map((hit) => EvolveSearchResultSchema.parse(hit));
};

const ReviewDataSchema = z.object({
  listing: z.string(),
  rating: z.string(),
  ratingReporting: z.string(),
  reviewResponse: z.string(),
  createdAt: z.string(),
  reviewDetail: z.string(),
  reviewSource: z.string(),
  reviewedBy: z.string(),
  reviewSummary: z.string(),
  travelDate: z.string(),
  status: z.string(),
  createdDt: z.string(),
});

type ReviewData = z.infer<typeof ReviewDataSchema>;

const fetchPropertyDetails = async (
  propertyId: string,
  name: string,
  numBathrooms: number,
  numBedrooms: number,
  numBeds: number,
  maxNumGuests: number,
  checkIn: Date,
  checkOut: Date,
  urlLocationParam: string,
  latitude: number,
  longitude: number,
  numGuests?: number,
): Promise<ScrapedListing> => {
  const url = `https://evolve.com/vacation-rentals${urlLocationParam}/${propertyId}?adults=${numGuests}&startDate=${checkIn.toISOString().split("T")[0]}&endDate=${checkOut.toISOString().split("T")[0]}`;

  const headers = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-ch-ua":
      '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
  };

  const response = await axios.get(url, { headers, httpsAgent: proxyAgent });
  const $ = cheerio.load(response.data as string);

  const scriptContent = $('script:contains("listingReviews")').html();
  if (!scriptContent) {
    throw new Error("Could not find script containing review data");
  }
  const jsonMatch = scriptContent.match(/({.*"buildId":.*})\s*$/);
  if (!jsonMatch?.[1]) {
    throw new Error("Could not extract JSON data from script");
  }

  const parsedData = JSON.parse(jsonMatch[1]) as {
    props?: {
      pageProps?: {
        listingReviews?: unknown[];
        listing?: { units?: unknown[] };
      };
    };
  };

  interface ListingUnit {
    amenities?: Amenity[];
  }

  interface Amenity {
    category: string;
    name: string;
  }

  interface ParsedData {
    props?: {
      pageProps?: {
        listing?: {
          units?: ListingUnit[];
        };
      };
    };
  }

  const listingUnits =
    (parsedData as ParsedData).props?.pageProps?.listing?.units ?? [];

  const categories = [
    "Inside Amenities",
    "Outdoor Amenities",
    "Community Amenities",
    "Property Amenities",
    "Kitchen Equipment",
  ] as const;

  type CategoryType = (typeof categories)[number];

  const categorizedAmenities: Record<CategoryType, string[]> =
    categories.reduce(
      (acc, category) => {
        acc[category] = [];
        return acc;
      },
      {} as Record<CategoryType, string[]>,
    );

  const uncategorizedAmenities: string[] = [];

  listingUnits.forEach((unit: ListingUnit) => {
    (unit.amenities ?? []).forEach((amenity: Amenity) => {
      const matchedCategory = categories.find(
        (cat) => amenity.category.toLowerCase() === cat.toLowerCase(),
      );

      if (matchedCategory) {
        if (!categorizedAmenities[matchedCategory].includes(amenity.name)) {
          categorizedAmenities[matchedCategory].push(amenity.name);
        }
      } else {
        if (!uncategorizedAmenities.includes(amenity.name)) {
          uncategorizedAmenities.push(amenity.name);
        }
      }
    });
  });

  const allAmenities = Object.values(categorizedAmenities).flat();

  const listingReviews = parsedData.props?.pageProps?.listingReviews ?? [];

  const validatedReviews = listingReviews
    .map((review) => ReviewDataSchema.safeParse(review))
    .filter(
      (result): result is z.SafeParseSuccess<ReviewData> => result.success,
    )
    .map((result) => result.data);

  const formattedReviews: NewReview[] = validatedReviews.map((review) => ({
    name: review.reviewedBy,
    rating: parseInt(review.rating),
    review: review.reviewDetail
      .replace(/\u003cbr\u003e/g, "\n")
      .replace(/\*This review was originally posted on Vrbo/g, "")
      .trim(),
  }));

  const about = $(".Description_descriptionContent__dG7mv").text().trim();
  const propertyType = $(".Detail-Overview_resultType__UrnDo")
    .text()
    .trim() as PropertyType;
  const address = $(".Detail-Overview_resultLocation__3SNLW span")
    .last()
    .text()
    .trim();
  const city = address.split(",")[0]?.trim() ?? "";

  const imageUrls = $(".Image-Gallery_clickablePhoto__SRbpl")
    .map((_, el) => $(el).attr("src"))
    .get();

  const reviewsSection = $(".Reviews_reviews____7L2");
  const avgRating = parseFloat(
    reviewsSection
      .find(".Reviews_reviewOverview__YVVcG span")
      .first()
      .text()
      .trim(),
  );
  const numRatings = parseInt(
    reviewsSection
      .find(".Reviews_reviewOverview__YVVcG span")
      .last()
      .text()
      .trim(),
  );

  const locationDetails: string[] = [];
  const locationSection = $(
    'h2.section-subtitle:contains("Location Details")',
  ).next("div");
  locationSection.find("p").each((_, element) => {
    locationDetails.push($(element).text().trim());
  });

  const extractRules = (content: string) => {
    const checkInInstructionsMatch =
      content.match(/(CHECK-IN INSTRUCTIONS:[\s\S]*?)(?=HOUSE RULES:|$)/i) ??
      [];
    const houseRulesMatch =
      content.match(/HOUSE RULES:([\s\S]*?)(?=INTERNET INSTRUCTIONS:|$)/i) ??
      [];
    const checkInMatch = content.match(/"Check-in Time"\s*:\s*"([^"]+)"/) ?? [];
    const checkOutMatch =
      content.match(/"Check-out Time"\s*:\s*"([^"]+)"/) ?? [];

    const otherHouseRules =
      houseRulesMatch[1]
        ?.split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .join("\n")
        .replace(/\\n/g, "\n")
        .trim() ?? "";

    const checkInTime = checkInMatch[1] ?? undefined;
    const checkOutTime = checkOutMatch[1] ?? undefined;

    const checkInInfo =
      checkInInstructionsMatch[1]
        ?.split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
        .join("\n")
        .replace(/\\n/g, "\n")
        .trim() ?? undefined;

    return { otherHouseRules, checkInTime, checkOutTime, checkInInfo };
  };

  const { otherHouseRules, checkInTime, checkOutTime, checkInInfo } =
    extractRules(scriptContent);

  const quoteUrl = "https://evolve.com/api/quotes";
  const quoteData = {
    reservation: {
      numberOfAdults: numGuests,
      numberOfChildren: 0,
      numberOfPets: 0,
      internalListingID: propertyId,
      checkInDate: checkIn.toISOString().split("T")[0],
      checkOutDate: checkOut.toISOString().split("T")[0],
    },
    optionalLineItems: [],
    distributor: {
      listingChannel: "Website",
      clickId: "Default",
      deviceType: "Desktop",
      market: "en_us",
      sessionid: "",
      channel: "Website",
    },
  };

  const quoteResponse = await axios.post<QuoteResponse>(quoteUrl, quoteData, {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      Referer: url,
    },
    httpsAgent: proxyAgent,
  });

  const totalPrice = quoteResponse.data.price.total;
  const numNights = getNumNights(checkIn, checkOut);
  const originalNightlyPrice = Math.round((totalPrice / numNights) * 100); // convert to cents

  // const formattedCancellationPolicy = formatCancellationPolicy(validatedQuoteResponse.cancelPolicy);
  // console.log(propertyId, formattedCancellationPolicy);

  const propertyDetails = EvolvePropertySchema.parse({
    id: propertyId,
    name,
    bedrooms: numBedrooms,
    bathrooms: numBathrooms,
    maxOccupancy: maxNumGuests,
    propertyType,
    amenities: allAmenities,
    imageUrls,
    latitude,
    longitude,
    averageRating: avgRating,
    reviewCount: numRatings,
    areaDescription: locationDetails.join("\n"),
    price: originalNightlyPrice,
    description: about,
    otherHouseRules,
    checkInTime,
    checkOutTime,
    checkInInfo,
  });

  return {
    originalListingId: propertyDetails.id,
    name: propertyDetails.name,
    about: propertyDetails.description,
    propertyType: mapPropertyType(propertyDetails.propertyType),
    address,
    city,
    latLngPoint: {
      lat: propertyDetails.latitude,
      lng: propertyDetails.longitude,
    },
    maxNumGuests: propertyDetails.maxOccupancy,
    numBeds,
    numBedrooms: propertyDetails.bedrooms,
    numBathrooms: propertyDetails.bathrooms,
    amenities: propertyDetails.amenities,
    otherAmenities: [],
    imageUrls: propertyDetails.imageUrls,
    originalListingUrl: url,
    avgRating: propertyDetails.averageRating ?? 0,
    numRatings: propertyDetails.reviewCount ?? 0,
    originalListingPlatform: "Evolve" as ListingSiteName,
    originalNightlyPrice: propertyDetails.price,
    cancellationPolicy: "Evolve",
    areaDescription: propertyDetails.areaDescription,
    otherHouseRules: propertyDetails.otherHouseRules,
    checkInInfo: propertyDetails.checkInInfo,
    checkInTime: propertyDetails.checkInTime,
    checkOutTime: propertyDetails.checkOutTime,
    reviews: formattedReviews,
    scrapeUrl: url,
  };
};

const refetchPrice = async (
  propertyId: string,
  checkIn: Date,
  checkOut: Date,
  scrapeUrl: string,
): Promise<number> => {
  try {
    const url = new URL(scrapeUrl);
    const numberOfAdults = parseInt(url.searchParams.get("adults") ?? "0", 10);

    const quoteUrl = "https://evolve.com/api/quotes";
    const quoteData = {
      reservation: {
        numberOfAdults,
        numberOfChildren: 0,
        numberOfPets: 0,
        internalListingID: propertyId,
        checkInDate: checkIn.toISOString().split("T")[0],
        checkOutDate: checkOut.toISOString().split("T")[0],
      },
      optionalLineItems: [],
      distributor: {
        listingChannel: "Website",
        clickId: "Default",
        deviceType: "Desktop",
        market: "en_us",
        sessionid: "",
        channel: "Website",
      },
    };

    const quoteResponse = await axios.post<QuoteResponse>(quoteUrl, quoteData, {
      httpsAgent: proxyAgent,
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        Referer: scrapeUrl,
      },
    });
    const totalPrice = quoteResponse.data.price.total;
    const numNights = getNumNights(checkIn, checkOut);
    const originalNightlyPrice = Math.round((totalPrice / numNights) * 100); // convert to cents
    return originalNightlyPrice;
  } catch {
    throw new Error("Error refetching price");
  }
};

export const evolveVacationRentalScraper: DirectSiteScraper = async ({
  numGuests,
  checkIn,
  checkOut,
  location,
  requestNightlyPrice,
}) => {
  if (!location) {
    throw new Error("Location must be provided for Evolve scraper");
  }
  const geocodingResult = await getCoordinates(location);
  if (!geocodingResult.location) {
    throw new Error("Unable to geocode the provided location");
  }

  const { lat, lng } = geocodingResult.location;

  const cityInfo = await getAddress({ lat, lng });

  if (cityInfo.city === "[Unknown]" && cityInfo.country === "[Unknown]") {
    const countryISO = await getCountryISO({ lat, lng });
    if (!countryISO) {
      throw new Error("Unable to determine location");
    }
    cityInfo.country = countryISO;
  }

  const city = cityInfo.city !== "[Unknown]" ? cityInfo.city : undefined;
  let state =
    cityInfo.stateCode !== "[Unknown]" ? cityInfo.stateCode : undefined;
  let country = cityInfo.country;

  if (city === undefined && state === undefined) {
    [state, country] = [location, country];
  }

  const formattedCountry = country.toLowerCase().replace(/\s+/g, "-");
  const formattedState = state?.toLowerCase().replace(/\s+/g, "-");
  const formattedCity = city?.toLowerCase().replace(/\s+/g, "-");

  let urlLocationParam = `/${formattedCountry}`;
  if (formattedState) {
    urlLocationParam += `/${formattedState}`;
  }
  if (formattedCity) {
    urlLocationParam += `/${formattedCity}`;
  }

  const searchResults = await fetchSearchResults(
    lat,
    lng,
    checkIn,
    checkOut,
    numGuests,
    undefined,
    requestNightlyPrice,
  );

  return await Promise.allSettled(
    searchResults.map((result) =>
      fetchPropertyDetails(
        result.objectID,
        result.Headline,
        result.Bathrooms,
        result.Bedrooms,
        result["Total Beds"],
        result["Max Occupancy"],
        checkIn,
        checkOut,
        urlLocationParam,
        result._geoloc.lat,
        result._geoloc.lng,
        numGuests,
      ),
    ),
  ).then(logAndFilterSettledResults);
};

export const evolveVacationRentalSubScraper: SubsequentScraper = async ({
  originalListingId,
  scrapeUrl,
  checkIn,
  checkOut,
}) => {
  try {
    const availablePropertyIds = await fetchSearchResults(
      0,
      0,
      checkIn,
      checkOut,
      0,
      scrapeUrl,
    );

    const isAvailable = availablePropertyIds.some(
      (prop) => prop.objectID === originalListingId,
    );

    if (!isAvailable) {
      return {
        isAvailableOnOriginalSite: false,
        availabilityCheckedAt: new Date(),
      };
    }
    const originalNightlyPrice = await refetchPrice(
      originalListingId,
      checkIn,
      checkOut,
      scrapeUrl,
    );

    return {
      originalNightlyPrice,
      isAvailableOnOriginalSite: true,
      availabilityCheckedAt: new Date(),
    };
  } catch (error) {
    console.error("Error in evolveVacationRentalSubScraper");
    return {
      isAvailableOnOriginalSite: false,
      availabilityCheckedAt: new Date(),
    };
  }
};
