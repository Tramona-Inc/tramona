import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";
import {
  DirectSiteScraper,
  SubsequentScraper,
  ScrapedListing,
} from "@/server/direct-sites-scraping";
import { Review, PropertyType } from "@/server/db/schema";
import { ListingSiteName } from "@/server/db/schema/common";
import { getNumNights } from "@/utils/utils";
import puppeteer from "puppeteer";
import { algoliasearch, SearchResponse } from "algoliasearch";
// import algoliasearch from 'algoliasearch/lite';
import { getCoordinates } from "@/server/google-maps";

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
  price: z.number(),
  description: z.string(),
});

const evolvePropertyTypes: Record<string, PropertyType> = {
  // mapping scraped property types to our property types
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

function mapPropertyType(scrapedType: string): PropertyType {
  const normalizedType = scrapedType.trim().toLowerCase();
  for (const [key, value] of Object.entries(evolvePropertyTypes)) {
    if (normalizedType.includes(key.toLowerCase())) {
      return value;
    }
  }
  return "Other";
}

// Define the EvolveProperty interface
interface EvolveProperty {
  id: string;
  name: string;
  propertyType: string;
  averagePerNight: number;
  averageRating: number;
  numberOfReviews: number;
  images: Array<{ URL: string; SortOrder: number; Caption: string }>;
  bedrooms: number;
  bathrooms: number;
  maxOccupancy: number;
  latitude?: number;
  longitude?: number;
}

const propertySchema = z.object({
  data: z.object({
    available_properties: z.object({
      property: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          short_description: z.string(), // may contain html
          lodging_type_id: z.number(),
          neighborhood_name: z.string().nullable(),
          city: z.string(),
          state_name: z.string(),
          location_area_name: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          bedrooms_number: z.number(),
          bathrooms_number: z.number(),
          max_occupants: z.number(),
          unit_amenities: z.object({
            amenity: z.array(
              z.object({
                amenity_name: z.string(),
              }),
            ),
          }),
          gallery: z.object({
            image: z.array(
              z.object({
                image_path: z.string(), // first image has watermark
              }),
            ),
          }),
          price: z.number(),
          taxes: z.number().nullable(),
          fees: z.number(),
          total: z.number(),
          rating_count: z.number().nullable(),
          rating_average: z.number().nullable(),
          vrbo_code: z.string().nullable().optional(),
          airbnb_code: z.string().nullable().optional(),
        }),
      ),
    }),
  }),
});

type EvolvePropertyInput = z.infer<typeof propertySchema>;

const mapToScrapedListing = (
  validatedData: EvolvePropertyInput,
  checkIn: Date,
  checkOut: Date,
  scrapeUrl: string,
): ScrapedListing[] => {
  return {
    originalListingId: prop.is_eid.toString(),
    name: prop.ss_name,
    about: description,
    propertyType: mapPropertyType(prop.sm_nid$rc_core_term_type$name[0] ?? ""),
    address: address,
    city: prop.sm_nid$rc_core_term_city_type$name[0] ?? "",
    latitude: prop.fs_nid$field_location$latitude,
    longitude: prop.fs_nid$field_location$longitude,
    maxNumGuests: prop.is_rc_core_lodging_product$occ_total,
    numBeds: prop.fs_rc_core_lodging_product$beds,
    numBedrooms: prop.fs_rc_core_lodging_product$beds,
    numBathrooms: prop.fs_rc_core_lodging_product$baths,
    amenities: cleanAmenities(prop.sm_nid$rc_core_term_general_amenities$name),
    otherAmenities: [],
    imageUrls: images,
    originalListingUrl: prop.ss_nid$url,
    avgRating: prop.fs_rc_core_item_reviews_rating ?? 0,
    numRatings: prop.is_rc_core_item_reviews_count ?? 0,
    originalListingPlatform: "Evolve" as ListingSiteName,
    originalNightlyPrice: originalNightlyPrice,
    reviews: reviews,
    scrapeUrl: scrapeUrl,
  };
};

const fetchSearchResults = async (
  location: string,
  numGuests: number,
  checkIn: Date,
  checkOut: Date,
): Promise<EvolveProperty[]> => {
  const client = algoliasearch(
    "2U6AXFDIV3",
    "bb822d4fb11ce6c3a7356f182a0d5c90",
  );

  if (!checkIn || !checkOut) {
    throw new Error("Check-in and check-out dates must be provided");
  }

  const geocodingResult = await getCoordinates(location);
  if (!geocodingResult || !geocodingResult.location) {
    throw new Error("Unable to geocode the provided location");
  }

  const { lat, lng } = geocodingResult.location;

  const startDate = checkIn.toISOString().split("T")[0]?.replace(/-/g, "");
  const endDate = checkOut.toISOString().split("T")[0]?.replace(/-/g, "");
  const numNights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  );

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

  try {
    const { results } = await client.search([
      {
        indexName: "prod_EvolveListings",
        params: {
          aroundLatLng: `${lat}, ${lng}`,
          aroundPrecision: 8000,
          aroundRadius: 48280, // Approx. 30 miles
          filters,
          attributesToRetrieve: ["*", "-amenities"],
          clickAnalytics: true,
          facets: [
            "amenities.Amenities",
            "amenities.Accessibility",
            "amenities.Area Activities",
            `LOS_PriceAverages.${startDate}.${numNights}`,
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
          numericFilters: [
            `Max Occupancy>=${numGuests}`,
            "Max Occupancy<=99",
            // `LOS_PriceAverages.${startDate}.${numNights}:>0`,
          ],
          page: 0,
          hitsPerPage: 24,
          analytics: true,
          ruleContexts: ["isDatedSearch"],
        },
      },
    ]);

    const searchResponse = results[0];
    console.log(`Found ${searchResponse.hits.length} results for ${location}`);
    console.log(
      "Property IDs:",
      searchResponse.hits.map((hit) => [hit.objectID, hit.Headline]),
    );

    const properties = searchResponse.hits.map((hit) => ({
      id: hit.objectID,
      name: hit.Headline,
      propertyType: mapPropertyType(hit["Property Type"]),
      averagePerNight:
        hit[`LOS_PriceAverages.${startDate}.${numNights}`] / numNights,
      averageRating: hit["Average Rating"],
      numberOfReviews: hit["Number of Reviews"],
      images: hit.images,
      bedrooms: hit.Bedrooms,
      bathrooms: hit.Bathrooms,
      maxOccupancy: hit["Max Occupancy"],
      latitude: hit._geoloc?.lat,
      longitude: hit._geoloc?.lng,
    }));

    return properties;
  } catch (error) {
    console.error("Error querying Algolia:", error);
    return [];
  }
};

const fetchPropertyDetails = async (
  propertyId: string,
  checkIn: Date,
  checkOut: Date,
): Promise<ScrapedListing> => {
  try {
    const url = `https://evolve.com/vacation-rentals/us/ca/alameda/${propertyId}?adults=2&startDate=${checkIn.toISOString().split("T")[0]}&endDate=${checkOut.toISOString().split("T")[0]}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const name = $("h1").text().trim();
    const about = $(".Description_descriptionContent__dG7mv").text().trim();
    const propertyType = $(".Detail-Overview_resultType__UrnDo")
      .text()
      .trim() as PropertyType;
    const address = $(".Detail-Overview_resultLocation__3SNLW span")
      .last()
      .text()
      .trim();
    const city = address.split(",")[0]?.trim() ?? "";

    const detailInfo = $(".Detail-Overview_resultDetailInfo__5LqyW")
      .text()
      .trim();

    const detailMatch = detailInfo.match(/Sleeps (\d+).*?(\d+) BR.*?(\d+) BA/) ?? [0, 0, 0];
    const [maxNumGuests, numBedrooms, numBathrooms] = detailMatch.slice(1).map(Number);

    const numBeds = $(".Sleeping-Arrangements_bedroom___Bj1r").length;

    const imageUrls = $(".Image-Gallery_clickablePhoto__SRbpl")
      .map((_, el) => $(el).attr("src"))
      .get();

    const avgRating = parseFloat(
      $(".RatingAndReview_main__JiB84 span").first().text().trim(),
    );
    const numRatings = parseInt(
      $(".RatingAndReview_reviews__GlplL").text().trim(),
    );

    const originalNightlyPrice =
      parseInt(
        $(".TotalPrice_price__LgGhz")
          .text()
          .replace(/[^0-9]/g, ""),
      ) / 100; // Convert cents to dollars

    const amenities = $(".Amenities_amenity___Avpr")
      .map((_, el) => $(el).text().trim())
      .get();

    const latitude = parseFloat($("#detailMap").attr("data-lat") || "0");
    const longitude = parseFloat($("#detailMap").attr("data-lng") || "0");

    // const checkInTime = $(".Detail-Overview_checkInTime__Y5Lp3").text().trim();
    // const checkOutTime = $(".Detail-Overview_checkOutTime__3XqMR")
    //   .text()
    //   .trim();

    const scrapedListing: ScrapedListing = {
      originalListingId: propertyId,
      name,
      about,
      propertyType: mapPropertyType(propertyType),
      address,
      city,
      latitude,
      longitude,
      maxNumGuests,
      numBeds,
      numBedrooms,
      numBathrooms,
      amenities,
      otherAmenities: [],
      imageUrls,
      originalListingUrl: url,
      avgRating,
      numRatings,
      originalListingPlatform: "Evolve" as ListingSiteName,
      originalNightlyPrice: originalNightlyPrice * 100, // Convert back to cents
      reviews: [], // You may want to implement a separate function to fetch reviews
      scrapeUrl: url,
    };
    console.log(`FETCHED details for property ${propertyId}:`, scrapedListing);
    return scrapedListing;
  } catch (error) {
    console.error(`Error fetching details for property ${propertyId}:`, error);
    throw error;
  }
};

export const evolveVacationRentalScraper: DirectSiteScraper = async ({
  location,
  numGuests,
  checkIn,
  checkOut,
  numOfOffersInEachScraper = 5,
}) => {
  const searchResults = await fetchSearchResults(
    location,
    numGuests,
    checkIn,
    checkOut,
  );
  const propertyIds = searchResults
    .slice(0, numOfOffersInEachScraper)
    .map((result) => result.id);

  const scrapedListings = await Promise.all(
    propertyIds.map((id) => fetchPropertyDetails(id, checkIn, checkOut)),
  );
  console.log("YOOO scrapedListings:", scrapedListings);

  return [];
};

export const evolveVacationRentalSubScraper: SubsequentScraper = async ({
  originalListingId,
  scrapeUrl,
  checkIn,
  checkOut,
}) => {
  try {
    const property = await fetchPropertyDetails(
      originalListingId,
      checkIn,
      checkOut,
    );

    if (!property) {
      return {
        isAvailableOnOriginalSite: false,
        availabilityCheckedAt: new Date(),
      };
    }

    const originalNightlyPrice = Math.round(
      property.price / getNumNights(checkIn, checkOut),
    );

    return {
      originalNightlyPrice,
      isAvailableOnOriginalSite: true,
      availabilityCheckedAt: new Date(),
    };
  } catch (error) {
    // console.error("Error in evolveVacationRentalSubScraper", error);
    return {
      isAvailableOnOriginalSite: false,
      availabilityCheckedAt: new Date(),
    };
  }
};
