import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { secondaryDb } from "@/server/db";
import { warmLeads } from "@/server/db/secondary-schema/warmLeads";
import { cities } from "@/server/db/secondary-schema/cities";
import { getCoordinates } from "@/server/google-maps";
import { createLatLngGISPoint } from "@/server/server-utils";

export const outreachRouter = createTRPCRouter({
  insertWarmLead: publicProcedure
    .input(z.object({ email: z.string(), cities: z.string().array(), stateCode: z.string(), country: z.string() }))
    .mutation(async ({ input }) => {
      const warmLead = await secondaryDb.insert(warmLeads).values({ email: input.email }).returning();
      for (const city of input.cities) {
        const { location } = await getCoordinates(city);
        if (!location) continue;
        const latLngPoint = createLatLngGISPoint({
          lat: location.lat,
          lng: location.lng,
        });
        await secondaryDb.insert(cities).values({ warmLeadId: warmLead[0]!.id, name: city, stateCode: input.stateCode, country: input.country, latLngPoint: latLngPoint });
      }
    }),
});
