import { NextApiRequest, NextApiResponse } from "next";
import { scrapeAirbnbListings } from "@/server/external-listings-scraping/airbnb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await scrapeAirbnbListings({
    request: {
      location: "San Francisco, CA",
      checkIn: new Date("2024-10-01"),
      checkOut: new Date("2024-10-03"),
      maxTotalPrice: 250,
    },
    limit: 10,
  }).then((r) => res.json(r));
}
