import { scrapeDirectListings } from "@/server/direct-sites-scraping";
import { getNumNights } from "@/utils/utils";
import { requests } from "@/server/db/schema";
import { NextApiResponse } from "next";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { requestId: requestIdStr } = req.body as {
    requestId: string;
  };
  if (!requestIdStr) {
    return res.status(400).json({ error: "Missing requestId parameter" });
  }

  const requestId = Number(requestIdStr);

  try {
    const request = await db.query.requests.findFirst({
      with: {
        madeByGroup: {
          with: {
            owner: true,
          },
        },
      },
      where: eq(requests.id, requestId),
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    console.log(`Scraping listings for request ${request.id}`);

    await scrapeDirectListings({
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      requestNightlyPrice:
        request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut),
      requestId: request.id,
      location: request.location,
      numGuests: request.numGuests,
    }).catch((err) => {
      if (err instanceof Error) {
        console.error(
          `Error scraping listings for request ${request.id}:\n\n${err.stack}`,
        );
      } else {
        console.error(
          `Error scraping listings for request ${request.id}: ${err}`,
        );
      }
      return res.status(500).json({ error: "Error scraping listings" });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error scraping listings" });
  }

  return res.status(200).json({ message: "Scraped listings" });
}
