import { DirectSiteScraper } from ".";
import { NewProperty, Review } from "../db/schema";
import axios from 'axios';
import { z } from 'zod';

const PropertySchema = z.object({
  id: z.string(),
  ss_name: z.string(),
  fs_nid$field_location$latitude: z.number(),
  fs_nid$field_location$longitude: z.number(),
  ss_nid$url: z.string(),
  is_rc_core_item_reviews_count: z.number(),
  fs_rc_core_item_reviews_rating: z.number(),
  fs_rc_core_lodging_product$baths: z.number(),
  fs_rc_core_lodging_product$beds: z.number(),
  is_rc_core_lodging_product$occ_total: z.number(),
  ss_vrweb_default_image: z.string(),
});

const ResponseSchema = z.object({
  response: z.object({
    docs: z.array(PropertySchema)
  })
});

export const cbIslandVacationsScraper: DirectSiteScraper = async () => {
  const baseUrl = 'https://www.cbislandvacations.com/hawaii-vacation-rentals';
  const jsonUrl = 'https://www.cbislandvacations.com/solr-search/select?q=*:*&fq=index_id:rci&rows=1000&wt=json';

  try {
    const response = await axios.get(jsonUrl);
    const validatedData = ResponseSchema.parse(response.data);

    return validatedData.response.docs.map(property => {
        const newProperty: NewProperty & {
            originalListingUrl: string;
            reservedDateRanges: { start: Date; end: Date }[];
            reviews: Review[];
          } = {
            name: property.ss_name,
            about: '', // You'll need to get this from somewhere
            propertyType: 'Condominium', // You'll need to determine this
            maxNumGuests: property.is_rc_core_lodging_product$occ_total,
            numBeds: property.fs_rc_core_lodging_product$beds,
            numBedrooms: property.fs_rc_core_lodging_product$beds, // Assuming 1 bed per bedroom
            address: '', // You'll need to get this from somewhere
            latitude: property.fs_nid$field_location$latitude,
            longitude: property.fs_nid$field_location$longitude,
            city: '', // You'll need to get this from somewhere
            imageUrls: [property.ss_vrweb_default_image],
            amenities: [], // You'll need to populate this
            otherAmenities: [], // You'll need to populate this
            roomType: 'Entire place', // You'll need to determine this
            originalListingUrl: `${baseUrl}${property.ss_nid$url}`,
            reservedDateRanges: [], // This information is not available in the provided JSON
            // reviews: [{
            //   rating: property.fs_rc_core_item_reviews_rating,
            //   numReviews: property.is_rc_core_item_reviews_count,
            // }],
            reviews: [{ name: 'hello', profilePic: 'pic', rating: 5, review: 'good' }],
            // Include other optional properties as needed
          };
          return newProperty
    });
  } catch (error) {
    console.error('Error scraping CB Island Vacations:', error);
    return [];
  }
};