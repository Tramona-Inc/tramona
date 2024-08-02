import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import axios from "axios";
import type { VEvent } from "node-ical";
import ical from "node-ical";
import { db } from "@/server/db";
import { reservedDateRanges } from "@/server/db/schema/tables/reservedDateRanges";
import { eq } from "drizzle-orm";
import { properties } from "@/server/db/schema/tables/properties";

export async function syncCalendar(
  iCalUrl: string,
  propertyId: number,
): Promise<void> {
  console.log("iCal URL:", iCalUrl);
  console.log("Property ID:", propertyId);

  try {
    // fetch iCal data
    console.log("Fetching iCal data...");
    const response = await axios.get<string>(iCalUrl);
    const icsData = response.data;
    console.log("iCal data fetched successfully");

    // parse iCal data
    console.log("Parsing iCal data...");
    const parsedData = await ical.async.parseICS(icsData);
    console.log(
      "Number of items in parsed data:",
      Object.keys(parsedData).length,
    );

    // process the data
    console.log("Processing events...");
    const events = Object.values(parsedData).filter(
      (event): event is VEvent =>
        event.type === "VEVENT" && "start" in event && "end" in event,
    );
    console.log("Number of VEVENT items:", events.length);

    await db.transaction(async (tx) => {
      // delete existing reserved dates for this property
      await tx
        .delete(reservedDateRanges)
        .where(eq(reservedDateRanges.propertyId, propertyId));

      for (const event of events) {
        await tx.insert(reservedDateRanges).values({
          propertyId: Number(propertyId),
          start: event.start.toISOString(),
          end: event.end.toISOString(),
        });
      }

      // update iCalLink
      await tx
        .update(properties)
        .set({ iCalLink: iCalUrl })
        .where(eq(properties.id, propertyId));
    });

    console.log(`Synced ${events.length} events for property ${propertyId}`);
  } catch (error) {
    console.error("Error in syncCalendar:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to sync calendar",
      cause: error,
    });
  }
}

export const calendarRouter = createTRPCRouter({
  syncCalendar: publicProcedure
    .input(
      z.object({
        iCalUrl: z.string().url().nullable(),
        propertyId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const { iCalUrl, propertyId } = input;

      if (!iCalUrl) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "iCalUrl is required",
        });
      }

      try {
        await syncCalendar(iCalUrl, propertyId);
        return { message: "Calendar sync completed successfully" };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to sync calendar",
          cause: error,
        });
      }
    }),
  getReservedDateRanges: publicProcedure
    .input(z.object({ propertyId: z.number() }))
    .query(async ({ input }) => {
      const { propertyId } = input;
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch reserved dates",
          cause: error,
        });
      }
    }),
});
