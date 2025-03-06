import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { secondaryDb } from "@/server/db";
import { warmLeads } from "@/server/db/secondary-schema/warmLeads";
import { cities } from "@/server/db/secondary-schema/cities";
import { getCoordinates } from "@/server/google-maps";
import { createLatLngGISPoint } from "@/server/server-utils";
import { eq } from "drizzle-orm";

export const outreachRouter = createTRPCRouter({
  insertWarmLead: publicProcedure
    .input(z.object({
      email: z.string(),
      cities: z.array(z.object({
        name: z.string(),
        stateCode: z.string(),
        country: z.string()
      }))
    }))
    .mutation(async ({ input }) => {
      // First, check if this email already exists
      const existingLeads = await secondaryDb
        .select()
        .from(warmLeads)
        .where(eq(warmLeads.email, input.email));

      let warmLeadId: number;

      if (existingLeads.length > 0) {
        // Use the existing warm lead
        warmLeadId = existingLeads[0]!.id;
        console.log(`Using existing warm lead for email: ${input.email}`);
      } else {
        // Create a new warm lead
        const newLeads = await secondaryDb
          .insert(warmLeads)
          .values({ email: input.email })
          .returning();
        warmLeadId = newLeads[0]!.id;
        console.log(`Created new warm lead for email: ${input.email}`);
      }

      // Now add the cities for this warm lead
      for (const city of input.cities) {
        console.log("Adding city:", city.name);
        const { location } = await getCoordinates(city.name);
        if (!location) continue;

        const latLngPoint = createLatLngGISPoint({
          lat: location.lat,
          lng: location.lng,
        });

        await secondaryDb
          .insert(cities)
          .values({
            warmLeadId: warmLeadId,
            name: city.name,
            stateCode: city.stateCode,
            country: city.country,
            latLngPoint: latLngPoint
          });
      }
    }),
});
