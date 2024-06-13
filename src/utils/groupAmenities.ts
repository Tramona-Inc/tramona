import {
  type Amenity,
  amenityCategories,
} from "@/server/db/schema/tables/propertyAmenities";
import { groupBy } from "lodash";

function getAmenityCategory(amenity: Amenity) {
  return amenityCategories.find((c) => c.amenities.includes(amenity))!.category;
}

export function groupAmenities(amenities: Amenity[]) {
  return groupBy(amenities, getAmenityCategory);
}
