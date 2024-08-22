import { NewProperty } from "@/server/db/schema";
import {z} from "zod";
import { promises as fs } from 'fs';
import { PropertyType, ALL_PROPERTY_TYPES, propertyTypeEnum } from "@/server/db/schema/common";

const schema = z.object({
    data: z.object({
        property: z.array(
            z.object({
                id: z.number(), // link: https://integrityarizonavacationrentals.com/ + id
                name: z.string(),
                short_description: z.string(), // may contain html
                lodging_type_id: z.number(),
                property_code: z.string().nullable(), // likely address, could be null
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
                price_data: z.object({
                    daily: z.number(),
                    currency: z.string(),
                }),
                rating_count: z.number().nullable(),
                rating_average: z.number().nullable(),
            }),
        )
    })
})


type IntegrityArizonaInput = z.infer<typeof schema>;

const convertPropertyType = (inputType: number): PropertyType => {
    if (inputType === 3) return ALL_PROPERTY_TYPES[3]; // return "House";
    else {
        console.log("Unknown property type: ", inputType);
        return ALL_PROPERTY_TYPES[26]; // return "Other";
    }
}

// Function to map validated data to NewProperty
const mapToNewProperty = (validatedData: IntegrityArizonaInput): NewProperty[] => {
    return validatedData.data.property.map((prop) => ({
      id: prop.id,
      name: prop.name,
      about: prop.short_description, // may contain html
      propertyType: convertPropertyType(prop.lodging_type_id),
      address: prop.property_code?? "", 
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
    }));
  };
                            // https://integrityarizonavacationrentals.com/wp-admin/admin-ajax.php?action=streamlinecore-api-request&params=%7B%22methodName%22:%22GetPropertyAvailabilityWithRatesWordPress%22,%22params%22:%7B%22sort_by%22:%22price%22,%22return_gallery%22:1,%22max_images_number%22:%225%22,%22use_room_type_logic%22:0,%22get_prices_starting_from%22:0,%22longterm_enabled%22:%220%22,%22additional_variables%22:1,%22extra_charges%22:1,%22use_amenities%22:%22yes%22,%22use_streamshare%22:0,%22startdate%22:%2208%2F29%2F2024%22,%22enddate%22:%2209%2F02%2F2024%22,%22location_area_id%22:20691,%22amenities_filter%22:%22%22,%22page_number%22:1,%22page_results_number%22:40,%22use_bundled_fees_in_room_rate%22:1,%22square_feet%22:1,%22floor_name%22:1%7D%7D
// const res = await fetch("https://integrityarizonavacationrentals.com/wp-admin/admin-ajax.php?action=streamlinecore-api-request&params=%7B%22methodName%22:%22GetPropertyListWordPress%22,%22params%22:%7B%22sort_by%22:%22price_daily%22,%22return_gallery%22:1,%22max_images_number%22:%225%22,%22use_room_type_logic%22:0,%22get_prices_starting_from%22:0,%22longterm_enabled%22:%220%22,%22additional_variables%22:1,%22extra_charges%22:1,%22use_amenities%22:%22yes%22,%22use_streamshare%22:0,%22page_number%22:1,%22page_results_number%22:40%7D%7D")
const res = await fs.readFile('admin-ajax.json', 'utf-8')
    // .then((res) => res.json()) // parse response as JSON
    // .then((data) => schema.parse(data)) // for fetching from the endpoint
    .then((data) => schema.parse(JSON.parse(data)))
    .then((validatedData) => mapToNewProperty(validatedData))
    .then((properties) => console.log(properties[0]))
    // .then((res) => console.log(res.data.property[0]))  //?.unit_amenities.amenity.map(a => a.amenity_name)
    // .then((res) => console.log(res.data.property.map((property) => property.id)))
    // .then(parsedData => parsedData.data.property.map(property => ({
    //     id: property.id,
    //     name: property.name,
    //     address: `${property.city}, ${property.state_name}`,
    //     latitude: property.latitude,
    //     longitude: property.longitude,
    //     numBedrooms: property.bedrooms_number,
    //     numBathrooms: property.bathrooms_number,
    //     maxNumGuests: property.max_occupants,
    //     amenities: property.unit_amenities.amenity.map(a => a.amenity_name),
    //     imageUrls: property.gallery.image.map(img => img.image_path),
    //     hostName: property.variable_agent,
    //     hostProfilePic: property.default_thumbnail_path,
    //     otherHouseRules: property.restriction_message ?? "",
    //     city: property.city,
    //     originalListingUrl: property.flyer_url,
    //     priceRestriction: property.price,
    //   })))
    //   .then(properties => console.log(properties));