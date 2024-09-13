import {
  DirectSiteScraper,
  SubsequentScraper,
  ScrapedListing,
} from "@/server/direct-sites-scraping";
import { Review } from "@/server/db/schema";
import axios from "axios";
import { z } from "zod";
import querystring from "querystring";
import { PropertyType } from "@/server/db/schema";
import * as cheerio from "cheerio";
import { ListingSiteName } from "@/server/db/schema/common";
import { getNumNights } from "@/utils/utils";

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
  sm_nid$rc_core_term_city_type$name: z.array(z.string()), // city
  sm_nid$rc_core_term_general_amenities$name: z.array(z.string()),
  sm_nid$rc_core_term_type$name: z.array(z.string()),
  is_eid: z.number(),
});

type PropertyDocument = {
  is_eid: number | number[];
  ss_name: string;
  fs_nid$field_location$latitude: number;
  fs_nid$field_location$longitude: number;
  ss_nid$url: string;
  is_rc_core_item_reviews_count?: number;
  fs_rc_core_item_reviews_rating?: number;
  fs_rc_core_lodging_product$baths: number;
  fs_rc_core_lodging_product$beds: number;
  is_rc_core_lodging_product$occ_total: number;
  ss_vrweb_default_image: string;
  sm_nid$rc_core_term_city_type$name: string[];
  sm_nid$rc_core_term_general_amenities$name: string[];
  sm_nid$rc_core_term_type$name: string[];
};

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

async function scrapeFinalPrice(
  eid: string,
  checkIn: Date,
  checkOut: Date,
): Promise<number> {
  const startDate = checkIn.toISOString().split("T")[0];
  const endDate = checkOut.toISOString().split("T")[0];
  const url = `https://www.cbislandvacations.com/rescms/item/${eid}/buy?rcav%5Bbegin%5D=${encodeURIComponent(startDate ?? "")}&rcav%5Bend%5D=${encodeURIComponent(endDate ?? "")}&rcav%5Badult%5D=1&rcav%5Bchild%5D=0&eid=${eid}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data as string);

    const totalPriceElement = $("tr.total td.amount b");
    if (totalPriceElement.length > 0) {
      const priceText = totalPriceElement.text().trim();
      const price = parseFloat(priceText.replace("$", "").replace(",", ""));
      return price * 100; // Convert to cents
    } else {
      console.error(`Failed to find total price element for property ${eid}`);
      return 0;
    }
  } catch (error) {
    console.error(`Error scraping final price for property ${eid}:`, error);
    return 0;
  }
}

const fetchAvailablePropertyEids = async (
  startDate: Date,
  endDate: Date,
  adults = 1,
  children = 0,
): Promise<string[]> => {
  const filteredPropertiesUrl =
    "https://www.cbislandvacations.com/rcapi/item/avail/search";

  const params = new URLSearchParams({
    "rcav[begin]": startDate.toISOString().split("T")[0] ?? "",
    "rcav[end]": endDate.toISOString().split("T")[0] ?? "",
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

type CBIslandVacationsPropertyInput = z.infer<typeof PropertySchema>;

const mapToScrapedListing = (
  prop: CBIslandVacationsPropertyInput,
  scrapeUrl: string,
  reviews: Review[],
  address: string,
  images: string[],
  description: string,
  originalNightlyPrice: number,
): ScrapedListing => {
  return {
    originalListingId: prop.is_eid.toString(),
    name: prop.ss_name,
    about: description,
    propertyType: mapPropertyType(prop.sm_nid$rc_core_term_type$name[0] ?? ""),
    address: address,
    city: prop.sm_nid$rc_core_term_city_type$name[0] ?? "",
    latLngPoint: {
      lat: prop.fs_nid$field_location$latitude,
      lng: prop.fs_nid$field_location$longitude,
    },
    // latitude: prop.fs_nid$field_location$latitude,
    // longitude: prop.fs_nid$field_location$longitude,
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
    originalListingPlatform: "CB Island Vacations" as ListingSiteName,
    originalNightlyPrice: originalNightlyPrice,
    reviews: reviews,
    scrapeUrl: scrapeUrl,
  };
};

export const cbIslandVacationsScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  numOfOffersInEachScraper = 5,
}) => {
  const propertyEids = await fetchAvailablePropertyEids(checkIn, checkOut);
  console.log(`Found ${propertyEids.length} available properties`);

  const availableProperties: ScrapedListing[] = [];

  for (const eid of propertyEids.slice(0, numOfOffersInEachScraper)) {
    console.log(`Fetching details for property: ${eid}`);
    const solrUrl = "https://www.cbislandvacations.com/solr/";
    const formData = querystring.stringify({
      fq: "index_id:rci",
      wt: "json",
      q: `is_eid:${eid}`,
      fl: "*",
    });

    const scrapeUrl = `${solrUrl}?${formData}`;
    console.log("Complete URL:", scrapeUrl);

    try {
      const response = await axios<{ response: { docs: PropertyDocument[] } }>({
        method: "POST",
        url: solrUrl,
        data: formData,
      });

      const propertyData = response.data.response.docs.find((doc: PropertyDocument) => {
        if (!doc.is_eid) return false;

        const docEid = String(doc.is_eid).trim();
        const searchEid = String(eid).trim();

        if (docEid.toLowerCase() === searchEid.toLowerCase()) return true;

        if (docEid.toLowerCase().includes(searchEid.toLowerCase())) return true;

        if (Array.isArray(doc.is_eid)) {
          return doc.is_eid.some(
            (id: number) =>
              String(id).trim().toLowerCase() === searchEid.toLowerCase() ||
              String(id).trim().toLowerCase().includes(searchEid.toLowerCase()),
          );
        }

        return false;
      });

      if (!propertyData) {
        console.error(`No property found with eid: ${eid}`);
        console.log(
          "Available eids:",
          response.data.response.docs.map((doc: PropertyDocument) => doc.is_eid),
        );
        continue;
      }

      const validatedData = PropertySchema.parse(propertyData);

      const { reviews, address, description, images } =
        await scrapePropertyPage(validatedData.ss_nid$url);

      const totalPrice = await scrapeFinalPrice(eid, checkIn, checkOut);
      const originalNightlyPrice = Math.round(
        totalPrice / getNumNights(checkIn, checkOut),
      );

      const scrapedListing = mapToScrapedListing(
        validatedData,
        scrapeUrl,
        reviews,
        address,
        images,
        description,
        originalNightlyPrice,
      );
      availableProperties.push(scrapedListing);

      console.log(
        `Fetched details for property ${eid}. Total unique: ${availableProperties.length}`,
      );
    } catch (error) {
      console.error(`Error fetching property ${eid}:`, error);
    }
  }

  console.log(
    `Total available properties fetched: ${availableProperties.length}`,
  );
  return availableProperties;
};

export const cbIslandVacationsSubScraper: SubsequentScraper = async ({
  originalListingId,
  scrapeUrl,
  checkIn,
  checkOut,
}) => {
  try {
    const availablePropertyIds = await fetchAvailablePropertyEids(
      checkIn,
      checkOut,
    );

    const isAvailable = availablePropertyIds.includes(originalListingId);

    let originalNightlyPrice = 0;
    if (!isAvailable) {
      return {
        isAvailableOnOriginalSite: false,
        availabilityCheckedAt: new Date(),
      };
    }

    const totalPrice = await scrapeFinalPrice(
      originalListingId,
      checkIn,
      checkOut,
    );
    originalNightlyPrice = Math.round(
      totalPrice / getNumNights(checkIn, checkOut),
    );

    return {
      originalNightlyPrice,
      isAvailableOnOriginalSite: isAvailable,
      availabilityCheckedAt: new Date(),
    };
  } catch (error) {
    console.error("Error in cbIslandVacationsSubScraper");
    return {
      isAvailableOnOriginalSite: false,
      availabilityCheckedAt: new Date(),
    };
  }
};
