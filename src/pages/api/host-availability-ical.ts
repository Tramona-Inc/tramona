// pages/api/reserved-dates.ts

import { type NextApiRequest, type NextApiResponse } from "next";
import { db } from "@/server/db";
import { reservedDateRanges } from "@/server/db/schema/tables/reservedDateRanges";
import { eq } from "drizzle-orm";

export async function getreservedDateRanges(propertyId: number) {
  try {
    const dates = await db
      .select({
        start: reservedDateRanges.start,
        end: reservedDateRanges.end,
      })
      .from(reservedDateRanges)
      .where(eq(reservedDateRanges.propertyId, propertyId));

    return dates.map((date) => ({
      start: date.start.toString(),
      end: date.end.toString(),
    }));
  } catch (error) {
    console.error("Error fetching reserved dates:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { propertyId } = req.query;

      if (!propertyId || typeof propertyId !== "string") {
        return res.status(400).json({ error: "Property ID is required" });
      }

      const propertyIdNumber = parseInt(propertyId, 10);

      if (isNaN(propertyIdNumber)) {
        return res.status(400).json({ error: "Invalid Property ID" });
      }

      const reservedDateRanges = await getreservedDateRanges(propertyIdNumber);
      res.status(200).json(reservedDateRanges);
    } catch (error) {
      console.error("Error fetching reserved dates:", error);
      res.status(500).json({ error: "Failed to fetch reserved dates" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
