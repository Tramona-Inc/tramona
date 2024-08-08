import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import axios from "axios";
import ical from "node-ical";
import { db } from "@/server/db";
import { reservedDateRanges } from "@/server/db/schema/tables/reservedDateRanges";
import { eq } from "drizzle-orm";
import { properties } from "@/server/db/schema/tables/properties";
import { updateHospitableCalendar } from '@/pages/api/hospitable';

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
});
