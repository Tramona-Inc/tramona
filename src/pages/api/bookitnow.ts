import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { casamundoSubScraper } from "@/server/direct-sites-scraping/casamundo-scraper";
import { error } from "node:console";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Scrape request received");

  const { checkIn, checkOut, originalListingId, numGuests } = req.body as {
    checkIn: string;
    checkOut: string;
    originalListingId: string;
    scrapeUrl: string;
    numGuests: number;
  };

  if (!originalListingId) {
    return res
      .status(400)
      .json({ error: "Missing originalListingId parameter" });
  } else if (!numGuests) {
    return res.status(400).json({ error: "Missing numGuests parameter" });
  } else if (!checkIn || !checkOut) {
    return res
      .status(400)
      .json({ error: "Missing checkIn or checkOut parameter" });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const subScraperOptions = {
    originalListingId: originalListingId,
    scrapeUrl: "",
    checkIn: checkInDate,
    checkOut: checkOutDate,
    numGuests,
  };

  try {
    const subScrapedResult = await casamundoSubScraper(subScraperOptions);
    return res.status(200).json({ subScrapedResult });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({
        error:
          "Error scraping casamundo: " + err.stack + " " + originalListingId,
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return res.status(500).json({
        error: `Error scraping casamundo: ${err as string} ${originalListingId}`,
      });
    }
  }
}
