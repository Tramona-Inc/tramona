
import type { NextApiRequest, NextApiResponse } from 'next';
import { subsequentScrape } from '../../server/direct-sites-scraping';
import { arizonaScraper } from "@/server/direct-sites-scraping/integrity-arizona";
import axios from 'axios';
import { proxyAgent } from "@/server/server-utils";

// This is a testing API route that update the availabity and price of a listing in the offers table
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('API route: Starting scraping process');
      const today = new Date();
      const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      const listings = await subsequentScrape({
        offerId: 321
      });
      console.log('API route: Scraping process completed');
      res.status(200).json({ message: `Successfully updated ${listings} listings.` });
    } catch (error) {
      console.error('API route: Error during scraping process:', error);
      res.status(500).json({ error: 'An error occurred while scraping.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}