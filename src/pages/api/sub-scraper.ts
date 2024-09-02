
import type { NextApiRequest, NextApiResponse } from 'next';
import { SubScrapedResult, subsequentScrape } from '../../server/direct-sites-scraping';
import { arizonaScraper } from "@/server/direct-sites-scraping/integrity-arizona";
import axios from 'axios';
import { proxyAgent } from "@/server/server-utils";

// This is a testing API route that update the availabity and price of a listing in the offers table
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('API route: Starting subsequent scraping process');
      const subsequentScrapeResult = await subsequentScrape({
        offerIds: [323, 324]
      });
      console.log("subsequentScrapeResult: ", subsequentScrapeResult);
      if (subsequentScrapeResult.length > 0) {
        res.status(200).json({ 
          message: `Successfully updated ${subsequentScrapeResult.length} offers.`,
          updatedrResult: subsequentScrapeResult.map(result => ({
            availability: result.isAvailableOnOriginalSite,
            updatedAt: result.availabilityCheckedAt.toISOString(),
            originalNightlyPrice: result.originalNightlyPrice
          }))
        });
      } else {
        console.log('API route: No offers were processed');
        res.status(200).json({ message: 'No offers were processed.' });
      }
    } catch (error) {
      console.error('API route: Error during scraping process:', error);
      res.status(500).json({ error: 'An error occurred while scraping.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}