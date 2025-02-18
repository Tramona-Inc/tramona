import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendEmail } from "@/server/server-utils";
import RequestOutreachEmail from "packages/transactional/emails/RequestOutreachEmail";
import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm"; // Import 'eq' for database queries
import {
  PropertyManagerContact,
  propertyManagerContacts,
} from "@/server/db/schema";
import { RADIUS_FALL_BACK } from "@/utils/constants";

interface OllamaStreamChunk {
  model?: string;
  created_at?: string;
  response?: string;
  done?: boolean;
  [key: string]: any;
}

interface NeighborhoodType {
  city: string;
  state: string | null;
  postcode: string | null;
}

export const outreachRouter = createTRPCRouter({
  emailPMFromCityRequest: publicProcedure
    .input(
      z.object({
        requestLocation: z.string(),
        requestedLocationLatLng: z
          .object({ lat: z.number(), lng: z.number() })
          .optional(),
        radius: z.number().optional(), // You might remove radius from input as prompt is radius-free now
      }),
    )

    .mutation(async ({ input }) => {
      if (!input.requestedLocationLatLng) return;
      console.log(input.requestedLocationLatLng.lng);
      console.log(input.requestedLocationLatLng.lat);

      try {
        const requestedPoint = sql`ST_SetSRID(ST_MakePoint(${input.requestedLocationLatLng.lng}, ${input.requestedLocationLatLng.lat}), 4326)`;

        const transformedInputPoint = sql`ST_Transform(${requestedPoint}, 3857)`;
        const transformedLatLngPoint = sql`ST_Transform(lat_lng_point, 3857)`;

        const nearbyProperyManagers = await db
          .select({
            email: propertyManagerContacts.email,
            propertyManagerName: propertyManagerContacts.propertyManagerName,
            latLngPoint: sql<string>`ST_AsText(lat_lng_point)`.as(
              "latLngPoint",
            ),
            distanceMeters: sql<number>`
              ST_Distance(
                ${transformedLatLngPoint},
                ${transformedInputPoint}
              )
            `.as("distance_meters"),
          })
          .from(propertyManagerContacts)
          .where(
            sql`
            lat_lng_point IS NOT NULL
            AND ST_DWithin(
              ${transformedLatLngPoint},
              ${transformedInputPoint},
              ${RADIUS_FALL_BACK}
            )
          `,
          )
          .orderBy(sql`distance_meters ASC`)
          .limit(4);

        console.log(nearbyProperyManagers);
        // <------------------------------------------------------- EMAIL SECTION -------------------------------------------------->

        console.log("Managers to email:", nearbyProperyManagers); // Log managers to be emailed

        for (const manager of nearbyProperyManagers) {
          if (!manager.email) return;
          await sendEmail({
            // Email sending loop - unchanged
            to: manager.email,
            subject: `${manager.propertyManagerName} Potential Travelers looking for a stay in ${input.requestLocation}`,
            content: RequestOutreachEmail({
              requestLocation: input.requestLocation, // Email content still uses requestLocation for now
            }),
          });
        }
      } catch (err) {
        console.log(err);
      }

      return {
        //suggestedNeighborhoods: suggestedNeighborhoods, // Return array of neighborhoods (including city as first element)
        //emailedManagerCount: managers.length, // Return the count of emailed managers
      };
    }),
});
