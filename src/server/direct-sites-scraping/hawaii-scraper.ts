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
import { getCoordinates } from "../google-maps";

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
  sm_nid$rc_core_term_bed_and_bathroom$name: z.array(z.string()).optional(),
  sm_nid$rc_core_term_community$name: z.array(z.string()).optional(),
  sm_nid$rc_core_term_entertainment$name: z.array(z.string()).optional(),
  sm_nid$rc_core_term_general$name: z.array(z.string()).optional(),
  sm_nid$rc_core_term_kitchen$name: z.array(z.string()).optional(),
  sm_nid$rc_core_term_outdoors$name: z.array(z.string()).optional(),
  sm_nid$rc_core_term_views$name: z.array(z.string()).optional(),
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

const HAWAII_BOUNDS = {
  north: 22.2337,
  south: 18.8605,
  west: -160.2471,
  east: -154.7931,
};

function isWithinHawaii(lat: number, lng: number): boolean {
  return (
    lat >= HAWAII_BOUNDS.south &&
    lat <= HAWAII_BOUNDS.north &&
    lng >= HAWAII_BOUNDS.west &&
    lng <= HAWAII_BOUNDS.east
  );
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
  const consolidatedAmenities = new Set<string>();
  const seenCategories = new Set<string>();

  const consolidationRules: [RegExp, string][] = [
    [/bbq|grill/i, "BBQ/Grill"],
    [/deck|lanai|gazebo|balcony|patio/i, "Outdoor Space"],
    [/dryer|washing machine/i, "Washer/Dryer"],
    [/pool/i, "Pool"],
    [/parking/i, "Parking"],
  ];

  amenities.forEach((amenity) => {
    if (!excludedAmenities.has(amenity.toLowerCase())) {
      let consolidatedAmenity = amenity;

      for (const [regex, replacement] of consolidationRules) {
        if (regex.test(amenity)) {
          if (!seenCategories.has(replacement)) {
            consolidatedAmenity = replacement;
            seenCategories.add(replacement);
            break;
          } else {
            return;
          }
        }
      }

      const words = consolidatedAmenity.split(" ");
      const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      );
      consolidatedAmenities.add(capitalizedWords.join(" "));
    }
  });

  return Array.from(consolidatedAmenities);
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

function extractTotalFromContent(content: string): number {
  const $ = cheerio.load(content);
  const totalElement = $("tr.total td.amount b");

  if (totalElement.length > 0) {
    const totalText = totalElement.text().trim();
    const totalPrice = parseFloat(totalText.replace(/[$,]/g, ""));

    if (!isNaN(totalPrice)) {
      return totalPrice * 100; // Convert to cents
    } else {
      console.error(`Failed to parse price from text: ${totalText}`);
    }
  } else {
    console.error("Total price element not found in the content");
  }

  console.error("Failed to extract total price");
  return -1;
}

async function scrapeFinalPrice(
  eid: string,
  checkIn: Date,
  checkOut: Date,
  numGuests?: number,
  scrapeUrl?: string,
): Promise<number> {
  let numGuestsToUse = numGuests ?? 1;
  if (scrapeUrl) {
    const url = new URL(scrapeUrl);
    const searchParams = url.searchParams;
    numGuestsToUse = parseInt(searchParams.get("rcav[adult]") ?? "1");
  }

  const startDate = checkIn.toISOString().split("T")[0];
  const endDate = checkOut.toISOString().split("T")[0];

  const url = `https://www.cbislandvacations.com/rescms/ajax/item/pricing/quote`;

  const params = new URLSearchParams({
    "rcav[begin]": startDate ?? "",
    "rcav[end]": endDate ?? "",
    "rcav[adult]": numGuestsToUse.toString(),
    "rcav[child]": "0",
    "rcav[eid]": eid,
    eid: eid,
    buy_text: "Book Now",
  });

  try {
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua":
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "x-requested-with": "XMLHttpRequest",
        Referer:
          "https://www.cbislandvacations.com/hawaii-vacation-rentals/palms-wailea-206",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response.data && response.data.status === 1 && response.data.content) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      return extractTotalFromContent(response.data.content);
    } else {
      console.error("Unexpected API response format:", response.data);
      return -1;
    }
  } catch (error) {
    console.error(`Error fetching price for property ${eid}:`, error);
    return -1;
  }
}

const fetchAvailablePropertyEids = async (
  startDate: Date,
  endDate: Date,
  numGuests?: number,
  scrapeUrl?: string,
): Promise<string[]> => {
  let numGuestsToUse = numGuests ?? 1;

  if (scrapeUrl) {
    const url = new URL(scrapeUrl);
    const searchParams = url.searchParams;
    numGuestsToUse = parseInt(searchParams.get("rcav[adult]") ?? "1");
  }

  const filteredPropertiesUrl =
    "https://www.cbislandvacations.com/rcapi/item/avail/search";

  const params = new URLSearchParams({
    "rcav[begin]": startDate.toISOString().split("T")[0] ?? "",
    "rcav[end]": endDate.toISOString().split("T")[0] ?? "",
    "rcav[adult]": numGuestsToUse.toString(),
    "rcav[child]": "0",
    "rcav[flex]": "",
    "rcav[flex_type]": "d",
  });

  const url = `${filteredPropertiesUrl}?${params.toString()}`;

  try {
    const response = await axios.get(url);

    if (Array.isArray(response.data)) {
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
  const allAmenities = new Set([
    ...(prop.sm_nid$rc_core_term_general_amenities$name ?? []),
    ...(prop.sm_nid$rc_core_term_bed_and_bathroom$name ?? []),
    ...(prop.sm_nid$rc_core_term_community$name ?? []),
    ...(prop.sm_nid$rc_core_term_entertainment$name ?? []),
    ...(prop.sm_nid$rc_core_term_general$name ?? []),
    ...(prop.sm_nid$rc_core_term_kitchen$name ?? []),
    ...(prop.sm_nid$rc_core_term_outdoors$name ?? []),
    ...(prop.sm_nid$rc_core_term_views$name ?? []),
  ]);

  return {
    originalListingId: prop.is_eid.toString(),
    name: prop.ss_name,
    about: description,
    petsAllowed: false,
    smokingAllowed: false,
    otherHouseRules: `Rental Rules:
    1. No smoking of any kind, including vaping or marijuana. All of our rentals are nonsmoking. By signing this contract, you are stating that you will not smoke in our
    vacation rentals and or homes. You will be charged $450 if evidence of smoke is found
    once you check out.
    2. Please leave this unit and or home as you found. If there is any damage or any items
    are missing, or if excessive cleaning is needed after your stay, you will be charged.
    3. You and your guest are using our home at your own risk. We nor the owner of the
    property will be held responsible for any injuries that occur at the vacation rental and or
    home or for any lost or stolen items.
    4. No boats or trailers are to be parked at our rental properties. Any fines from the
    home owner association, as a result of this broken rule, will be your responsibility.
    5. Number of occupants does not exceed the rental contract.
    6. Do not move the furniture.
    7. Do not do your laundry with ours; please always wash and dry your belongings
    separate from our linens.
    8. QUIET HRS FROM 10 PM UNTIL 8 AM. PLEASE BE CONSIDERATE OF YOUR
    NEIGHBORS. FOR HAWAII ISLAND, QUIET HRS FROM 9PM to 8AM.
    9. KITCHEN: Keeping the kitchen clean and food/crumbs cleaned from the counters are
    important. Please store food in the fridge or airtight container and REMOVE TRASH
    daily.
    10. Please do not interchange items belonging in other units.
    11. Do not sit on furniture in wet swimsuits or with suntan oil or lotion on. We ask you
    please do not spray sunscreen inside the unit or lanai.
    12. Wash all sand off before entering the building and or home using the hose outside.
    13. Beach Towels: There are beach towels in the unit and or in the home for your use
    at the beach; Please do not use the bath towels outside the unit. Please REMEMBER to
    bring the beach towels back to your unit. You will be charged a replacement fee for any
    beach towels not returned.
    14. Please refrain from hanging towels or any other items from the balcony railings on
    your lanai.
    15. Let us know immediately about any problems.
    16. No pets are allowed in the unit or on property. A $600 pet fee, plus any additional
    costs for damage will be imposed if evidence of pets are discovered.
    17. Guest assumes all responsibility for operation and control of any vehicles or golf
    carts included with the vacation rental property (if applicable) and will be liable for any
    damage to said property or damage caused by use of vehicle or golf cart.
    For Hawaii Island:
    Good Neighbor Policy:
    Quiet hours shall be from 9:00 p.m. to 8:00 a.m., during which time the noise from the
    STVR shall not unreasonably disturb adjacent neighbors. Sound that is audible beyond
    the property boundaries during non-quiet hours shall not be more excessive than would
    be otherwise associated with a residential area.
    Guest vehicles shall be parked in the designated parking area.
    The STVR shall not be used for commercial purposes.
    Housekeeping & Maintenance:
    There is no daily housekeeping service. If you desire additional housekeeping services
    during your stay, they are available for a fee. Please call ahead to pre-schedule desired
    day(s). You will find basic starter supplies. Additional supplies are the guest's
    responsibility unless other arrangements are made.
    Thank you for choosing to stay with us!`,
    propertyType: mapPropertyType(prop.sm_nid$rc_core_term_type$name[0] ?? ""),
    address: address,
    city: prop.sm_nid$rc_core_term_city_type$name[0] ?? "",
    latLngPoint: {
      lat: prop.fs_nid$field_location$latitude,
      lng: prop.fs_nid$field_location$longitude,
    },
    checkInInfo: `Check-In / Arrival Instructions:
    Check-In time will be stated in your arrival instructions. Please adhere to check in times
    to allow our crews time to clean. DO NOT check in early (unless special arrangements
    have been made or secured) and unload belongings into a yet-to-be-cleaned property
    as our crews cannot clean a rental with personal property in it.
    Detailed Arrival/Departure instructions will be sent via email 3 days prior to arrival with
    the check in and check out times. If you have not received this automatic email at least
    3 days prior to arrival, please call or email us and we will resend these instructions.
    Check-Out / Departure Instructions:
    Checkout time will be stated in your arrival instructions email unless late checkout has
    been booked. 
    1) Remove all garbage to outside dumpster or trash can.
    2) Load and run dishwasher.
    3) Keep beds turned down that have been slept in.
    4) Turn off lights, TVs, A/C and all fans.
    5) Close and lock all outside doors and windows.
    6) Please leave all keys back to the original place and one key back into the lock box.
    (Does not apply to unit with Keyless Entry.)
    7) Adhere to check-out time, unless late checkout has been secured. If the cleaning
    crew has to sit outside to wait for guests to leave the property, there will be an
    additional charge.
    LATE CHECKOUT
    Late checkout must be secured at the time of booking. Late checkout will be charged
    50% of the nightly rate plus taxes.`,
    maxNumGuests: prop.is_rc_core_lodging_product$occ_total,
    numBeds: prop.fs_rc_core_lodging_product$beds,
    numBedrooms: prop.fs_rc_core_lodging_product$beds,
    numBathrooms: prop.fs_rc_core_lodging_product$baths,
    amenities: cleanAmenities(Array.from(allAmenities)),
    otherAmenities: [],
    imageUrls: images,
    originalListingUrl: prop.ss_nid$url,
    avgRating: prop.fs_rc_core_item_reviews_rating ?? 0,
    numRatings: prop.is_rc_core_item_reviews_count ?? 0,
    originalListingPlatform: "CB Island Vacations" as ListingSiteName,
    originalNightlyPrice: originalNightlyPrice,
    cancellationPolicy: "CB Island Vacations",
    reviews: reviews,
    scrapeUrl: scrapeUrl,
  };
};

export const cbIslandVacationsScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  requestNightlyPrice,
  requestId,
  location,
  numGuests,
}) => {
  if (location) {
    const coordinates = await getCoordinates(location);
    if (coordinates.location) {
      const { lat, lng } = coordinates.location;
      if (!isWithinHawaii(lat, lng)) {
        console.log("Location is outside of Hawaii. Returning no properties.");
        return [];
      }
    } else {
      console.log("Could not get coordinates for the provided location.");
      return [];
    }
  }

  const propertyEids = await fetchAvailablePropertyEids(
    checkIn,
    checkOut,
    numGuests,
  );

  const availableProperties: ScrapedListing[] = [];

  for (const eid of propertyEids) {
    const solrUrl = "https://www.cbislandvacations.com/solr/";
    const formData = querystring.stringify({
      fq: "index_id:rci",
      wt: "json",
      q: `is_eid:${eid}`,
      fl: "*",
    });

    const filteredPropertiesUrl =
      "https://www.cbislandvacations.com/rcapi/item/avail/search";

    const params = new URLSearchParams({
      "rcav[begin]": checkIn.toISOString().split("T")[0] ?? "",
      "rcav[end]": checkOut.toISOString().split("T")[0] ?? "",
      "rcav[adult]": numGuests?.toString() ?? "1",
      "rcav[child]": "0",
      "rcav[flex]": "",
      "rcav[flex_type]": "d",
    });

    const scrapeUrl = `${filteredPropertiesUrl}?${params.toString()}`;

    try {
      const response = await axios<{ response: { docs: PropertyDocument[] } }>({
        method: "POST",
        url: solrUrl,
        data: formData,
      });

      const propertyData = response.data.response.docs.find(
        (doc: PropertyDocument) => {
          if (!doc.is_eid) return false;

          const docEid = String(doc.is_eid).trim();
          const searchEid = String(eid).trim();

          if (docEid.toLowerCase() === searchEid.toLowerCase()) return true;

          if (docEid.toLowerCase().includes(searchEid.toLowerCase()))
            return true;

          if (Array.isArray(doc.is_eid)) {
            return doc.is_eid.some(
              (id: number) =>
                String(id).trim().toLowerCase() === searchEid.toLowerCase() ||
                String(id)
                  .trim()
                  .toLowerCase()
                  .includes(searchEid.toLowerCase()),
            );
          }

          return false;
        },
      );

      if (!propertyData) {
        console.error(`No property found with eid: ${eid}`);
        console.log(
          "Available eids:",
          response.data.response.docs.map(
            (doc: PropertyDocument) => doc.is_eid,
          ),
        );
        continue;
      }

      const validatedData = PropertySchema.parse(propertyData);

      const { reviews, address, description, images } =
        await scrapePropertyPage(validatedData.ss_nid$url);

      const totalPrice = await scrapeFinalPrice(eid, checkIn, checkOut);

      if (totalPrice < 0) {
        console.error(`Failed to fetch price for property ${eid}`);
        continue;
      }

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
    } catch (error) {
      console.error(`Error fetching property ${eid}:`, error);
    }
  }

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
      0,
      scrapeUrl,
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
      0,
      scrapeUrl,
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
