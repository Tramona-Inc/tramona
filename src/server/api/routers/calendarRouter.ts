import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import axios from "axios";
import ical from "node-ical";
import { db } from "@/server/db";
import { reservedDateRanges } from "@/server/db/schema/tables/reservedDateRanges";
import { eq } from "drizzle-orm";
import { properties } from "@/server/db/schema/tables/properties";

export async function syncCalendar({
  iCalLink,
  propertyId,
}: {
  iCalLink: string;
  propertyId: number;
}): Promise<void> {
  const events = await axios
    .get<string>(iCalLink)
    .then((res) => res.data)
    .then(ical.async.parseICS)
    .then((data) =>
      Object.values(data).filter((event) => event.type === "VEVENT"),
    );

  await db.transaction(async (tx) => {
    await tx
      .delete(reservedDateRanges)
      .where(eq(reservedDateRanges.propertyId, propertyId));

    await tx.insert(reservedDateRanges).values(
      events.map((event) => ({
        propertyId,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
      })),
    );

    await tx
      .update(properties)
      .set({ iCalLink })
      .where(eq(properties.id, propertyId));
  });
}

export async function getListingUnavailableDates(listingId: string) {
  try {
    const response = await axios.get(
      `https://connect.hospitable.com/api/v1/listings/${listingId}/calendar`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
        },
      }
    );

    const calendarData = response.data.data.dates;
    let unavailablePeriods = [];
    let currentPeriod = null;

    for (const day of calendarData) {
      if (!day.availability.available) {
        if (!currentPeriod) {
          currentPeriod = { start_date: day.date, end_date: day.date };
        } else {
          currentPeriod.end_date = day.date;
        }
      } else {
        if (currentPeriod) {
          unavailablePeriods.push(currentPeriod);
          currentPeriod = null;
        }
      }
    }

    // Add the last period if it exists
    if (currentPeriod) {
      unavailablePeriods.push(currentPeriod);
    }

    return unavailablePeriods;
  } catch (error) {
    console.error(`Error fetching calendar for listing ${listingId}:`, error);
    throw new Error(`Failed to fetch calendar for listing ${listingId}`);
  }
}

// Usage
const listingId = "8fe70a29-c618-49c4-8632-c6de445b3060";
getListingUnavailableDates(listingId).then((unavailablePeriods) => {
  console.log("Unavailable periods:", unavailablePeriods);
});

export const calendarRouter = createTRPCRouter({
  syncCalendar: publicProcedure
    .input(
      z.object({
        iCalLink: z.string().url(),
        propertyId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const { iCalLink, propertyId } = input;
      await syncCalendar({ iCalLink: iCalLink, propertyId });
    }),

  getReservedDateRanges: publicProcedure
    .input(z.object({ propertyId: z.number() }))
    .query(async ({ input }) => {
      const { propertyId } = input;
      const dates = await db
        .select({
          start: reservedDateRanges.start,
          end: reservedDateRanges.end,
        })
        .from(reservedDateRanges)
        .where(eq(reservedDateRanges.propertyId, propertyId));

      return dates;
    }),


    fetchHospitableCalendar: publicProcedure
    .input(z.object({ propertyId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { propertyId } = input;

      try {
        const response = await axios.get(
          // `https://connect.hospitable.com/api/v1/listings/${propertyId}/calendar`,
          `https://connect.hospitable.com/api/v1/listings/8fe70a29-c618-49c4-8632-c6de445b3060/calendar`,
          
          {
            headers: {
              Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
            },
            params: {
              start_date: new Date().toISOString().split('T')[0],
              end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            }
          }
        );

        const calendarData = response.data.data.dates;
        
        let currentRange: { start: string; end: string } | null = null;
        const reservedIntervals: Array<{ start: string; end: string }> = [];

        calendarData.forEach((day: { date: string; availability: { available: boolean } }) => {
          if (!day.availability.available) {
            if (currentRange) {
              currentRange.end = day.date;
            } else {
              currentRange = { start: day.date, end: day.date };
            }
          } else {
            if (currentRange) {
              reservedIntervals.push(currentRange);
              currentRange = null;
            }
          }
        });

        if (currentRange) {
          reservedIntervals.push(currentRange);
        }

        return reservedIntervals;
      } catch (error) {
        console.error("Error fetching Hospitable calendar:", error);
        throw new Error("Failed to fetch Hospitable calendar");
      }
    }),
});
