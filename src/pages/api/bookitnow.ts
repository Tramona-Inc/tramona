
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { casamundoSubScraper } from "@/server/direct-sites-scraping/casamundo-scraper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Scrape request received");

  const { checkIn, checkOut, originalListingId, scrapeUrl, numGuests } = req.body as {
    checkIn: Date;
    checkOut: Date;
    originalListingId: string;
    scrapeUrl: string;
    numGuests: number;
  };

  if (!originalListingId || !scrapeUrl || checkIn === undefined || checkOut === undefined || !numGuests) {
    return res.status(400).json({ error: "Missing offerId, checkIn, or checkOut parameter" });
  }

  const subScraperOptions = {
    originalListingId: originalListingId,
    scrapeUrl: '',
    checkIn,
    checkOut,
    numGuests,
  };

  const subScrapedResult = await casamundoSubScraper(subScraperOptions);

  return res.status(200).json({ subScrapedResult });
}
