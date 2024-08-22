import { DirectSiteScraper } from ".";
import { NewProperty } from "@/server/db/schema";
import {z} from "zod";
import { PropertyType, ALL_PROPERTY_TYPES, ListingSiteName } from "@/server/db/schema/common";
import { proxyAgent } from "../server-utils";
import axios from 'axios';

const propertySchema = z.object({
    data: z.object({
        available_properties: z.object({
            property: z.array(
                z.object({
                    id: z.number(), // link: https://integrityarizonavacationrentals.com/ + id
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
                            })
                        )
                    }),
                    gallery: z.object({
                        image: z.array(
                            z.object({
                                image_path: z.string(), // first image has watermark
                            })
                        )
                    }),
                    price: z.number(),
                    taxes: z.number().nullable(),
                    fees: z.number(),
                    total: z.number(),
                    rating_count: z.number().nullable(),
                    rating_average: z.number().nullable(),
                    vrbo_code: z.string().nullable().optional(),
                    airbnb_code: z.string().nullable(),
                }),
            )
        })
    })
})
type IntegrityArizonaPropertyInput = z.infer<typeof propertySchema>;

const convertPropertyType = (inputType: number): PropertyType => {
    if (inputType === 3) return ALL_PROPERTY_TYPES[3]; // return "House";
    else {
        console.log("Unknown property type: ", inputType);
        return ALL_PROPERTY_TYPES[26]; // return "Other";
    }
}

// Function to map validated data to NewProperty
const mapToNewProperty = (validatedData: IntegrityArizonaPropertyInput): NewProperty[] => {
    return validatedData.data.available_properties.property.map((prop) => ({
      originalPropertyId: prop.id,
      name: prop.name,
      about: prop.short_description, // may contain html
      propertyType: convertPropertyType(prop.lodging_type_id),
      address: prop.location_area_name + ", " + prop.city + ", " + prop.state_name,
      city: prop.city,
      latitude: prop.latitude,
      longitude: prop.longitude,
      maxNumGuests: prop.max_occupants,
      numBeds: prop.bedrooms_number, // not provided, but required in NewProperty
      numBedrooms: prop.bedrooms_number,
      numBathrooms: prop.bathrooms_number,
      amenities: prop.unit_amenities.amenity.map((am: { amenity_name: string }) => am.amenity_name), // convert object to list
      otherAmenities: [],
      imageUrls: prop.gallery.image.map((img: {image_path: string}) => img.image_path).slice(1), // remove first image with watermark
      originalListingUrl: `https://integrityarizonavacationrentals.com/${prop.id}`,
      avgRating: prop.rating_average ?? 0,
      numRatings: prop.rating_count ?? 0,
      originalListingPlatform: "IntegrityArizona" as ListingSiteName,
    }));
  };
// the json will either be in some endpoint, or in a script tag in the html of the page.
//   For script tags:
//     1. use scrapeUrl to fetch and parse html and get the script tag(s)
//     2. use json.parse to get the json
//     3. validate/parse the json with zod
//   For the endpoint:
//     1. use axois.get(url, { httpsAgent: proxyAgent }) to get the json directly
//     2. validate/parse the json with zod

export const arizonaScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
} = {}) => {
  if (!checkIn || !checkOut) {
    throw new Error("checkIn and checkOut are required for Arizona scraper");
  }
  const monthStart = checkIn.getMonth() + 1;
  const dayStart = checkIn.getDate();
  const yearStart = checkIn.getFullYear();
  const monthEnd = checkOut.getMonth() + 1;
  const dayEnd = checkOut.getDate();
  const yearEnd = checkOut.getFullYear();

  // ext                   https://integrityarizonavacationrentals.com/wp-admin/admin-ajax.php?action=streamlinecore-api-request&params=%7B%22methodName%22:%22GetPropertyAvailabilityWithRatesWordPress%22,%22params%22:%7B%22sort_by%22:%22price%22,%22return_gallery%22:1,%22max_images_number%22:%225%22,%22use_room_type_logic%22:0,%22get_prices_starting_from%22:0,%22longterm_enabled%22:%220%22,%22additional_variables%22:1,%22extra_charges%22:1,%22use_amenities%22:%22yes%22,%22use_streamshare%22:0,%22startdate%22:%2208%2F29%2F2024%22,%22enddate%22:%2209%2F02%2F2024%22,%22amenities_filter%22:%22%22,%22page_number%22:1,%22page_results_number%22:40,%22use_bundled_fees_in_room_rate%22:1,%22square_feet%22:1,%22floor_name%22:1%7D%7D
  const url =`https://integrityarizonavacationrentals.com/wp-admin/admin-ajax.php?action=streamlinecore-api-request&params=%7B%22methodName%22:%22GetPropertyAvailabilityWithRatesWordPress%22,%22params%22:%7B%22sort_by%22:%22price%22,%22return_gallery%22:1,%22max_images_number%22:%225%22,%22use_room_type_logic%22:0,%22get_prices_starting_from%22:0,%22longterm_enabled%22:%220%22,%22additional_variables%22:1,%22extra_charges%22:1,%22use_amenities%22:%22yes%22,%22use_streamshare%22:0,%22startdate%22:%22${monthStart}%2F${dayStart}%2F${yearStart}%22,%22enddate%22:%22${monthEnd}%2F${dayEnd}%2F${yearEnd}%22,%22amenities_filter%22:%22%22,%22page_number%22:1,%22page_results_number%22:40,%22use_bundled_fees_in_room_rate%22:1,%22square_feet%22:1,%22floor_name%22:1%7D%7D`
  const res = await axios.get(url, { httpsAgent: proxyAgent })
    .then((data) => propertySchema.parse(data)) 
    .then((validatedData) => mapToNewProperty(validatedData))

  console.log(res)
  // 1. fetch the top level search page/landing page with previews of all the properties,
  //    filtered by checkIn and checkOut if provided
  // 2. if its paginated, try to get the urls of each page, and then fetch them all
  //    in parallel (Promise.all), otherwise fetch 1 page at a time
  // 3. get an array of urls/ids of each property and fetch the pages (or json endpoints) in parallel
  // 4. parse out and return the data 😃
  return [];
};
