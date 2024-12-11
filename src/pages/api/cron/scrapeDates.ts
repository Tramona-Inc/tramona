import { db } from "@/server/db";
import { properties, reservedDateRanges } from "@/server/db/schema";
import { asc, eq, inArray } from "drizzle-orm/expressions";
import pLimit from 'p-limit';
import { sql } from "drizzle-orm";

// const logToFile = (message: string) => {
//   fs.appendFileSync('handler_logs.txt', `${new Date().toISOString()} - ${message}\n`);
// };

type AvailableResults = { offerId: string; data: Availability };
type FailedOffers = string[];
type ScrapeBatchResponse = { availableResults: AvailableResults[]; failedOffers: FailedOffers };


const sanitizeString = (str: string | null): string => {
  if (!str) return '';
  return str.replace(/\0/g, '').trim();
};

// Sanitize dates, ensuring they are valid and in the correct format
const sanitizeDate = (date: Date | string): Date => {
  if (!date) return new Date();
  try {
    const sanitizedString = sanitizeString(date instanceof Date ? date.toISOString() : date);
    return new Date(sanitizedString);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`Invalid date encountered: ${date}`, error);
    return new Date(); // Return current date as a fallback
  }
};


async function handler() {
  // logToFile("Starting handler function");
  console.log("Starting handler function");

  const offerIds = await db.query.properties.findMany({
    columns: { originalListingId: true },
    where: eq(properties.originalListingPlatform, "Casamundo"),
    orderBy: [asc(properties.originalListingId)],
    limit: 50,
  }).then(properties => properties.flatMap(property => property.originalListingId));

  if (offerIds.length === 0) {
    console.log("No offer IDs found");
    return;
  }

  console.log(`Fetched ${offerIds.length} offer IDs`);

  // const limit = pLimit(3);
  const results: { offerId: string; data: Availability }[] = [];

  // console.time("Overall Availability Check");
  const requestAvailability = async () => {
    // for (let i = 0; i < offerIds.length; i += 100) {
    // Slice offerIds to process in batches of 100
    // const batch = offerIds.slice(i, i + 100);

    // let processedCount = 0;

    const processBatch = async (batch: string[]) => {
      try {
        const response = await fetch(
          `https://www.tramona.com/api/scrapeBatch?batch=${batch.join(',')}`
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const { availableResults, failedOffers } = await response.json() as ScrapeBatchResponse;
        console.log(`Batch failed ${failedOffers.length} offers`);
        results.push(...availableResults);



        // Loop to simulate a task running every 5 seconds for 1 minute


        // res.status(200).json({ availableResults, failedOffers });
      } catch (error) {
        console.error("Error executing task2:", error);
        // res.status(500).json({ error: "Task execution failed" });
      }
    }


    await processBatch(offerIds.filter((id): id is string => id !== null));


    // await Promise.all(batch.map((offerId) => limit(async () => {
    //   // const startTime = Date.now();
    //   try {
    //     const data = await getAvailability(offerId!);
    //     // const responseTime = Date.now() - startTime;

    //     results.push({ offerId: offerId!, data });
    //     processedCount++; // Increment counter on success
    //     console.log(
    //       `Batch ${i / 100 + 1}: Successfully processed ${processedCount}/${batch.length}`
    //     );
    //     // logToFile(`Processed availability for Offer ID: ${offerId} | Response Time: ${responseTime} ms`);
    //   } catch (error) {
    //     console.error(`Error with Offer ID: ${offerId}`, error.response?.status);
    //   }
    // })));

    // console.timeEnd(`Finished processing batch ${i / 100 + 1}`);

    // // Delay after each batch to avoid overwhelming the server
    // await delay(5000); // Pause for 5 seconds between batches


  };

  await requestAvailability();
  console.log(`Finished processing ${results.length} offers`);
  // console.timeEnd("Overall Availability Check");

  // const insertPromises = [];
  // logToFile(`Processing availability data for ${results.length} results`);


  const insertBatches: typeof reservedDateRanges.$inferInsert[] = [];
  const deleteIds: number[] = [];
  const updateProperties: { id: number; datesLastUpdated: Date }[] = [];

  const propertyCache = new Map<string, number>();
  const newLimit = pLimit(500);
  // Process all results concurrently
  await Promise.all(
    results.map(async ({ offerId, data }) => newLimit(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!data) return;

      // console.log(`Processing offer ID: ${offerId}`);
      const ranges = getReservedDateRanges(data);
      console.log(`Found ${ranges.length} ranges for offer ID: ${offerId}`);

      let propertyId = propertyCache.get(offerId);
      if (!propertyId) {
        const property = await db.query.properties.findFirst({
          columns: { id: true },
          where: eq(properties.originalListingId, offerId),
        });

        if (!property) {
          console.error(`Property not found for Offer ID: ${offerId}`);
          return;
        }

        propertyId = property.id;
        propertyCache.set(offerId, propertyId);
      }

      const existingRanges = await db.query.reservedDateRanges.findMany({
        columns: { id: true, start: true, end: true },
        where: eq(reservedDateRanges.propertyId, propertyId),
      });

      const existingMap = new Map(
        existingRanges.map(range => [`${range.start}_${range.end}`, range])
      );

      for (const range of ranges) {
        const key = `${range.start}_${range.end}`;
        if (!existingMap.has(key)) {
          insertBatches.push({
            propertyId,
            start: sanitizeDate(range.start).toISOString(),
            end: sanitizeDate(range.end).toISOString(),
            platformBookedOn: "airbnb",
          });
        } else {
          existingMap.delete(key);
        }
      }

      deleteIds.push(...Array.from(existingMap.values()).map(entry => entry.id));
      console.log(`Queued for deletion: ${Array.from(existingMap.values()).length} ranges for Offer ID: ${offerId}`);

      // Queue property update
      updateProperties.push({ id: propertyId, datesLastUpdated: new Date() });
        // console.log(`Queued property update for Property ID: ${propertyId}`);
      }).then(() => {
        console.log(`Finished processing offer ID: ${offerId}`);
      }).catch((error) => {
        console.error(`Error processing offer ID: ${offerId}`, error);
      })
    )
  );

  const BATCH_SIZE = 100;

  // Execute batched insertions and deletions concurrently
  if (insertBatches.length > 0) {
    console.log(`Inserting ${insertBatches.length} ranges in batches`);
    const insertPromises = [];
    for (let i = 0; i < insertBatches.length; i += BATCH_SIZE) {
      const batch = insertBatches.slice(i, i + BATCH_SIZE);
      insertPromises.push(db.insert(reservedDateRanges).values(batch));
    }
    await Promise.all(insertPromises);
    console.log(`All insertions complete`);
  }

  if (deleteIds.length > 0) {
    console.log(`Deleting ${deleteIds.length} ranges in batches`);
    const deletePromises = [];
    for (let i = 0; i < deleteIds.length; i += BATCH_SIZE) {
      const batch = deleteIds.slice(i, i + BATCH_SIZE);
      deletePromises.push(
        db.delete(reservedDateRanges).where(inArray(reservedDateRanges.id, batch))
      );
    }
    await Promise.all(deletePromises);
    console.log(`All deletions complete`);
  }

  if (updateProperties.length > 0) {
    console.log(`Updating ${updateProperties.length} properties in batches`);
    const updatePromises = [];
    for (let i = 0; i < updateProperties.length; i += BATCH_SIZE) {
      const batch = updateProperties.slice(i, i + BATCH_SIZE);
      updatePromises.push(
        ...batch.map(({ id, datesLastUpdated }) =>
          db.update(properties).set({ datesLastUpdated }).where(eq(properties.id, id))
        )
      );
    }
    await Promise.all(updatePromises);
    console.log(`All updates complete`);
  }

  // Wait for all batch operations to complete

  console.log("Processing complete.");

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  await db.delete(properties).where(
    sql`dates_last_updated < ${twentyFourHoursAgo}`
  );


  // await Promise.all(insertPromises);
  console.log("Completed all insertions");
}

type Availability = Record<string, number>;
type DateRange = { start: string; end: string };

function getReservedDateRanges(availabilities: Availability): DateRange[] {
  const reservedRanges: DateRange[] = [];
  let start: string | null = null;

  for (const [date, status] of Object.entries(availabilities)) {
    if (status !== 2) {
      if (start === null) start = date;
    } else if (start !== null) {
      reservedRanges.push({ start, end: date });
      start = null;
    }
  }

  let lastDate = Object.keys(availabilities).pop()!;
  if (start !== null && start > lastDate) {
    delete availabilities[lastDate];
    lastDate = Object.keys(availabilities).pop()!
  }

  if (start !== null) {
    reservedRanges.push({ start, end: lastDate });
  }

  return reservedRanges;
}

await handler();
process.exit(1);
