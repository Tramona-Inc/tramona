import type { NextApiRequest, NextApiResponse } from "next";
import { scrapeDirectListings } from "../../server/direct-sites-scraping";
import { redawningScraper } from "src/server/direct-sites-scraping/redawning";
// This is a testing API route that scrapes listings from the Integrity Arizona website
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      console.log("API route: Starting multi-scraper scraping process");
      const checkIn = new Date("2024-10-23");
      const checkOut = new Date("2024-10-26");
      // const url = `https://www.redawning.com/search/properties?ptype=country&platitude=38.7945952&plongitude=-106.5348379&pcountry=US&pname=United%20States&sleepsmax=1TO100&dates=${convertToEpochAt7AM(checkIn)}TO${convertToEpochAt7AM(checkOut)}`;
      const result = await scrapeDirectListings({
        checkIn,
        checkOut,
        location: "Parker Strip",
        longitude: -114.1885228,
        latitude: 34.2272995,
        scrapersToExecute: ["redawningScraper", "arizonaScraper"],
      });
      console.log("API route: Scraping process completed");
      res
        .status(200)
        .json({ message: `Successfully scraped on redawning.`, data: result });
    } catch (error) {
      console.error("API route: Error during scraping process:", error);
      res.status(500).json({ error: "An error occurred while scraping." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
