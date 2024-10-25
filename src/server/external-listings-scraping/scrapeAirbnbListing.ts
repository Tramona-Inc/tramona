import { z } from "zod";
import {
  formatDateYearMonthDay,
  parseCurrency,
  parseHTML,
} from "@/utils/utils";
import {
  ALL_PROPERTY_ROOM_TYPES,
  ALL_PROPERTY_TYPES,
  CancellationPolicy,
  NewProperty,
  NewReview,
} from "@/server/db/schema";
import { airbnbHeaders } from "@/utils/constants";
import { getCity } from "../google-maps";
import { axiosWithRetry, proxyAgent } from "../server-utils";

export function encodeAirbnbId(id: string) {
  return Buffer.from(`StayListing:${id}`).toString("base64");
}

export function getListingDataUrl(
  id: string,
  {
    checkIn,
    checkOut,
    numGuests,
  }: { checkIn?: Date; checkOut?: Date; numGuests?: number },
) {
  const encodedId = encodeAirbnbId(id);

  return `https://www.airbnb.com/api/v3/StaysPdpSections/160265f6bdbacc2084cdf7de8641926c5ee141c3a2967dca0407ee47cec2a7d1?operationName=StaysPdpSections&locale=en&currency=USD&variables={"id":"${encodedId}","pdpSectionsRequest":{${checkIn ? `"checkIn":"${formatDateYearMonthDay(checkIn)}"` : ""}${checkOut ? `"checkOut":"${formatDateYearMonthDay(checkOut)}"` : ""},"adults":"${numGuests ? numGuests : ""}","layouts":["SIDEBAR","SINGLE_COLUMN"]}}&extensions={"persistedQuery":{"version":1,"sha256Hash":"160265f6bdbacc2084cdf7de8641926c5ee141c3a2967dca0407ee47cec2a7d1"}}`;
}

export function getReviewsUrl(id: string) {
  const encodedId = encodeAirbnbId(id);
  return `https://www.airbnb.com/api/v3/StaysPdpReviewsQuery/dec1c8061483e78373602047450322fd474e79ba9afa8d3dbbc27f504030f91d?operationName=StaysPdpReviewsQuery&locale=en&currency=USD&variables={"id":"${encodedId}","pdpReviewsRequest":{"fieldSelector":"for_p3_translation_only","forPreview":false,"limit":10,"offset":"0","showingTranslationButton":false,"first":10,"sortingPreference":"RATING_DESC"}}&extensions={"persistedQuery":{"version":1,"sha256Hash":"dec1c8061483e78373602047450322fd474e79ba9afa8d3dbbc27f504030f91d"}}`;
}

export function getAmenities(listingData: string, id: string) {
  const amenitiesStr = /"seeAllAmenitiesGroups":(.+?\}\]\}\])/.exec(
    listingData,
  )?.[1];
  if (!amenitiesStr)
    throw new Error(`Airbnb id ${id}: Failed to find amenities`);

  const amenities = z
    .array(z.object({ amenities: z.array(z.object({ title: z.string() })) }))
    .parse(JSON.parse(amenitiesStr))
    .map(({ amenities }) => amenities.map(({ title }) => title))
    .flat();

  return amenities;
}

export function getCancellationPolicy(listingData: string, id: string) {
  const cancellationPolicyStr =
    /"localized_cancellation_policy_name":"(.+?)"/.exec(listingData)?.[1];
  if (!cancellationPolicyStr)
    throw new Error(`Airbnb id ${id}: Failed to find cancellation policy`);

  const cancellationPolicy: CancellationPolicy = z
    .enum([
      "Flexible",
      "Moderate",
      "Firm",
      "Strict",
      "Super Strict 30 Days",
      "Super Strict 60 Days",
      "Long Term",
      "Non-refundable",
    ])
    .catch("Non-refundable")
    .parse(cancellationPolicyStr);

  return cancellationPolicy;
}

export async function scrapeAirbnbListing(
  id: string,
  {
    checkIn,
    checkOut,
    numGuests,
  }: { checkIn: Date; checkOut: Date; numGuests: number },
) {

  const listingDataUrl = getListingDataUrl(id, {
    checkIn,
    checkOut,
    numGuests,
  });

  const reviewsUrl = getReviewsUrl(id);

  const [listingData, reviewsData] = (await Promise.all(
    [
      listingDataUrl,
      reviewsUrl, // 10 best reviews
    ].map((url) =>
      axiosWithRetry
        .get<string>(url, {
          headers: airbnbHeaders,
          httpsAgent: proxyAgent,
          responseType: "text",
        })
        .then((r) => r.data)
        .catch((e) => {
          console.error(`Error fetching ${url}:`, e);
          throw e;
        }),
    ),
  )) as [string, string];

  // await writeFile(`${id}.json`, listingData);

  const name = /"listingTitle":"([^"]+?)"/.exec(listingData)?.[1];
  if (!name) throw new Error(`Airbnb id ${id}: Failed to find name`);

  const aboutHTML =
    /"__typename":"PdpDescriptionSection",.*"htmlDescription":.*"htmlText":"((\\"|[^"])+?)"/.exec(
      listingData,
    )?.[1];
  if (!aboutHTML) throw new Error(`Airbnb id ${id}: Failed to find about`);

  const about = parseHTML(aboutHTML);
  if (!about)
    throw new Error(`Airbnb id ${id}: Failed to parse aboutHTML: ${aboutHTML}`);

  const amenities = getAmenities(listingData, id);

  // const amenitiesStr = /"seeAllAmenitiesGroups":(.+?\}\]\}\])/.exec(
  //   listingData,
  // )?.[1];
  // if (!amenitiesStr)
  //   throw new Error(`Airbnb id ${id}: Failed to find amenities`);

  // const amenities = z
  //   .array(z.object({ amenities: z.array(z.object({ title: z.string() })) }))
  //   .parse(JSON.parse(amenitiesStr))
  //   .map(({ amenities }) => amenities.map(({ title }) => title))
  //   .flat();

  const heroImagesStr = /"previewImages":(.+?\])/.exec(listingData)?.[1];
  if (!heroImagesStr)
    throw new Error(`Airbnb id ${id}: Failed to find hero images`);

  const imageUrls = z
    .array(z.object({ baseUrl: z.string() }))
    .parse(JSON.parse(heroImagesStr))
    .map(({ baseUrl }) => baseUrl);

  const ogTitle = /"ogTitle":"(.+?)"/.exec(listingData)?.[1];
  if (!ogTitle) throw new Error(`Airbnb id ${id}: Failed to find og title`);

  const [titleStr, starsStr, bedroomsStr, bedsStr, bathsStr] =
    ogTitle.split(" · ");

  const propertyType = z
    .enum(ALL_PROPERTY_TYPES)
    .catch("House")
    .parse(titleStr!.split(" in ")[0]!);

  const avgRating = parseFloat(starsStr!.slice(1));
  const numBedrooms =
    bedroomsStr === "Studio" ? 1 : parseInt(bedroomsStr!.split(" ")[0]!);
  const numBeds = parseInt(bedsStr!.split(" ")[0]!);
  const numBathrooms = parseInt(bathsStr!.split(" ")[0]!);

  if (isNaN(numBedrooms))
    throw new Error(
      `Airbnb id ${id}: Failed to parse numBedrooms: ${bedroomsStr}`,
    );
  if (isNaN(numBeds))
    throw new Error(`Airbnb id ${id}: Failed to parse numBeds: ${bedsStr}`);
  if (isNaN(numBathrooms))
    throw new Error(
      `Airbnb id ${id}: Failed to parse numBathrooms: ${bathsStr}`,
    );

  const numRatingsStr = /"reviewCount":"?(\d+)/.exec(listingData)?.[1];
  if (!numRatingsStr)
    throw new Error(`Airbnb id ${id}: Failed to find num ratings`);
  const numRatings = parseInt(numRatingsStr);

  // const hostName = /"title":"Hosted by (.+?)"/.exec(listingData)?.[1];
  // if (!hostName) throw new Error(`Airbnb id ${id}: Failed to find host name`);

  // const hostProfilePic = /"profilePictureUrl":"(.+?)"/.exec(listingData)?.[1];
  // if (!hostProfilePic)
  //   throw new Error(`Airbnb id ${id}: Failed to find host profile pic`);

  const hostNumReviewsStr = /"ratingCount":"?(\d+)/.exec(listingData)?.[1];
  if (!hostNumReviewsStr)
    throw new Error(`Airbnb id ${id}: Failed to find host num reviews`);
  const hostNumReviews = parseInt(hostNumReviewsStr);

  const hostRatingStr = /"ratingAverage":"?(\d+(\.\d+)?)/.exec(
    listingData,
  )?.[1];
  if (!hostRatingStr)
    throw new Error(`Airbnb id ${id}: Failed to find host rating`);
  const hostRating = parseFloat(hostRatingStr);

  const latitudeStr = /"listingLat":(-?\d+\.\d+)/.exec(listingData)?.[1];
  if (!latitudeStr) throw new Error(`Airbnb id ${id}: Failed to find latitude`);
  const latitude = parseFloat(latitudeStr);

  const longitudeStr = /"listingLng":(-?\d+\.\d+)/.exec(listingData)?.[1];
  if (!longitudeStr)
    throw new Error(`Airbnb id ${id}: Failed to find longitude`);
  const longitude = parseFloat(longitudeStr);

  const maxNumGuestsStr = /"personCapacity":(.+?)/.exec(listingData)?.[1];
  if (!maxNumGuestsStr)
    throw new Error(`Airbnb id ${id}: Failed to find max num guests`);
  const maxNumGuests = parseInt(maxNumGuestsStr);

  const roomTypeStr = /"roomType":"(.+?)"/.exec(listingData)?.[1];
  if (!roomTypeStr)
    throw new Error(`Airbnb id ${id}: Failed to find room type`);
  const roomType = z
    .enum(ALL_PROPERTY_ROOM_TYPES)
    .catch("Entire place")
    .parse(roomTypeStr);

  const arrangementDetailsStr = /"arrangementDetails":(.+?\]\}\])/.exec(
    listingData,
  )?.[1];

  const roomsWithBeds = (() => {
    if (!arrangementDetailsStr) return [];

    const arrangementDetails = z
      .object({
        title: z.string(),
        subtitle: z.string(),
      })
      .array()
      .parse(JSON.parse(arrangementDetailsStr));

    return arrangementDetails.map(({ title, subtitle }) => ({
      name: title,
      beds: subtitle.split(", ").map((s) => {
        const spaceIndex = s.indexOf(" ");
        const count = parseInt(s.slice(0, spaceIndex));
        const bedType = s.slice(spaceIndex + 1, count > 1 ? -1 : undefined); // remove the s if it's plural

        return { count, type: bedType };
      }),
    }));
  })();

  const smokingAllowed = listingData.includes('"title": "Smoking allowed"');
  const petsAllowed = listingData.includes('"title": "Pets allowed"');

  // "title": "Check-in after 3:00 PM"
  const checkInTime = /"title":"Check-in after (.+?)"/.exec(listingData)?.[1];

  // "title": "Checkout before 10:00 AM"
  const checkOutTime = /"title":"Checkout before (.+?)"/.exec(listingData)?.[1];

  // "title": "During your stay",
  const otherHouseRulesStr = /"title":"During your stay","items":(.+?\])/.exec(
    listingData,
  )?.[1];

  const allOtherHouseRules = otherHouseRulesStr
    ? z
      .array(z.object({ title: z.string() }))
      .parse(JSON.parse(otherHouseRulesStr))
      .map(({ title }) => title)
    : [];

  const otherHouseRules =
    allOtherHouseRules.length > 0
      ? allOtherHouseRules
        .filter(
          (rule) =>
            // exclude rules for pets, smoking, and maximum number of guests
            !["pets", "smoking", "guests"].some((keyword) =>
              rule.toLowerCase().includes(keyword),
            ),
        )
        .map((rule) => `- ${rule}`)
        .join("\n")
      : null;

  // "localized_cancellation_policy_name"
  const cancellationPolicy = getCancellationPolicy(listingData, id);

  // const cancellationPolicyStr =
  //   /"localized_cancellation_policy_name":"(.+?)"/.exec(listingData)?.[1];
  // if (!cancellationPolicyStr)
  //   throw new Error(`Airbnb id ${id}: Failed to find cancellation policy`);

  // const cancellationPolicy: CancellationPolicy = z
  //   .enum([
  //     "Flexible",
  //     "Moderate",
  //     "Firm",
  //     "Strict",
  //     "Super Strict 30 Days",
  //     "Super Strict 60 Days",
  //     "Long Term",
  //     "Non-refundable",
  //   ])
  //   .catch("Non-refundable")
  //   .parse(cancellationPolicyStr);

  const nightlyPriceStr = /"discountedPrice":"(.+?)"/.exec(listingData)?.[1];
  if (!nightlyPriceStr)
    throw new Error(`Airbnb id ${id}: Failed to find discounted price`);

  console.log("nightlyPriceStr", nightlyPriceStr);

  const nightlyPrice = parseCurrency(nightlyPriceStr);

  const originalNightlyPriceStr = /"originalPrice":"(.+?)"/.exec(
    listingData,
  )?.[1];
  if (!originalNightlyPriceStr)
    throw new Error(`Airbnb id ${id}: Failed to find original price`);

  console.log("originalNightlyPriceStr", originalNightlyPriceStr);

  const originalNightlyPrice = parseCurrency(originalNightlyPriceStr);

  const city = await getCity({ lat: latitude, lng: longitude }).then(
    (address) => address.city,
  );

  const property: NewProperty = {
    name,
    about,
    imageUrls,
    amenities,
    propertyType,
    roomType,
    roomsWithBeds,
    avgRating,
    numRatings,
    numBeds,
    numBedrooms,
    numBathrooms,
    maxNumGuests,
    hostNumReviews,
    hostRating,
    latLngPoint: { x: latitude, y: longitude },
    checkInTime,
    checkOutTime,
    petsAllowed,
    smokingAllowed,
    otherHouseRules,
    cancellationPolicy,
    originalNightlyPrice,
    city,
    address: city, // cant get exact address from airbnb before booking so we go with the city
  };

  // data.presentation.stayProductDetailPage.reviews.reviews
  const reviewsSchema = z.object({
    data: z.object({
      presentation: z.object({
        stayProductDetailPage: z.object({
          reviews: z.object({
            reviews: z.array(
              z.object({
                comments: z.string().transform(parseHTML),
                createdAt: z.string(),
                reviewer: z.object({
                  firstName: z.string(),
                  userProfilePicture: z.object({
                    baseUrl: z.string(),
                  }),
                }),
                rating: z.number().int().min(1).max(5),
              }),
            ),
          }),
        }),
      }),
    }),
  });

  const reviews: NewReview[] = reviewsSchema
    .parse(JSON.parse(reviewsData))
    .data.presentation.stayProductDetailPage.reviews.reviews.map((review) => ({
      name: review.reviewer.firstName,
      rating: review.rating,
      review: review.comments,
      profilePic: review.reviewer.userProfilePicture.baseUrl,
    }));

  return { property, reviews, nightlyPrice };
}
