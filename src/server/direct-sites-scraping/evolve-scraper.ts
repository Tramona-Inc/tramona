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

const mapPropertyType = (scrapedType: string): PropertyType => {
  const typeMap: Record<string, PropertyType> = {
    House: "House",
    Condo: "Condominium",
    Cabin: "Cabin",
    Townhome: "Townhouse",
    Apartment: "Apartment" || "Studio",
    Cottage: "Cottage",
    Villa: "Villa",
  };
  return typeMap[scrapedType] || "Other";
};

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
  return validatedData.data.available_properties.property.map((prop) => ({
    originalListingId: prop.id.toString(),
    name: prop.name,
    about: prop.short_description, // may contain html
    propertyType: convertPropertyType(prop.lodging_type_id),
    address:
      prop.location_area_name + ", " + prop.city + ", " + prop.state_name,
    city: prop.city,
    latitude: prop.latitude,
    longitude: prop.longitude,
    maxNumGuests: prop.max_occupants,
    numBeds: prop.bedrooms_number, // not provided, but required in NewProperty
    numBedrooms: prop.bedrooms_number,
    numBathrooms: prop.bathrooms_number,
    amenities: prop.unit_amenities.amenity.map(
      (am: { amenity_name: string }) => am.amenity_name,
    ), // convert object to list
    otherAmenities: [],
    imageUrls: prop.gallery.image
      .map((img: { image_path: string }) => img.image_path)
      .slice(1), // remove first image with watermark
    originalListingUrl: `https://integrityarizonavacationrentals.com/${prop.id}`,
    avgRating: prop.rating_average ?? 0,
    numRatings: prop.rating_count ?? 0,
    originalListingPlatform: "Evolve" as ListingSiteName,
    reservedDateRanges: [
      {
        start: checkIn,
        end: checkOut,
      },
    ],
    originalNightlyPrice:
      Math.round(prop.total / getNumNights(checkIn, checkOut)) * 100, // convert to cents
    reviews: [],
    scrapeUrl: scrapeUrl,
  }));
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
      propertyType: hit["Property Type"],
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
    const [maxNumGuests, numBedrooms, numBathrooms] = detailInfo
      .match(/\d+/g)
      ?.map(Number) ?? [10, 20, 30];

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

    const checkInTime = $(".Detail-Overview_checkInTime__Y5Lp3").text().trim();
    const checkOutTime = $(".Detail-Overview_checkOutTime__3XqMR")
      .text()
      .trim();

    const scrapedListing: ScrapedListing = {
      originalListingId: propertyId,
      name,
      about,
      propertyType,
      address,
      city,
      latitude,
      longitude,
      maxNumGuests,
      numBeds: numBedrooms, // Assuming one bed per bedroom
      numBedrooms,
      numBathrooms,
      amenities,
      otherAmenities: [],
      imageUrls,
      originalListingUrl: url,
      avgRating,
      numRatings,
      originalListingPlatform: "Evolve" as ListingSiteName,
      reservedDateRanges: [{ start: checkIn, end: checkOut }],
      originalNightlyPrice: originalNightlyPrice * 100, // Convert back to cents
      reviews: [], // You may want to implement a separate function to fetch reviews
      scrapeUrl: url,
      checkInTime,
      checkOutTime,
      hostId: "", // Not available in the provided HTML
      hostTeamId: 0, // Not available in the provided HTML
      roomsWithBeds: [], // Not available in the provided HTML
      roomType: "Entire place", // Assuming Evolve only lists entire places
      hostName: "", // Not available in the provided HTML
      hostProfilePic: "", // Not available in the provided HTML
      hostNumReviews: 0, // Not available in the provided HTML
      hostRating: 0, // Not available in the provided HTML
      checkInInfo: "", // Not available in the provided HTML
      areaDescription: $(".Location-Details_content__ZOCD0").text().trim(),
      mapScreenshot: "", // Not available in the provided HTML
      // cancellationPolicy: $('.CancellationPolicy_description__63gc5').text().trim(),
      createdAt: new Date(),
      isPrivate: false,
      ageRestriction: 0, // Not available in the provided HTML
      priceRestriction: 0, // Not available in the provided HTML
      stripeVerRequired: false,
      propertyStatus: "Listed",
      airbnbBookUrl: "", // Not available in the provided HTML
      hostImageUrl: "", // Not available in the provided HTML
      pricingScreenUrl: "", // Not available in the provided HTML
      currency: "USD",
      iCalLink: "", // Not available in the provided HTML
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
  // const searchUrl = `https://evolve.com/vacation-rentals/search?query=Manhattan-Beach--CA--USA&adults=2&children=1&startDate=${checkIn.toISOString().split('T')[0]}&endDate=${checkOut.toISOString().split('T')[0]}`;
  const searchUrl =
    "https://evolve.com/vacation-rentals/search?query=Manhattan-Beach--CA--USA&adults=2&startDate=20240905&endDate=20240914";

  // const propertyIds = await fetchSearchResults(searchUrl);

  // fetchSearchResults(location, numGuests, checkIn, checkOut)
  //   .then(properties => console.log('Final result:', properties))
  //   .catch(error => console.error('Error:', error));

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

  // if (propertyIds.length === 0) {
  //   console.warn('No property IDs found in search results');
  //   return [];
  // }

  // const properties = await Promise.all(
  //   propertyIds.slice(0, numOfOffersInEachScraper).map(id => fetchPropertyDetails(id, checkIn, checkOut))
  // );

  // const validProperties = properties.filter((prop): prop is EvolveProperty => prop !== null);
  // console.log(`Successfully fetched details for ${validProperties.length} properties`);

  // return validProperties.map(prop => mapToScrapedListing(prop, searchUrl));
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
