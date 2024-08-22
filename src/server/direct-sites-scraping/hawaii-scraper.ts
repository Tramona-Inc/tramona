import { DirectSiteScraper } from "@/server/direct-sites-scraping";
import { NewProperty, Review } from "@/server/db/schema";
import axios from "axios";
import { z } from "zod";
import querystring from "querystring";
import { PropertyType } from "@/server/db/schema";
import * as cheerio from "cheerio";

const hawaiiPropertyTypes: { [key: string]: PropertyType } = {
  // mappping scraped property types to our property types; I've only seen Condo, House, Villa, and Townhouse, but adjust these if we encounter more types
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

const fetchAllPropertyIds = async (): Promise<string[]> => {
  const solrUrl = "https://www.cbislandvacations.com/solr/";
  const rowsPerPage = 100;
  let start = 0;
  const uniqueIds = new Set<string>();
  let totalFound = 0;
  let consecutiveDuplicates = 0;
  const maxConsecutiveDuplicates = 5;

  while (true) {
    console.log(`Fetching property IDs: start=${start}, rows=${rowsPerPage}`);

    try {
      const formData = querystring.stringify({
        fq: "index_id:rci",
        wt: "json",
        q: "*:*",
        fl: "id",
        start: start.toString(),
        rows: rowsPerPage.toString(),
      });

      const response = await axios({
        method: "POST",
        url: solrUrl,
        data: formData,
      });

      const validatedData = ResponseSchema.parse(response.data);

      const initialSize = uniqueIds.size;
      validatedData.response.docs.forEach((doc: any) => uniqueIds.add(doc.id));
      // total num properties found
      totalFound = validatedData.response.numFound;

      const newUniqueCount = uniqueIds.size - initialSize;
      console.log(
        `Fetched ${validatedData.response.docs.length} IDs, ${newUniqueCount} new unique. Total unique: ${uniqueIds.size}/${totalFound}`,
      );

      // if encountering 5 duplicate properties in a row, stop fetching
      if (newUniqueCount === 0) {
        consecutiveDuplicates++;
        if (consecutiveDuplicates >= maxConsecutiveDuplicates) {
          console.log(
            `No new unique IDs found in ${maxConsecutiveDuplicates} consecutive requests. Stopping.`,
          );
          break;
        }
      } else {
        consecutiveDuplicates = 0;
      }
      // once all properties have been found, stop fetching
      if (uniqueIds.size >= totalFound) {
        break;
      }

      start += rowsPerPage;
    } catch (error) {
      console.error("Error fetching property IDs:", error);
      break;
    }
  }

  const allUniqueIds = Array.from(uniqueIds);
  console.log("All unique property IDs:", allUniqueIds);
  return allUniqueIds;
};

const fetchPropertyDetails = async (
  id: string,
): Promise<z.infer<typeof PropertySchema> | null> => {
  const solrUrl = "https://www.cbislandvacations.com/solr/";

  try {
    const formData = querystring.stringify({
      fq: "index_id:rci",
      wt: "json",
      q: `id:${id}`,
      fl: "*",
    });

    const response = await axios({
      method: "POST",
      url: solrUrl,
      data: formData,
    });

    const validatedData = ResponseSchema.parse(response.data);
    let mappedPropertyType;
    let scrapedCityType;
    if (validatedData.response.docs.length > 0) {
      const propertyData = validatedData.response.docs[0] as any;
      if (
        Array.isArray(propertyData.sm_nid$rc_core_term_type$name) &&
        propertyData.sm_nid$rc_core_term_type$name.length > 0
      ) {
        const scrapedPropertyType =
          propertyData.sm_nid$rc_core_term_type$name[0];
        mappedPropertyType = mapPropertyType(scrapedPropertyType);
      } else {
        mappedPropertyType = "Other";
      }
      if (
        Array.isArray(propertyData.sm_nid$rc_core_term_city_type$name) &&
        propertyData.sm_nid$rc_core_term_city_type$name.length > 0
      ) {
        scrapedCityType = propertyData.sm_nid$rc_core_term_city_type$name[0];
      } else {
        scrapedCityType = "Other";
      }

      return PropertySchema.parse({
        ...propertyData,
        propertyType: mappedPropertyType,
        sm_nid$rc_core_term_city_type$name: scrapedCityType,
      });
    } else {
      console.log(`No data found for property ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching details for property ${id}:`, error);
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
      if (match && match[1]) {
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
    const $ = cheerio.load(response.data);

    const reviews: Review[] = [];
    $(".rc-core-item-review").each((_, element) => {
      const fullText = $(element).find("b").text().trim();

      const name: string =
        fullText.match(/Reviewed on .*? by\s*(.*?)(?=,|\s*$)/)?.[1]?.trim() ||
        "Anonymous";

      const ratingStars = $(element).find(
        ".rc-core-review-scores > div:first-child .rc-item-rating-stars .on",
      ).length;

      const reviewHtml =
        $(element).find(".rc-core-review-comment p").html() || "";
      const reviewText = processReviewText(reviewHtml);

      reviews.push({
        name,
        profilePic: "", // they don't have profile pics
        rating: ratingStars,
        review: reviewText || "No review text available",
      });
    });

    const images: string[] = [];

    // this is where the images are stored
    $("img.rsTmb").each((_, element) => {
      const src = $(element).attr("src");
      if (src) {
        images.push(src);
      }
    });

    const description =
      $(".field.field-name-body").text().trim() || "No description available";

    const directionsLinkHtml =
      $("a.vrweb-driving-directions").parent().html() || "";
    const address = extractAddressFromDirectionsLink(directionsLinkHtml);

    return { reviews, images: images, description, address };
  } catch (error) {
    console.error(`Error scraping property page ${url}:`, error);
    return { reviews: [], images: [], description: "", address: "" };
  }
}

// New function to process review text
function processReviewText(text: string): string {
  // Decode Unicode-encoded HTML entities
  text = text.replace(/\\u003C/g, "<").replace(/\\u003E/g, ">");

  const $ = cheerio.load(text);
  // Replace <br> and <br/> tags with newline characters
  $("br").replaceWith("\n");

  // Get the text content, which now includes our manual line breaks
  let processedText = $.root().text();

  // Trim leading and trailing whitespace, but keep intentional line breaks
  processedText = processedText.trim().replace(/\n{3,}/g, "\n\n");

  return processedText;
}

const fetchAvailableProperties = async (
  startDate: string,
  endDate: string,
  adults: number = 1,
  children: number = 0,
): Promise<any[]> => {
  const apiUrl = "https://www.cbislandvacations.com/rcapi/item/avail/search";

  const params = new URLSearchParams({
    "rcav[begin]": startDate,
    "rcav[end]": endDate,
    "rcav[adult]": adults.toString(),
    "rcav[child]": children.toString(),
    "rcav[flex]": "",
    "rcav[flex_type]": "d",
  });

  const url = `${apiUrl}?${params.toString()}`;
  console.log("Sending request to URL:", url);

  try {
    const response = await axios.get(url);
    console.log("Response status:", response.status);

    if (Array.isArray(response.data)) {
      console.log(`Found ${response.data.length} available properties`);
      return [,'lololol', response.data];
    } else {
      console.log("Unexpected response structure:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching available properties:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    return [];
  }
};

export const cbIslandVacationsScraper: DirectSiteScraper = async () => {
  const startDate = "08/30/2024";
  const endDate = "09/02/2024";

  console.log(`Fetching properties available from ${startDate} to ${endDate}`);
  const availableProperties = await fetchAvailableProperties(
    startDate,
    endDate,
  );
  console.log(`Found ${availableProperties.length} available properties`);

  const baseUrl = "https://www.cbislandvacations.com/hawaii-vacation-rentals";

  const propertyIds = await fetchAllPropertyIds();
  console.log(`Total unique property IDs fetched: ${propertyIds.length}`);

  const allProperties: (NewProperty & {
    originalListingUrl: string;
    reservedDateRanges: { start: Date; end: Date }[];
    reviews: Review[];
  })[] = [];

  // Limit the number of properties to 5
  const limitedPropertyIds = propertyIds.slice(0, 5);

  for (const id of limitedPropertyIds) {
    // for (const id of propertyIds) {
    console.log(`Fetching details for property: ${id}`);

    const propertyDetails = await fetchPropertyDetails(id);
    // console.log('prop detailz', propertyDetails)

    if (propertyDetails) {
      const processedAmenities = cleanAmenities(
        propertyDetails.sm_nid$rc_core_term_general_amenities$name,
      );
      // Scrape additional details from the original listing URL
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
        avgRating: propertyDetails.fs_rc_core_item_reviews_rating,
        numRatings: propertyDetails.is_rc_core_item_reviews_count,
        imageUrls: [...images, propertyDetails.ss_vrweb_default_image],
        amenities: processedAmenities,
        otherAmenities: [],
        roomType: "Entire place",
        originalListingUrl: propertyDetails.ss_nid$url,
        reservedDateRanges: [],
        reviews: reviews,
        //testing Adam as host, change later
        hostId: "af227f1b-74fd-4a50-ad34-3aa50187595c",
        originalListingPlatform: "CB Island Vacations",
        originalListingId: id,
        checkInTime: "4:00 PM",
        checkOutTime: "10:00 AM",
        checkInInfo:
          "You will be emailed detailed arrival instructions a few days prior to your check-in date. You will be going directly to the residence and the arrival instructions will include directions to the property as well as the door code to access the residence.",
      };
      allProperties.push(newProperty);
    }

    console.log(
      `Fetched details for property ${id}. Total unique: ${allProperties.length}`,
    );
  }

  const uniqueProperties = Array.from(allProperties.values());
  console.log(`Total unique properties fetched: ${uniqueProperties.length}`);
  return uniqueProperties;
};
