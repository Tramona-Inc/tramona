import type { NextApiRequest, NextApiResponse } from "next";
import { scrapeDirectListings } from "../../server/direct-sites-scraping";
import { redawningSubScraper } from "src/server/direct-sites-scraping/redawning";
// This is a testing API route that scrapes listings from the Integrity Arizona website
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      console.log("API route: Starting scraping process");
      const checkIn = new Date("2024-09-22");
      const checkOut = new Date("2024-09-24");
      const result = await redawningSubScraper({
        checkIn,
        checkOut,
        originalListingId: "475837",
        scrapeUrl: "dummy",
      });
      console.log("API route: Scraping process completed");
      res.status(200).json({
        message: `Successfully sub-scraped on this redawning offer.`,
        data: result,
      });
    } catch (error) {
      console.error("API route: Error during scraping process:", error);
      res.status(500).json({ error: "An error occurred while scraping." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
