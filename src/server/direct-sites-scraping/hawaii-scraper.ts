import { DirectSiteScraper } from "@/server/direct-sites-scraping";
import { NewProperty, Review } from "@/server/db/schema";
import axios from "axios";
import { z } from "zod";
import querystring from "querystring";
import { PropertyType } from "@/server/db/schema";
import * as cheerio from "cheerio";

const hawaiiPropertyTypes: Record<string, PropertyType> = {
  // mapping scraped property types to our property types
  Condo: "Condominium",
  Apartment: "Apartment",
  House: "House",
  Villa: "Villa",
  Cottage: "Cottage",
  Townhouse: "Townhouse",
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

const PropertySchema = z.object({
  id: z.string(),
  ss_name: z.string(),
  fs_nid$field_location$latitude: z.number(),
  fs_nid$field_location$longitude: z.number(),
  ss_nid$url: z.string(),
  is_rc_core_item_reviews_count: z.number().optional(),
  fs_rc_core_item_reviews_rating: z.number().optional(),
  fs_rc_core_lodging_product$baths: z.number(),
  fs_rc_core_lodging_product$beds: z.number(),
  is_rc_core_lodging_product$occ_total: z.number(),
  ss_vrweb_default_image: z.string(),
  propertyType: z.custom<PropertyType>(),
  sm_nid$rc_core_term_city_type$name: z.string(), // city
  sm_nid$rc_core_term_general_amenities$name: z.array(z.string()),
});

const ResponseSchema = z.object({
  response: z.object({
    numFound: z.number(),
    start: z.number(),
    docs: z.array(z.unknown()),
  }),
});

interface PriceFilteredProperty {
  eid: number;
  name: string;
  prices: {
    eid: number;
    p: number;
    c: string;
    n: string;
    qp: {
      rcav: {
        begin: string;
        end: string;
        adult: string;
        child: string;
        IDs: Record<string, string[]>;
      };
      eid: number;
    };
    do: null;
    qo: null;
    dn: null;
    dd: null;
    bt: number;
    et: number;
    b: string;
    e: string;
  }[];
  type: string;
}

function mapPropertyType(scrapedType: string): PropertyType {
  const normalizedType = scrapedType.trim().toLowerCase();
  for (const [key, value] of Object.entries(hawaiiPropertyTypes)) {
    if (normalizedType.includes(key.toLowerCase())) {
      return value;
    }
  }
  return "Other";
}

function cleanAmenities(amenities: string[]): string[] {
  const excludedAmenities = new Set(["tub"]);

  return amenities
    .filter((amenity) => !excludedAmenities.has(amenity.toLowerCase()))
    .map((amenity) => {
      const words = amenity.split(" ");
      const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      );
      return capitalizedWords.join(" ");
    });
}

// This code is relevant to fetching all properties from the site
// const fetchAllPropertyIds = async (): Promise<string[]> => {
//   const solrUrl = "https://www.cbislandvacations.com/solr/";
//   const rowsPerPage = 100;
//   const start = 0;
//   const uniqueIds = new Set<string>();
//   let totalFound = 0;

//   console.log(`Fetching property IDs: start=${start}, rows=${rowsPerPage}`);

//   try {
//     const formData = querystring.stringify({
//       fq: "index_id:rci",
//       wt: "json",
//       q: "*:*",
//       fl: "id",
//       start: start.toString(),
//       rows: rowsPerPage.toString(),
//     });

//     const response = await axios({
//       method: "POST",
//       url: solrUrl,
//       data: formData,
//     });

//     const validatedData = ResponseSchema.parse(response.data);

//     const initialSize = uniqueIds.size;
//     validatedData.response.docs.forEach((doc: unknown) => {
//       const typedDoc = doc as { id?: string };
//       if (typedDoc.id) uniqueIds.add(typedDoc.id);
//     });
//     totalFound = validatedData.response.numFound;

//     const newUniqueCount = uniqueIds.size - initialSize;
//     console.log(
//       `Fetched ${validatedData.response.docs.length} IDs, ${newUniqueCount} new unique. Total unique: ${uniqueIds.size}/${totalFound}`,
//     );
//   } catch (error) {
//     console.error("Error fetching property IDs:", error);
//     return [];
//   }

//   const allUniqueIds = Array.from(uniqueIds);
//   console.log("All unique property IDs:", allUniqueIds);
//   return allUniqueIds;
// };

const fetchPropertyDetails = async (
  id?: string,
  eid?: string,
): Promise<z.infer<typeof PropertySchema> | null> => {
  const solrUrl = "https://www.cbislandvacations.com/solr/";

  try {
    let formData: string | undefined;
    if (id) {
      formData = querystring.stringify({
        fq: "index_id:rci",
        wt: "json",
        q: `id:${id}`,
        fl: "*",
      });
    } else if (eid) {
      formData = querystring.stringify({
        fq: "index_id:rci",
        wt: "json",
        q: `is_eid:${eid}`,
        fl: "*",
      });
    }

    if (!formData) {
      console.error("Neither id nor eid provided to fetchPropertyDetails");
      return null;
    }

    const response = await axios({
      method: "POST",
      url: solrUrl,
      data: formData,
    });

    const validatedData = ResponseSchema.parse(response.data);
    let mappedPropertyType: PropertyType = "Other";
    let scrapedCityType = "Other";
    if (validatedData.response.docs.length > 0) {
      const propertyData = validatedData.response.docs[0] as Record<
        string,
        unknown
      >;
      if (
        Array.isArray(propertyData.sm_nid$rc_core_term_type$name) &&
        propertyData.sm_nid$rc_core_term_type$name.length > 0
      ) {
        const scrapedPropertyType = propertyData
          .sm_nid$rc_core_term_type$name[0] as string;
        mappedPropertyType = mapPropertyType(scrapedPropertyType);
      }
      if (
        Array.isArray(propertyData.sm_nid$rc_core_term_city_type$name) &&
        propertyData.sm_nid$rc_core_term_city_type$name.length > 0
      ) {
        scrapedCityType = propertyData
          .sm_nid$rc_core_term_city_type$name[0] as string;
      }

      return PropertySchema.parse({
        ...propertyData,
        propertyType: mappedPropertyType,
        sm_nid$rc_core_term_city_type$name: scrapedCityType,
      });
    } else {
      console.log(`No data found for property ID: ${id ?? eid}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching details for property ${id ?? eid}:`, error);
    return null;
  }
};

function extractAddressFromDirectionsLink(html: string): string {
  const $ = cheerio.load(html);
  const link = $("a.vrweb-driving-directions");

  if (link.length > 0) {
    const href = link.attr("href");
    if (href) {
      const match = href.match(/daddr=([^&\s]+)/);
      if (match?.[1]) {
        return decodeURIComponent(match[1].replace(/\+/g, " "));
      }
    }
  }
  return "";
}

async function scrapePropertyPage(url: string): Promise<{
  reviews: Review[];
  images: string[];
  description: string;
  address: string;
}> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data as string);

    const reviews: Review[] = [];
    $(".rc-core-item-review").each((_, element) => {
      const fullText = $(element).find("b").text().trim();

      const name: string =
        fullText.match(/Reviewed on .*? by\s*(.*?)(?=,|\s*$)/)?.[1]?.trim() ??
        "Anonymous";

      const ratingStars = $(element).find(
        ".rc-core-review-scores > div:first-child .rc-item-rating-stars .on",
      ).length;

      const reviewHtml =
        $(element).find(".rc-core-review-comment p").html() ?? "";
      const reviewText = processReviewText(reviewHtml);

      reviews.push({
        name,
        profilePic: "",
        rating: ratingStars,
        review: reviewText || "No review text available",
      });
    });

    const images: string[] = [];

    $("img.rsTmb").each((_, element) => {
      const src = $(element).attr("src");
      if (src) {
        images.push(src);
      }
    });

    const description =
      $(".field.field-name-body").text().trim() || "No description available";

    const directionsLinkHtml =
      $("a.vrweb-driving-directions").parent().html() ?? "";
    const address = extractAddressFromDirectionsLink(directionsLinkHtml);

    return { reviews, images, description, address };
  } catch (error) {
    console.error(`Error scraping property page ${url}:`, error);
    return { reviews: [], images: [], description: "", address: "" };
  }
}

function processReviewText(text: string): string {
  const processedText = text.replace(/\\u003C/g, "<").replace(/\\u003E/g, ">");

  const $ = cheerio.load(processedText);
  $("br").replaceWith("\n");

  return $.root()
    .text()
    .trim()
    .replace(/\n{3,}/g, "\n\n");
}

function isPriceFilteredProperty(item: unknown): item is PriceFilteredProperty {
  return (
    typeof item === "object" &&
    item !== null &&
    "eid" in item &&
    "name" in item &&
    "prices" in item &&
    "type" in item &&
    Array.isArray((item as PriceFilteredProperty).prices)
  );
}

const fetchAvailablePropertyEids = async (
  startDate: string,
  endDate: string,
  adults = 1,
  children = 0,
): Promise<string[]> => {
  const filteredPropertiesUrl =
    "https://www.cbislandvacations.com/rcapi/item/avail/search";

  const params = new URLSearchParams({
    "rcav[begin]": startDate,
    "rcav[end]": endDate,
    "rcav[adult]": adults.toString(),
    "rcav[child]": children.toString(),
    "rcav[flex]": "",
    "rcav[flex_type]": "d",
  });

  const url = `${filteredPropertiesUrl}?${params.toString()}`;
  console.log("Sending request to URL:", url);

  try {
    const response = await axios.get(url);
    console.log("Response status:", response.status);

    if (Array.isArray(response.data)) {
      console.log(`Found ${response.data.length} available properties`);

      const uniqueEids = new Set<string>();

      response.data.forEach((item: unknown) => {
        if (isPriceFilteredProperty(item)) {
          uniqueEids.add(item.eid.toString());
        } else {
          console.error(
            "Item doesn't match PriceFilteredProperty structure:",
            item,
          );
        }
      });

      const allUniqueEids = Array.from(uniqueEids);
      console.log("All unique property IDs:", allUniqueEids);
      return allUniqueEids;
    } else return [];
  } catch (error) {
    console.error("Error fetching available properties:", error);
    return [];
  }
};

export const cbIslandVacationsScraper: DirectSiteScraper = async (options) => {
  const startDate = options.checkIn.toISOString().split("T")[0];
  const endDate = options.checkOut.toISOString().split("T")[0];

  if (startDate && endDate) {
    console.log(
      `Fetching properties available from ${startDate} to ${endDate}`,
    );
    const propertyEids = await fetchAvailablePropertyEids(startDate, endDate);
    console.log(`Found ${propertyEids.length} available properties`);

    const availableProperties: (NewProperty & {
      originalListingUrl: string;
      reservedDateRanges: { start: Date; end: Date }[];
      reviews: Review[];
    })[] = [];

    for (const eid of propertyEids.slice(0, 5)) {
      console.log(`Fetching details for property: ${eid}`);
      const propertyDetails = await fetchPropertyDetails(undefined, eid);

      if (propertyDetails) {
        const processedAmenities = cleanAmenities(
          propertyDetails.sm_nid$rc_core_term_general_amenities$name,
        );
        const { reviews, images, description, address } =
          await scrapePropertyPage(propertyDetails.ss_nid$url);
        const newProperty: NewProperty & {
          originalListingUrl: string;
          reservedDateRanges: { start: Date; end: Date }[];
          reviews: Review[];
        } = {
          name: propertyDetails.ss_name,
          address: address,
          about: description,
          propertyType: propertyDetails.propertyType,
          maxNumGuests: propertyDetails.is_rc_core_lodging_product$occ_total,
          numBeds: propertyDetails.fs_rc_core_lodging_product$beds,
          numBedrooms: propertyDetails.fs_rc_core_lodging_product$beds,
          latitude: propertyDetails.fs_nid$field_location$latitude,
          longitude: propertyDetails.fs_nid$field_location$longitude,
          city: propertyDetails.sm_nid$rc_core_term_city_type$name,
          avgRating: propertyDetails.fs_rc_core_item_reviews_rating ?? 0,
          numRatings: propertyDetails.is_rc_core_item_reviews_count ?? 0,
          imageUrls: [...images, propertyDetails.ss_vrweb_default_image],
          amenities: processedAmenities,
          otherAmenities: [],
          roomType: "Entire place",
          originalListingUrl: propertyDetails.ss_nid$url,
          reservedDateRanges: [],
          reviews: reviews,
          hostId: "af227f1b-74fd-4a50-ad34-3aa50187595c",
          originalListingPlatform: "CB Island Vacations",
          originalListingId: propertyDetails.id,
          checkInTime: "4:00 PM",
          checkOutTime: "10:00 AM",
          checkInInfo:
            "You will be emailed detailed arrival instructions a few days prior to your check-in date. You will be going directly to the residence and the arrival instructions will include directions to the property as well as the door code to access the residence.",
        };
        availableProperties.push(newProperty);
      }
      console.log(
        `Fetched details for property ${eid}. Total unique: ${availableProperties.length}`,
      );
    }
    console.log(
      `Total available properties fetched: ${availableProperties.length}`,
    );
    console.log(availableProperties);
    return availableProperties;
  } else {
    console.error("Check-in or check-out date is missing");
    return [];
  }

  // This code is relevant to fetching all properties from the site
  // If no date range is specified, fetch all properties
  //   const propertyIds = await fetchAllPropertyIds();
  //   console.log(`Total unique property IDs fetched: ${propertyIds.length}`);

  //   const allProperties: (NewProperty & {
  //     originalListingUrl: string;
  //     reservedDateRanges: { start: Date; end: Date }[];
  //     reviews: Review[];
  //   })[] = [];

  //   // for testing: limit the number of properties to 5
  //   const limitedPropertyIds = propertyIds.slice(0, 5);

  //   for (const id of limitedPropertyIds) {
  //     console.log(`Fetching details for property: ${id}`);

  //     const propertyDetails = await fetchPropertyDetails(id);

  //     if (propertyDetails) {
  //       const processedAmenities = cleanAmenities(
  //         propertyDetails.sm_nid$rc_core_term_general_amenities$name,
  //       );
  //       const { reviews, images, description, address } =
  //         await scrapePropertyPage(propertyDetails.ss_nid$url);
  //       const newProperty: NewProperty & {
  //         originalListingUrl: string;
  //         reservedDateRanges: { start: Date; end: Date }[];
  //         reviews: Review[];
  //       } = {
  //         name: propertyDetails.ss_name,
  //         address: address,
  //         about: description,
  //         propertyType: propertyDetails.propertyType,
  //         maxNumGuests: propertyDetails.is_rc_core_lodging_product$occ_total,
  //         numBeds: propertyDetails.fs_rc_core_lodging_product$beds,
  //         numBedrooms: propertyDetails.fs_rc_core_lodging_product$beds,
  //         latitude: propertyDetails.fs_nid$field_location$latitude,
  //         longitude: propertyDetails.fs_nid$field_location$longitude,
  //         city: propertyDetails.sm_nid$rc_core_term_city_type$name,
  //         avgRating: propertyDetails.fs_rc_core_item_reviews_rating ?? 0,
  //         numRatings: propertyDetails.is_rc_core_item_reviews_count ?? 0,
  //         imageUrls: [...images, propertyDetails.ss_vrweb_default_image],
  //         amenities: processedAmenities,
  //         otherAmenities: [],
  //         roomType: "Entire place",
  //         originalListingUrl: propertyDetails.ss_nid$url,
  //         reservedDateRanges: [],
  //         reviews: reviews,
  //         hostId: "af227f1b-74fd-4a50-ad34-3aa50187595c",
  //         originalListingPlatform: "CB Island Vacations",
  //         originalListingId: id,
  //         checkInTime: "4:00 PM",
  //         checkOutTime: "10:00 AM",
  //         checkInInfo:
  //           "You will be emailed detailed arrival instructions a few days prior to your check-in date. You will be going directly to the residence and the arrival instructions will include directions to the property as well as the door code to access the residence.",
  //       };
  //       allProperties.push(newProperty);
  //     }

  //     console.log(
  //       `Fetched details for property ${id}. Total unique: ${allProperties.length}`,
  //     );
  //   }

  //   console.log(`Total unique properties fetched: ${allProperties.length}`);
  //   return allProperties;
};
