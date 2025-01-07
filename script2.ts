// import { db } from "@/server/db";
// import { properties } from "@/server/db/schema";
// import { eq } from "drizzle-orm/expressions";
// import { getAvailability } from "@/server/direct-sites-scraping/casamundo-scraper";
// import pLimit from 'p-limit';

// async function handler() {

//   const offerIds = (await db.query.properties.findMany({
//     columns: {
//       originalListingId: true,
//     },
//     where: eq(properties.originalListingPlatform, "Casamundo")
//   }).then(properties => properties.flatMap(property => property.originalListingId))).slice(0,15000);

//   const limit = pLimit(50); // Concurrency limit set to 10
//   const results = [];

//   console.time("Overall Availability Check");

//   const requestsWithMonitoring = offerIds.map((offerId) => limit(async () => {
//     const startTime = Date.now(); // Start time for monitoring

//     try {
//       const data = await getAvailability(offerId); // Run getAvailability with the current offerId
//       const responseTime = Date.now() - startTime; // Calculate response time

//       // console.log(`Offer ID: ${offerId} | Response Time: ${responseTime} ms`); // Log response time
//       results.push({ offerId, data, responseTime });

//       return data;
//     } catch (error) {
//       console.error(`Error with Offer ID: ${offerId}`, error);
//       return null;
//     }
//   }));

//   await Promise.all(requestsWithMonitoring);

//   console.timeEnd("Overall Availability Check");

//   // Process all availability data
//   for (const { offerId, data, responseTime } of results) {
//     if (data) {
//       const ranges = getReservedDateRanges(data);
//       // logToFile(`Reserved Date Ranges for ${offerId}: ${JSON.stringify(ranges)}`);

//       // Fetch the property ID
//       // const property = await db.query.properties.findFirst({
//       //   where: eq(properties.originalListingId, offerId),
//       // });

//       // // Ensure property is found before proceeding
//       // if (property) {
//       //   for (const range of ranges) {
//       //     await db.insert(reservedDateRanges).values({
//       //       propertyId: property.id, // Assuming property has an id property
//       //       start: range.start,
//       //       end: range.end,
//       //       platformBookedOn: "tramona",
//       //     });
//       //   }
//       // }
//     }
//   }

// }

// type Availability = Record<string, number>;
// type DateRange = { start: string; end: string };

// function getReservedDateRanges(availabilities: Availability): DateRange[] {
//   const reservedRanges: DateRange[] = [];
//   let start: string | null = null;

//   for (const [date, status] of Object.entries(availabilities)) {
//     if (status !== 2) {
//       // If we don't have a start date, set it
//       if (start === null) {
//         start = date;
//       }
//     } else if (start !== null) {
//       // If status is 2 and we have a start date, close the range
//       reservedRanges.push({ start, end: date });
//       start = null;
//     }
//   }
//   let lastDate = Object.keys(availabilities).pop()!;
//   if (start !== null && start > lastDate) {
//     delete availabilities[lastDate];
//     lastDate = Object.keys(availabilities).pop()!
//   }
//   // If the last date is reserved, finalize the last range
//   if (start !== null ) { // lastStatus !== 2 means it's reserved
//     reservedRanges.push({ start, end: lastDate });
//   }
//   return reservedRanges;
// }

// await handler();
// process.exit(1);