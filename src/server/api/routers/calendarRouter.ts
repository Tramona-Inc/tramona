import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import axios from "axios";
import ical from "node-ical";
import { db } from "@/server/db";
import { reservedDateRanges } from "@/server/db/schema/tables/reservedDateRanges";
import { and, eq, gte, lte } from "drizzle-orm";
import { properties } from "@/server/db/schema/tables/properties";

export async function syncCalendar({
  iCalLink,
  propertyId,
  platformBookedOn,
}: {
  iCalLink: string;
  propertyId: number;
  platformBookedOn: 'airbnb' | 'tramona';
}): Promise<void> {
  const events = await axios
    .get<string>(iCalLink)
    .then((res) => res.data)
    .then(ical.async.parseICS)
    .then((data) =>
      Object.values(data).filter((event) => event.type === "VEVENT"),
    );

    console.log(events);

  await db.transaction(async (tx) => {
    // Delete existing entries for this platform and property
    await tx
      .delete(reservedDateRanges)
      .where(
        and(
          eq(reservedDateRanges.propertyId, propertyId),
          eq(reservedDateRanges.platformBookedOn, platformBookedOn)
        )
      );

      console.log('deleted');

    // Insert new entries
    await tx.insert(reservedDateRanges).values(
      events.map((event) => ({
        propertyId,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        platformBookedOn: platformBookedOn,
      })),
    );

    // Update the iCalLink if it's changed
    await tx
      .update(properties)
      .set({ iCalLink })
      .where(eq(properties.id, propertyId));
  });
}

export async function generateICSContent(
  reservedDates: { start: string; end: string; platformBookedOn: string }[],
): Promise<string> {
  let icsContent = `BEGIN:VCALENDAR
PRODID;X-RICAL-TZSOURCE=TZINFO:-//Your Travel Booking Platform//Hosting Calendar 1.0.0//EN
CALSCALE:GREGORIAN
VERSION:2.0
`;

  reservedDates.forEach((date, index) => {
    const startDate = new Date(date.start);
    const endDate = new Date(date.end);
    const startDateString =
      startDate.toISOString().split("T")[0]?.replace(/-/g, "") ?? "";
    const endDateString =
      endDate.toISOString().split("T")[0]?.replace(/-/g, "") ?? "";
    icsContent += `BEGIN:VEVENT
DTEND;VALUE=DATE:${endDateString}
DTSTART;VALUE=DATE:${startDateString}
UID:yourplatform-${index}-${Date.now()}@tramona.com
SUMMARY:${date.platformBookedOn} (Not available)
END:VEVENT
`;
  });

  icsContent += "END:VCALENDAR";
  return icsContent;
}

export const calendarRouter = createTRPCRouter({
  syncCalendar: publicProcedure
    .input(
      z.object({
        iCalLink: z.string().url(),
        propertyId: z.number(),
        platformBookedOn: z.enum(["airbnb", "tramona"]),
      }),
    )
    .mutation(async ({ input }) => {
      const { iCalLink, propertyId, platformBookedOn } = input;
      await syncCalendar({ iCalLink, propertyId, platformBookedOn });
    }),

  getReservedDateRanges: publicProcedure
    .input(z.object({ propertyId: z.number() }))
    .query(async ({ input }) => {
      const { propertyId } = input;
      const dates = await db
        .select({
          start: reservedDateRanges.start,
          end: reservedDateRanges.end,
          platformBookedOn: reservedDateRanges.platformBookedOn,
        })
        .from(reservedDateRanges)
        .where(eq(reservedDateRanges.propertyId, propertyId));

      return dates;
    }),

  getICSContent: publicProcedure
    .input(z.object({ propertyId: z.number() }))
    .query(async ({ input }) => {
      const { propertyId } = input;
      const reservedDates = await db
        .select({
          start: reservedDateRanges.start,
          end: reservedDateRanges.end,
          platformBookedOn: reservedDateRanges.platformBookedOn,
        })
        .from(reservedDateRanges)
        .where(eq(reservedDateRanges.propertyId, propertyId));

      return generateICSContent(reservedDates);
    }),

    updateCalendar: publicProcedure
    .input(
      z.object({
        propertyId: z.number(),
        start: z.string(),
        end: z.string(),
        isAvailable: z.boolean(),
        platformBookedOn: z.enum(["airbnb", "tramona"]),
      }),
    )
    .mutation(async ({ input }) => {
      const { propertyId, start, end, isAvailable, platformBookedOn } = input;

      await db.transaction(async (tx) => {
        if (!isAvailable) {
          const overlappingRanges = await tx
            .select()
            .from(reservedDateRanges)
            .where(
              and(
                eq(reservedDateRanges.propertyId, propertyId),
                eq(reservedDateRanges.platformBookedOn, platformBookedOn),
                lte(reservedDateRanges.start, end),
                gte(reservedDateRanges.end, start)
              )
            );

          if (overlappingRanges.length > 0) {
            const mergedStart = overlappingRanges.reduce(
              (min, range) => (range.start < min ? range.start : min),
              start
            );
            const mergedEnd = overlappingRanges.reduce(
              (max, range) => (range.end > max ? range.end : max),
              end
            );

            await tx
              .delete(reservedDateRanges)
              .where(
                and(
                  eq(reservedDateRanges.propertyId, propertyId),
                  eq(reservedDateRanges.platformBookedOn, platformBookedOn),
                  lte(reservedDateRanges.start, mergedEnd),
                  gte(reservedDateRanges.end, mergedStart)
                )
              );

            // insert merged range
            await tx.insert(reservedDateRanges).values({
              propertyId,
              start: mergedStart,
              end: mergedEnd,
              platformBookedOn,
            });
          } else {
            // if no overlapping ranges, insert new range
            await tx.insert(reservedDateRanges).values({
              propertyId,
              start,
              end,
              platformBookedOn,
            });
          }
        } else {
          // unblocking date range
          await tx
            .delete(reservedDateRanges)
            .where(
              and(
                eq(reservedDateRanges.propertyId, propertyId),
                eq(reservedDateRanges.platformBookedOn, platformBookedOn),
                lte(reservedDateRanges.start, end),
                gte(reservedDateRanges.end, start)
              )
            );
        }
      });

      const updatedReservedDates = await db
        .select({
          start: reservedDateRanges.start,
          end: reservedDateRanges.end,
          platformBookedOn: reservedDateRanges.platformBookedOn,
        })
        .from(reservedDateRanges)
        .where(eq(reservedDateRanges.propertyId, propertyId));

      const updatedICSContent = await generateICSContent(updatedReservedDates);

      return {
        icsUrl: `https://tramona.com/api/ics/${propertyId}`,
        icsContent: updatedICSContent,
      };
    }),
});