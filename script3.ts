// import { db } from "@/server/db";
// import { properties, reservedDateRanges } from "@/server/db/schema";
// import { and, eq, lt, notExists } from "drizzle-orm/expressions";
// import { getAvailability } from "@/server/direct-sites-scraping/casamundo-scraper";
// import fs from 'fs';
// import pLimit from 'p-limit';
// import delay from 'delay';
// import { sql } from "drizzle-orm";

// const logToFile = (message: string) => {
//   fs.appendFileSync('final_insertion.txt', `${new Date().toISOString()} - ${message}\n`);
// };

// async function handler() {
//   logToFile("Starting handler function");

//   // Fetch all offer IDs that have no reserved date ranges
//   const allOfferIds = [
//     '5bc9ef5a27e0852b'
//   ]
//   // const allOfferIds = await db.query.reservedDateRanges.findMany({
//   //   columns: {
//   //     propertyId: true,
//   //   },
//   //   where: lt(reservedDateRanges.end, reservedDateRanges.start),
//   //   with: {
//   //     properties: {
//   //       columns: {
//   //         originalListingId: true,
//   //       },
//   //     },
//   //   },
//   // }).then(properties => properties.flatMap(property => property.properties.originalListingId));

//   logToFile(`Fetched ${allOfferIds.length} total offer IDs`);

//   const batchSize = 500;
//   const limit = pLimit(15);
//   console.time("Overall Availability Check");

//   // Divide allOfferIds into batches of 500
//   const batches = [];
//   for (let i = 0; i < allOfferIds.length; i += batchSize) {
//     batches.push(allOfferIds.slice(i, i + batchSize));
//   }

//   // Process each batch sequentially
//   for (const batch of batches) {
//     const results = [];

//     // Fetch availability data for each offer ID in the batch
//     await Promise.all(batch.map((offerId) => limit(async () => {
//       const startTime = Date.now();

//       try {
//         const data = await getAvailability(offerId);
//         const responseTime = Date.now() - startTime;
//         results.push({ offerId, data, responseTime });
//         logToFile(`Processed availability for Offer ID: ${offerId} | Response Time: ${responseTime} ms`);
//       } catch (error) {
//         logToFile(`Error fetching availability for Offer ID: ${offerId} - ${error}`);
//       }
//     })));

//     // Process the availability data and insert reserved date ranges
//     const insertPromises = [];
//     logToFile(`Processing availability data for ${results.length} results`);

//     for (const { offerId, data } of results) {
//       if (data) {
//         const sortedData = Object.fromEntries(
//           Object.entries(data).sort(([key1], [key2]) => key1.localeCompare(key2))
//         );
//         const ranges = getReservedDateRanges(sortedData);
//         console.log(ranges);
//         const property = await db.query.properties.findFirst({
//           where: eq(properties.originalListingId, offerId),
//         });

//         if (property) {
//           console.log(property.id);
//           for (const range of ranges) {
//             await db.delete(reservedDateRanges).where(
//               eq(reservedDateRanges.propertyId, property.id)
//             );

//             insertPromises.push(
//               db.insert(reservedDateRanges).values({
//                 propertyId: property.id,
//                 start: range.start,
//                 end: range.end,
//                 platformBookedOn: "airbnb",
//               })
//             );
//           }
//           logToFile(`Added reserved date ranges for property ID: ${property.id}`);
//         } else {
//           logToFile(`Property not found for Offer ID: ${offerId}`);
//         }
//       }
//     }

//     await Promise.all(insertPromises);
//     logToFile("Completed all insertions for current batch");

//     // Delay between batches to avoid overwhelming the server
//     await delay(5000); // Pause for 5 seconds between batches
//   }

//   console.timeEnd("Overall Availability Check");
// }

// type Availability = Record<string, number>;
// type DateRange = { start: string; end: string };

// function getReservedDateRanges(availabilities: Availability): DateRange[] {
//   const reservedRanges: DateRange[] = [];
//   let start: string | null = null;
//   let previousDate;

//   for (const [date, status] of Object.entries(availabilities)) {
//     if (status !== 2) {
//       previousDate = date;
//       if (start === null) {
//         start = date;
//       }
//     } else if (start !== null) {
//       reservedRanges.push({ start, end: previousDate });
//       start = null;
//     }
//   }
//   console.log(availabilities);
//   const lastDate = Object.keys(availabilities).pop()!;
//   // while (start !== null && start > lastDate) {
//   //   delete availabilities[lastDate];
//   //   lastDate = Object.keys(availabilities).pop()!
//   // }

//   if (start !== null) {
//     reservedRanges.push({ start, end: lastDate });
//   }

//   return reservedRanges;
// }

// await handler();
// process.exit(1);
