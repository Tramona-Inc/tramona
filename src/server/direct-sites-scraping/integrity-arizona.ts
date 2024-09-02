import { DirectSiteScraper, SubsequentScraper } from ".";
import { z } from "zod";
import {
  PropertyType,
  ALL_PROPERTY_TYPES,
  ListingSiteName,
} from "@/server/db/schema/common";
import { type Review } from "@/server/db/schema";
import { getNumNights } from "@/utils/utils";
import { ScrapedListing } from "@/server/direct-sites-scraping";
import { axiosWithRetry } from "@/server/server-utils";

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
type IntegrityArizonaPropertyInput = z.infer<typeof propertySchema>;

const convertPropertyType = (inputType: number): PropertyType => {
  if (inputType === 3)
    return ALL_PROPERTY_TYPES[3]; // return "House";
  else {
    console.log("Unknown property type: ", inputType);
    return ALL_PROPERTY_TYPES[26]; // return "Other";
  }
};

const reviewSchema = z.object({
  data: z.object({
    comments: z.array(
      z.object({
        id: z.number(),
        unit_id: z.number(), // property id on this website
        creation_date: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        title: z.string(),
        comments: z.string(),
        points: z.number(),
      }),
    ),
  }),
});
type IntegrityArizonaReviewInput = z.infer<typeof reviewSchema>;

const mapToReview = (validatedData: IntegrityArizonaReviewInput): Review[] => {
  return validatedData.data.comments.map((comment) => ({
    name: `${comment.first_name} ${comment.last_name}`,
    profilePic: "",
    review: comment.comments,
    rating: comment.points,
  }));
};
// Function to map validated data to NewProperty
const mapToScrapedListing = (
  validatedData: IntegrityArizonaPropertyInput,
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
    originalListingPlatform: "IntegrityArizona" as ListingSiteName,
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

export const arizonaScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  numOfOffersInEachScraper = 2,
  requestPrice,
}) => {
  console.log(
    "arizonaScraper: ",
    checkIn,
    checkOut,
    numOfOffersInEachScraper,
    requestPrice,
  );
  // append 0 to month and day if less than 10
  const monthStart = (checkIn.getMonth() + 1).toString().padStart(2, "0");
  const dayStart = checkIn.getDate().toString().padStart(2, "0");
  const yearStart = checkIn.getFullYear().toString();
  const monthEnd = (checkOut.getMonth() + 1).toString().padStart(2, "0");
  const dayEnd = checkOut.getDate().toString().padStart(2, "0");
  const yearEnd = checkOut.getFullYear().toString();

  const url = `https://integrityarizonavacationrentals.com/wp-admin/admin-ajax.php?action=streamlinecore-api-request&params=%7B%22methodName%22:%22GetPropertyAvailabilityWithRatesWordPress%22,%22params%22:%7B%22sort_by%22:%22price%22,%22return_gallery%22:1,%22max_images_number%22:%225%22,%22use_room_type_logic%22:0,%22get_prices_starting_from%22:0,%22longterm_enabled%22:%220%22,%22additional_variables%22:1,%22extra_charges%22:1,%22use_amenities%22:%22yes%22,%22use_streamshare%22:0,%22startdate%22:%22${monthStart}%2F${dayStart}%2F${yearStart}%22,%22enddate%22:%22${monthEnd}%2F${dayEnd}%2F${yearEnd}%22,%22amenities_filter%22:%22%22,%22page_number%22:1,%22page_results_number%22:40,%22use_bundled_fees_in_room_rate%22:1,%22square_feet%22:1,%22floor_name%22:1%7D%7D`;
  // console.log("scrapedUrl: ", url)
  let properties = await axiosWithRetry
    .get<string>(url)
    .then((response) => response.data)
    .then((data) => propertySchema.parse(data))
    .then((validatedData) =>
      mapToScrapedListing(validatedData, checkIn, checkOut, url),
    )
    .catch((error) => {
      return [];
    });

  if (requestPrice) {
    properties = properties.filter((p) => {
      const price = p.originalNightlyPrice!;
      return price >= requestPrice * 0.9 && price <= requestPrice * 1.1;
    });
  }
  if (numOfOffersInEachScraper > 0) {
    properties = properties.slice(0, numOfOffersInEachScraper);
  }
  // Fetch and append reviews for each property
  const propertiesWithReviews = await Promise.all(
    properties.map(async (p) => {
      const reviewUrl = `https://integrityarizonavacationrentals.com/wp-admin/admin-ajax.php?action=streamlinecore-api-request&params=%7B%22methodName%22:%22GetAllFeedback%22,%22params%22:%7B%22unit_id%22:${p.originalListingId},%22order_by%22:%22newest_first%22,%22show_booking_dates%22:1,%22madetype_id%22:2%7D%7D`;
      // console.log("reviewScrapedUrl: ", reviewUrl)
      const reviews = await axiosWithRetry
        .get<string>(reviewUrl, { timeout: 30000 })
        .then((response) => response.data)
        .then((data) => reviewSchema.parse(data))
        .then((validatedData) => mapToReview(validatedData));

      return {
        ...p,
        reviews: reviews,
      };
    }),
  );

  console.log(propertiesWithReviews[0]);
  return propertiesWithReviews;
};

export const arizonaSubScraper: SubsequentScraper = async ({
  originalListingId,
  scrapeUrl,
  checkIn,
  checkOut,
}) => {
  const matchingProperty = await axiosWithRetry
    .get<string>(scrapeUrl)
    .then((response) => response.data)
    .then((data) => propertySchema.parse(data))
    .then((validatedData) => {
      const matchingProperty =
        validatedData.data.available_properties.property.find(
          (prop) => prop.id === parseInt(originalListingId),
        );
      return matchingProperty;
    });

  if (!matchingProperty) {
    return {
      isAvailableOnOriginalSite: false,
      availabilityCheckedAt: new Date(),
    };
  }
  const originalNightlyPrice =
    Math.round(matchingProperty.total / getNumNights(checkIn, checkOut)) * 100; // convert to cents

  return {
    originalNightlyPrice: originalNightlyPrice,
    isAvailableOnOriginalSite: true,
    availabilityCheckedAt: new Date(),
  };
};
