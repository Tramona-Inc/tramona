// import { z } from "zod";
// import { containsHTML } from "@/utils/utils";
// import { aiJson } from "@/server/aiJson";
// import { propertyInsertSchema, reviewsInsertSchema } from "@/server/db/schema";
// import { getCity } from "@/server/google-maps";
// import { encodeAirbnbId } from "./scrapeAirbnbListing";

// const airbnbScraperSchema = z.object({
//   scrapedProperty: propertyInsertSchema
//     .pick({
//       name: true, //
//       about: true, //
//       imageUrls: true, //
//       amenities: true, //
//       propertyType: true, //
//       roomType: true, //
//       roomsWithBeds: true, //

//       avgRating: true, //
//       numRatings: true, //

//       numBeds: true, //
//       numBedrooms: true, //
//       numBathrooms: true, //
//       maxNumGuests: true, //

//       hostName: true, //
//       hostProfilePic: true, //
//       hostNumReviews: true, //
//       hostRating: true, //

//       latitude: true, //
//       longitude: true, //

//       checkInInfo: true,
//       checkInTime: true, //
//       checkOutTime: true, //
//       petsAllowed: true, //
//       smokingAllowed: true, //
//       ageRestriction: true,
//       otherHouseRules: true, //
//     })
//     .required({
//       // TODO: make non-null/remove defaults in the schema
//       numBathrooms: true,
//       imageUrls: true,
//       petsAllowed: true,
//       smokingAllowed: true,
//       avgRating: true,
//       numRatings: true,
//       amenities: true,
//     })
//     .superRefine((data, ctx) => {
//       if (containsHTML(data.about)) {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: "About section contains HTML",
//         });

//         if (data.otherHouseRules && containsHTML(data.otherHouseRules)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Other house rules section contains HTML",
//           });
//         }
//       }
//     }),

//   reviews: reviewsInsertSchema.omit({ id: true, propertyId: true }).array(),
// });

// export async function scrapeAirbnbListingOld(id: string) {
//   const encodedId = encodeAirbnbId(id);
//   const data = await Promise.all(
//     [
//       // `https://www.airbnb.com/rooms/${id}`,

//       `https://www.airbnb.com/api/v3/StaysPdpSections/160265f6bdbacc2084cdf7de8641926c5ee141c3a2967dca0407ee47cec2a7d1?operationName=StaysPdpSections&locale=en&currency=USD&variables={"id":"${encodedId}","pdpSectionsRequest":{"adults":"1","layouts":["SIDEBAR","SINGLE_COLUMN"],"checkIn":"2024-09-15","checkOut":"2024-09-20"}}&extensions={"persistedQuery":{"version":1,"sha256Hash":"160265f6bdbacc2084cdf7de8641926c5ee141c3a2967dca0407ee47cec2a7d1"}}`,

//       `https://www.airbnb.com/api/v3/StaysPdpReviewsQuery/dec1c8061483e78373602047450322fd474e79ba9afa8d3dbbc27f504030f91d?operationName=StaysPdpReviewsQuery&locale=en&currency=USD&variables={"id":"${encodedId}","pdpReviewsRequest":{"fieldSelector":"for_p3_translation_only","forPreview":false,"limit":10,"offset":"0","showingTranslationButton":false,"first":24,"sortingPreference":"RATING_DESC","checkinDate":"2024-09-19","checkoutDate":"2024-09-24"}}`,
//     ].map((url) =>
//       // axiosWithRetry.get<string>(url, {
//       //   headers: {
//       //     "x-airbnb-api-key": "d306zoyjsyarp7ifhu67rjxn52tv0t20",
//       //   },
//       // }),
//       fetch(url, {}).then((r) => r.json()),
//     ),
//   ).then((r) => r.join("\n\n"));

//   const { reviews, scrapedProperty } = await aiJson({
//     prompt: `Extract listing data and reviews from the following data. For bodies of text like the about and rules sections, parse HTML/markdown as a plain string:\n\n${data}`,
//     schema: airbnbScraperSchema,
//   });

//   const city = await getCity({
//     lat: scrapedProperty.latitude,
//     lng: scrapedProperty.longitude,
//   });

//   const property = {
//     ...scrapedProperty,
//     city,
//     address: city,
//   };

//   return { property, reviews };
// }
