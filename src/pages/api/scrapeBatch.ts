import { getAvailability } from '@/server/direct-sites-scraping/casamundo-scraper';
import type { NextApiRequest, NextApiResponse } from 'next';
import pLimit from 'p-limit';

type Availability = Record<string, number>;

export default async function handler(batch: string[]) {
  const limit = pLimit(15);
  const results: { offerId: string; data: Availability }[] = [];

  try {
    // Loop to simulate a task running every 5 seconds for 1 minute
    await Promise.all(batch.map((offerId) => limit(async () => {
      // const startTime = Date.now();
      try {
        const data = await getAvailability(offerId);
        // const responseTime = Date.now() - startTime;

        results.push({ offerId: offerId, data });
        // console.log(
        //   `Batch ${i / 100 + 1}: Successfully processed ${processedCount}/${batch.length}`
        // );
        // logToFile(`Processed availability for Offer ID: ${offerId} | Response Time: ${responseTime} ms`);
      } catch (error) {
        console.error(`Error with Offer ID: ${offerId}`, error.response?.status);
        throw error;
      }
    })));

    return results;
  } catch (error) {
    console.error("Error executing task2:", error);
    return [];
  }
}