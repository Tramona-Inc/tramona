
import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeDirectListings } from '../../server/direct-sites-scraping';
import { arizonaScraper } from "@/server/direct-sites-scraping/integrity-arizona";
import axios from 'axios';
import { proxyAgent } from "@/server/server-utils";

// This is a testing API route that scrapes listings from the Integrity Arizona website
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('API route: Starting scraping process');
      const today = new Date();
      const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      const fourDaysLater = new Date(twoDaysLater.getTime() + 2 * 24 * 60 * 60 * 1000);
      const sixDaysLater = new Date(fourDaysLater.getTime() + 2 * 24 * 60 * 60 * 1000);
      const eightDaysLater = new Date(sixDaysLater.getTime() + 2 * 24 * 60 * 60 * 1000);
      // test proxy
      // const rr = await axios.get("https://randomuser.me/api/", { httpsAgent: proxyAgent })
      // // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      // .then((response) => response.data)
      // .then((data) => console.log(data));
      // res.status(200).json({ message: `Successfully, data: ` });
      const listings = await scrapeDirectListings({
        checkIn: twoDaysLater,
        checkOut: eightDaysLater,
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