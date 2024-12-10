import { getAvailability } from '@/server/direct-sites-scraping/casamundo-scraper';
import type { NextApiRequest, NextApiResponse } from 'next';
import pLimit from 'p-limit';

type Availability = Record<string, number>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const batchParam = req.query.batch;
  if (!batchParam || typeof batchParam !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing batch parameter' });
  }
  const batch = batchParam.split(','); // Convert query string to array

  const limit = pLimit(15);
  const availableResults: { offerId: string; data: Availability }[] = [];
  const failedOffers: string[] = [];

  try {
    // Loop to simulate a task running every 5 seconds for 1 minute
    await Promise.all(batch.map((offerId) => limit(async () => {
      // const startTime = Date.now();
      try {
        const data = await getAvailability(offerId);
        // const responseTime = Date.now() - startTime;

        availableResults.push({ offerId: offerId, data });
        // console.log(
        //   `Batch ${i / 100 + 1}: Successfully processed ${processedCount}/${batch.length}`
        // );
        // logToFile(`Processed availability for Offer ID: ${offerId} | Response Time: ${responseTime} ms`);
      } catch (error) {
        console.error(`Error with Offer ID: ${offerId}`, error);
        failedOffers.push(offerId);
      }
    })));

    res.status(200).json({ availableResults, failedOffers });
  } catch (error) {
    console.error("Error executing task2:", error);
    res.status(500).json({ error: "Task execution failed" });
  }
}