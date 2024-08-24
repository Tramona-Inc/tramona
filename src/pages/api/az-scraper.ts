
import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeDirectListings } from '../../server/direct-sites-scraping';
import { arizonaScraper } from "@/server/direct-sites-scraping/integrity-arizona";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('API route: Starting scraping process');
      const today = new Date();
      const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      const listings = await scrapeDirectListings({
        checkIn: today,
        checkOut: twoDaysLater,
      });
      console.log('API route: Scraping process completed');
      res.status(200).json({ message: `Successfully scraped and inserted ${listings.length} listings.` });
    } catch (error) {
      console.error('API route: Error during scraping process:', error);
      res.status(500).json({ error: 'An error occurred while scraping.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}