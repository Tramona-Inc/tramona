// // import { db } from "@/server/db";
// // import { addDays, isWithinInterval } from "date-fns";
// // import { fetchPrice } from "@/server/direct-sites-scraping/casamundo-scraper";
// // import fs from 'fs';
// // import { properties, reservedDateRanges } from "@/server/db/schema";
// // import { eq } from "drizzle-orm";

// // async function handler() {
// //   console.time('start');

// //   const logToFile = (message: string) => {
// //     fs.appendFile('priceLogs.txt', message + '\n', (err) => {
// //       if (err) console.error('Error writing to file:', err);
// //     });
// //   };

// //   const offerIds = [

// //     // '28b1b679e6183e23',
// //     // 'c592f6ba2c2d2239',
// //     // '4d61849db833a486',
// //     // '10b8af2f074d2adc',
// //     // '0613ccbc08d7c5ea33ff5c1831abc8f3',
// //     // '8c3b82fca785dae7',
// //     // '1ff00b27f134c0ac',
// //     // 'b6c833b54f69ace3',
// //     // '204651c6a0261db6',
// //     // '02b1f4b3db2b9e90',
// //     // 'edfdfe977680171e',
// //     // '6e24932ae656047a',
// //     // 'eac2d4185ca2eaa6',
// //     // '79287a81bcda8824',
// //     // 'c808082dfe0794f6',
// //     // 'c7a73825ac807b23',
// //     // 'a3610e510fb474c4',
// //     // 'eba16adb1ff862f3',
// //     // '37e6d7b50c30b232',
// //     // '778be0965c3c4760',
// //     // 'fee5ee19a4bcb964',
// //     // 'b3dd098849af2649',
// //     // 'acd72b8c2f3f2b5a',
// //     // '1bc18e53fd8722d1',
// //     // '3fb650ce887fd3f9',
// //     // '283a5538fb966c27',
// //     // '01593888c8ab1aa8',
// //     // '6d0cad3d3fb74e2f',
// //     // 'ee3575ce894adf36',
// //     // '90d302c40b2a07da',
// //     // '24106cd2e7ada6a2',
// //     // '027d12f22f0330b5',
// //     // 'dc3598b12bc88702',
// //     '5bc9ef5a27e0852b',
// //     // 'b7950e85e96dee3a',
// //     // 'eeac895be33eda5c',
// //     // 'c0a2b92836ce32d8',
// //     // '7118733e33278dcf',
// //     // '792b19dd683e1ae7',
// //     // 'd8d822da5291e4b5',
// //     // 'b8cf989fbd6e0731',
// //     // '62a5333887d072eb',
// //     // 'bf809cf0eaf10708',
// //     // 'a00a9b78f5f01434',
// //     // 'ea2e3c7087442d3b',
// //     // '257ef98a9db44a1c',
// //     // '133282a1cb56e61f',
// //     // 'c65983e0ea96a2c9',
// //     // 'f12da93dc09b4eaa',
// //     // 'e732bff848dcbda0',
// //     // 'f3bc83d84f55f1cc',
// //     // '80ac74e0c95afd82',
// //     // '38979026432b0f00',
// //     // '9ccd8298e8daa4b7',
// //     // '1f7ef8346efb189d',
// //     // '51da7c952f65697f',
// //     // 'e835680d235aae8c',
// //     // '332688363abc2e44',
// //     // 'b812e7a50c926871',
// //     // '52ba1b54a49b06ac',
// //     // '6ab09ac50aa14c21',
// //     // 'cb7c41caddcc96e4',
// //     // '116d088d71c45780',
// //     // '9bcf053a55f1a40c',
// //     // '57fe5fceaef983d2',
// //     // '850c76d939960d04',
// //     // '830a6be1a2d2b5dc',
// //     // 'b7e061e6bd4f7813',
// //     // 'b3d168ebdb93e982',
// //     // '9b2cde0308f9ddef',
// //     // '6c013021245f6ea0',
// //     // '2dfe7ef4a99dff45',
// //     // '157ba39d742b9f1d',
// //     // '68dd4421856fd8c8',
// //     // 'a17944ef5e38e9c8',
// //     // 'fe17546b5743a253',
// //     // '04ea2614382bbd28f80b3a83e868363f',
// //     // '1b7c682b6aa681fd',
// //     // '30e0991a2d1affb9',
// //     // '48f27b067c07aa0e',
// //     // 'fe7b6741d5f6c6f0',
// //     // '15941a670c7076ca',
// //     // 'db1a454d04bb43ce',
// //     // 'a6abdae09c33eff2',
// //     // 'b8e0010b6a5260e9',
// //     // '2617aa42b0b4b45c',
// //     // 'd0e5f25c0e1355d7',
// //     // '33b96472008d23a7',
// //     // 'cf81fd63177851fa',
// //     // '8a59925f3ad9b75e',
// //     // '290cf438f8806c2a',
// //     // '3a80918267db20c2',
// //     // '4eee51b37fe98ae2',
// //     // '07083b93f750279b',
// //     // '761e98b5fc2b1bff',
// //     // 'e5126950e4ac2a7d',
// //     // '501f028acf04f482',
// //     // '50c014a864c8ffed',
// //     // 'c11b379688f1c4d7',
// //     // '9a7809000d7b5aab6b1c1d71d2d1ab82'
// //   ];

// //   // Updated predefined low-price date ranges
// //   const predefinedLowPriceDates = [
// //     {
// //       title: "Post-Holiday January",
// //       checkIn: new Date(new Date().getFullYear() + 1, 0, 5),  // January 5
// //       duration: 4,
// //     },
// //     {
// //       title: "Early Spring (Late February - Early March)",
// //       checkIn: new Date(new Date().getFullYear() + 1, 1, 20),  // February 20
// //       duration: 6,
// //     },
// //     {
// //       title: "Late Fall (Post-Thanksgiving)",
// //       checkIn: new Date(new Date().getFullYear(), 10, 20),  // November 20
// //       duration: 5,
// //     },
// //     {
// //       title: "Mid-Week Stays (Tuesday to Thursday)",
// //       checkIn: new Date(new Date().getFullYear() + 1, 4, 1),  // Example mid-week range (can dynamically change)
// //       duration: 3,
// //     },
// //   ];

// //   // Helper function to get available date ranges for a property
// //   async function getAvailableRanges(offerId: string) {
// //     const property = await db.query.properties.findFirst({
// //       columns: { id: true },
// //       where: eq(properties.originalListingId, offerId)
// //     });
// //     const originalPropId = property ? property.id : null;

// //     if (originalPropId) {

// //       const ranges = await db.query.reservedDateRanges.findMany({
// //         where: eq(reservedDateRanges.propertyId, originalPropId)
// //       });

// //       return ranges.map(range => ({
// //         ...range,
// //         start: new Date(range.start),
// //         end: new Date(range.end),
// //       }))
// //     }
// //   }

// //   // Helper function to fetch price for a given property and date range
// //   async function getPriceForRange(offerId: string, checkIn: Date, duration: number) {
// //     const price = await fetchPrice({
// //       offerId: offerId,
// //       numGuests: 2,
// //       checkIn: checkIn,
// //       duration: duration,
// //     });

// //     if (price.price === -1) {
// //       // logToFile(`Invalid price for offerId ${offerId} on ${checkIn}: ${price.price}`);
// //       return Infinity; // Return Infinity if the price is invalid (effectively ignoring this price)
// //     }

// //     const perNightPrice = price.price / duration;
// //     logToFile(`Price for offerId ${offerId} on ${checkIn}: ${price.price}, per night: ${perNightPrice}`);
// //     return perNightPrice;
// //   }

// //   async function findClosestAvailableRanges(targetRange: {
// //     title: string,
// //     checkIn: Date,
// //     duration: number,
// //   }, availableRanges: {
// //     start: Date;
// //     end: Date;
// //     id: number;
// //     propertyId: number;
// //     platformBookedOn: "airbnb" | "tramona";
// //   }[] | undefined
// //   ) {

// //     console.log("popopop", targetRange, availableRanges);
// //     // Convert target range start and end dates to Date objects
// //     // const targetEnd = new Date(targetRange.end);

// //     // Find the available range with the smallest start date difference
// //     let closestRange = null;
// //     let smallestDifference = Infinity;

// //     if (availableRanges) {
// //       availableRanges.forEach((range) => {
// //         // const rangeStart = new Date(range.start);
// //         // const rangeEnd = new Date(range.end);

// //         // Calculate the difference in days between target and available range starts
// //         const difference = Math.abs(targetRange.checkIn - range.start);

// //         if (difference < smallestDifference) {
// //           smallestDifference = difference;
// //           closestRange = range;
// //         }
// //       });
// //     }

// //     return closestRange;
// //   }

// //   // Helper function to find the lowest price in the available date ranges
// //   async function findLowestPriceInAvailableRanges(offerId: string, availableRanges: {
// //     start: Date;
// //     end: Date;
// //     id: number;
// //     propertyId: number;
// //     platformBookedOn: "airbnb" | "tramona";
// //   }[] | undefined
// //   ) {
// //     const pricePromises = predefinedLowPriceDates.map(async (targetRange) => {
// //       const closestRange = await findClosestAvailableRanges(targetRange, availableRanges);

// //       console.log(closestRange);

// //       if (closestRange) {
// //         const duration = Math.floor((new Date(closestRange.end) - new Date(closestRange.start)) / (1000 * 60 * 60 * 24));
// //         const price = await getPriceForRange(offerId, closestRange.start, duration);
// //         return price;
// //       }
// //       return Infinity; // If no closest range is found, treat it as a high price
// //     });

// //     // Resolve all price promises and find the minimum price
// //     const prices = await Promise.all(pricePromises);
// //     return Math.min(...prices);
// //   }


// //   const lowestPrices = await Promise.all(
// //     offerIds.map(async (offerId) => {
// //       const availableRanges = await getAvailableRanges(offerId);

// //       let lowestPrice = Infinity; // Start with a high price to find the minimum

// //       // Check predefined low-price date ranges
// //       for (const date of predefinedLowPriceDates) {
// //         const price = await getPriceForRange(offerId, date.checkIn, date.duration);
// //         if (price < lowestPrice) {
// //           lowestPrice = price;
// //         }
// //       }

// //       // If predefined date ranges don't work, fallback to available ranges
// //       if (lowestPrice === Infinity) {
// //         logToFile(`All dates invalid for ${offerId}`);
// //         lowestPrice = await findLowestPriceInAvailableRanges(offerId, availableRanges);
// //       }

// //       logToFile(`Lowest price for offerId ${offerId}: ${lowestPrice}`);
// //       return lowestPrice;
// //     })
// //   );

// //   // Calculate the total lowest price across all properties
// //   const totalLowestPrice = lowestPrices.reduce((acc, price) => acc + price, 0) / lowestPrices.length;
// //   logToFile(`Total lowest price: ${totalLowestPrice}`);

// //   console.timeEnd('start');
// // }

// // await handler();
// // process.exit(1);


// import { db } from "@/server/db";
// import { addDays } from "date-fns";
// // import { fetchPrice } from "@/server/direct-sites-scraping/casamundo-scraper";
// import fs from 'fs';
// import { properties, reservedDateRanges } from "@/server/db/schema";
// import { and, eq, isNotNull, isNull } from "drizzle-orm";

// async function handler() {
//   console.time('start');

//   const logToFile = (message: string) => {
//     fs.appendFile('priceLogs.txt', message + '\n', (err) => {
//       if (err) console.error('Error writing to file:', err);
//     });
//   };

//   const offerObjects = await db.query.properties.findMany({
//     columns: {originalListingId: true},
//     where: and(eq(properties.originalListingPlatform, "Casamundo"), isNull(properties.originalNightlyPrice)),
//     limit: 10000
//   });

//   const offerIds = offerObjects.map((obj) => obj.originalListingId);

//   console.log(offerIds.length);

//   // Updated predefined low-price date ranges
//   const predefinedLowPriceDates = [
//     { title: "Post-Holiday January", checkIn: new Date(new Date().getFullYear() + 1, 0, 5), duration: 4 },   //jan 5
//     { title: "Early Spring (Late February - Early March)", checkIn: new Date(new Date().getFullYear() + 1, 1, 20), duration: 6 },  //feb 20
//     { title: "Late Fall (Post-Thanksgiving)", checkIn: new Date(new Date().getFullYear(), 10, 20), duration: 5 },   // nov 20
//     { title: "Mid-Week Stays (Tuesday to Thursday)", checkIn: new Date(new Date().getFullYear() + 1, 4, 1), duration: 3 },  //may 1
//   ];


//   function stripTime(date: Date) {
//     const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
//     return utcDate;
//   }




//   // Helper function to check if a date range overlaps with reserved ranges
//   function isRangeAvailable(start: Date, end: Date, reservedRanges: {
//     start: Date;
//     end: Date;
//     id: number;
//     propertyId: number;
//     platformBookedOn: "airbnb" | "tramona";
//   }[]) {
//     start = stripTime(start);
//     end = stripTime(end);

//     // console.log(start, end);

//     // return !reservedRanges.some(reserved => {
//     //   const reservedStart = stripTime(new Date(reserved.start)); // Strip time from reserved start
//     //   const reservedEnd = stripTime(new Date(reserved.end)); // Strip time from reserved end

//     //   // Treat end date as exclusive
//     //   return (start < reservedEnd && end > reservedStart) && !(start === reservedEnd || end === reservedStart);
//     // });

//     return !reservedRanges.some(reserved =>
//       (start <= stripTime(new Date(reserved.end)) && end >= stripTime(new Date(reserved.start)))
//     );
//   }

//   // Helper function to find the nearest available date range if predefinedLowPriceDates overlap with reserved dates
//   function findNearestAvailableRange(
//     targetCheckIn: Date,
//     targetDuration: number,
//     reservedRanges: {
//       start: Date;
//       end: Date;
//       id: number;
//       propertyId: number;
//       platformBookedOn: "airbnb" | "tramona";
//     }[]
//   ) {
//     const maxOffset = 30; // Look for available dates within +/- 30 days of the target date

//     let closestAvailableDate = null;

//     for (let offset = 1; offset <= maxOffset; offset++) {
//       const earlierDate = addDays(targetCheckIn, -offset);
//       const laterDate = addDays(targetCheckIn, offset);

//       if (isRangeAvailable(earlierDate, addDays(earlierDate, targetDuration), reservedRanges)) {
//         closestAvailableDate = earlierDate;
//         break;
//       }

//       if (isRangeAvailable(laterDate, addDays(laterDate, targetDuration), reservedRanges)) {
//         closestAvailableDate = laterDate;
//         break;
//       }
//     }

//     return closestAvailableDate;
//   }

//   // Helper function to get reserved date ranges for a property
//   async function getReservedDateRanges(offerId: string) {
//     const property = await db.query.properties.findFirst({
//       columns: { id: true },
//       where: eq(properties.originalListingId, offerId)
//     });
//     const originalPropId = property ? property.id : null;

//     if (originalPropId) {
//       return await db.query.reservedDateRanges.findMany({
//         where: eq(reservedDateRanges.propertyId, originalPropId)
//       });
//     }
//     return [];
//   }

//   // Helper function to fetch price for a given property and date range
//   async function getPriceForRange(offerId: string, checkIn: Date, duration: number) {
//     const price = await fetchPrice({ offerId, numGuests: 2, checkIn, duration });
//     if (price.price === -1) return Infinity; // Treat invalid prices as Infinity
//     const perNightPrice = price.price / duration;
//     logToFile(`Price for offerId ${offerId} on ${checkIn.toDateString()}: ${price.price}, per night: ${perNightPrice}`);
//     return perNightPrice;
//   }

//   // Finds and scrapes the price for either the predefined or nearest available date
//   async function getBestPriceForDates(offerId: string, reservedRanges: {
//     start: Date;
//     end: Date;
//     id: number;
//     propertyId: number;
//     platformBookedOn: "airbnb" | "tramona";
//   }[]) {
//     let lowestPrice = Infinity;

//     for (const date of predefinedLowPriceDates) {
//       const { checkIn, duration } = date;
//       const end = addDays(checkIn, duration);
//       // console.log(checkIn, end);

//       if (isRangeAvailable(checkIn, end, reservedRanges)) {
//         // If predefined date is available, get the price for it
//         const price = await getPriceForRange(offerId, checkIn, duration);
//         lowestPrice = Math.min(lowestPrice, price);
//         // console.log(price);
//       } else {
//         // Otherwise, find the nearest available range
//         const nearestAvailableDate = findNearestAvailableRange(checkIn, duration, reservedRanges);
//         // console.log(nearestAvailableDate, duration);
//         if (nearestAvailableDate) {
//           const price = await getPriceForRange(offerId, nearestAvailableDate, duration);
//           // console.log(price);
//           lowestPrice = Math.min(lowestPrice, price);
//         }
//       }
//     }

//     // console.log(reservedRanges);

//     return lowestPrice;
//   }

//   async function processBatch(batch: string[]) {
//     const reservedRangesPromises = batch.map(offerId => getReservedDateRanges(offerId));
//     const reservedRangesResults = await Promise.all(reservedRangesPromises);

//     await Promise.all(
//       batch.map(async (offerId, index) => {
//         const reservedRanges = reservedRangesResults[index];
//         const lowestPrice = await getBestPriceForDates(offerId, reservedRanges);
//         const cappedPrice = Math.round(lowestPrice * 100);

//         console.log(cappedPrice);


//         logToFile(`Lowest price for offerId ${offerId}: ${lowestPrice}`);

//         if (lowestPrice !== Infinity && Number.isFinite(cappedPrice)) {
//           await db.update(properties).set({
//             originalNightlyPrice: cappedPrice
//           }).where(eq(properties.originalListingId, offerId))
//         } else {
//           await db.update(properties).set({
//             originalNightlyPrice: -1
//           }).where(eq(properties.originalListingId, offerId))
//         }
//       })
//     );
//   }

//   const batchSize = 500;  // Adjust batch size based on your requirements
//   const offerIdBatches = [];
//   for (let i = 0; i < offerIds.length; i += batchSize) {
//     offerIdBatches.push(offerIds.slice(i, i + batchSize));
//   }

//   // Process all batches sequentially
//   for (const batch of offerIdBatches) {
//     await processBatch(batch);
//   }


//   console.timeEnd('start');
// }



// await handler();
// process.exit(1);
