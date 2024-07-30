import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import ical, { VEvent } from "node-ical";
import { db } from "@/server/db";
import { reservedDates } from "@/server/db/schema/tables/reservedDates";
import { eq } from "drizzle-orm";
import { properties } from "@/server/db/schema/tables/properties";
import { formatDateRange } from "@/utils/utils";

// keeping track of in-progess requests
const ongoingOps = new Map<string, Promise<void>>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    console.log("Received POST request to sync calendar");
    const { iCalUrl, propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: "Property ID is required" });
    }

    if (ongoingOps.has(propertyId)) {
      console.log(`Request already in progress for property ${propertyId}`);
      return res.status(202).json({ message: "Request already in progress" });
    }
    // add operation to list of ongoing operations
    const newOperation = syncCalendar(iCalUrl, propertyId);
    ongoingOps.set(propertyId, newOperation);

    try {
      await newOperation;
      ongoingOps.delete(propertyId);
      return res.status(200).json({ message: "Calendar sync completed successfully" });
    } catch (error) {
      ongoingOps.delete(propertyId);
      console.error("Error syncing calendar:", error);
      return res.status(500).json({
        error: "Failed to sync calendar",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else {
    console.log(`Received unsupported ${req.method} request`);
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function syncCalendar(iCalUrl: string, propertyId: number): Promise<void> {
  console.log("iCal URL:", iCalUrl);
  console.log("Property ID:", propertyId);

  // fetch iCal data
  console.log("Fetching iCal data...");
  const response = await axios.get(iCalUrl);
  const icsData = response.data;
  console.log("iCal data fetched successfully");

  // parse iCal data
  console.log("Parsing iCal data...");
  const parsedData = await ical.async.parseICS(icsData);
  console.log("Number of items in parsed data:", Object.keys(parsedData).length);

  // process the data
  console.log("Processing events...");
  const events = Object.values(parsedData).filter(
    (event): event is VEvent =>
      event.type === "VEVENT" && "start" in event && "end" in event,
  );
  console.log("Number of VEVENT items:", events.length);

  // delete existing reserved dates for this property
  await db.delete(reservedDates).where(eq(reservedDates.propertyId, propertyId));

  const processedEvents = new Set();

  for (const event of events) {
    if (event.start && event.end) {
      const checkIn = new Date(event.start);
      const checkOut = new Date(event.end);
      const eventKey = formatDateRange(checkIn, checkOut);

      if (!processedEvents.has(eventKey)) {
        await db.insert(reservedDates).values({
          propertyId: propertyId,
          checkIn,
          checkOut,
        });
        processedEvents.add(eventKey);
      }
    }
  }

  // update iCalLink
  await db
    .update(properties)
    .set({ iCalLink: iCalUrl })
    .where(eq(properties.id, propertyId));

  console.log(`Synced ${events.length} events for property ${propertyId}`);
}