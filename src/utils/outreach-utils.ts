import { sendEmail } from "@/server/server-utils";
import RequestOutreachEmail from "packages/transactional/emails/RequestOutreachEmail";
import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm"; // Import 'eq' for database queries
import { propertyManagerContactsTest } from "@/server/db/secondary-schema";

interface EmailPMFromCityRequestInput {
  requestLocation: string;
  requestedLocationLatLng?: {
    lat: number | undefined;
    lng: number | undefined;
  };
  radius?: number; // You might remove radius from input as prompt is radius-free now
}

export async function emailPMFromCityRequest(
  input: EmailPMFromCityRequestInput,
) {
  if (
    !input.requestedLocationLatLng?.lat ||
    !input.requestedLocationLatLng?.lat
  ) {
    console.log("No requestedLocationLatLng provided, exiting function.");
    return; // Early return if latLng is missing, mirroring the tRPC behavior
  }

  console.log("Input LatLng:", input.requestedLocationLatLng);

  try {
    const requestedPoint = sql`ST_SetSRID(ST_MakePoint(${input.requestedLocationLatLng.lng}, ${input.requestedLocationLatLng.lat}), 4326)`;
    const transformedInputPoint = sql`ST_Transform(${requestedPoint}, 3857)`;
    const transformedLatLngPoint = sql`ST_Transform(lat_lng_point, 3857)`;

    const nearbyProperyManagers = await db
      .select({
        email: propertyManagerContactsTest.email,
        propertyManagerName: propertyManagerContactsTest.name,
        latLngPoint: sql<string>`ST_AsText(lat_lng_point)`.as("latLngPoint"),
        distanceMeters: sql<number>`
          ST_Distance(
            ${transformedLatLngPoint},
            ${transformedInputPoint}
          )
        `.as("distance_meters"),
      })
      .from(propertyManagerContactsTest)
      .where(
        sql`
          lat_lng_point IS NOT NULL
          AND ST_DWithin(
            ${transformedLatLngPoint},
            ${transformedInputPoint},
            10000 -- RADIUS_FALL_BACK - replace with your constant if needed, or pass radius as input
          )
        `,
      ) // Assuming RADIUS_FALL_BACK is defined elsewhere or replace with a number like 10000
      .orderBy(sql`distance_meters ASC`)
      .limit(4);

    console.log("Nearby Property Managers:", nearbyProperyManagers);

    // <------------------------------------------------------- EMAIL SECTION -------------------------------------------------->
    console.log("Managers to email:", nearbyProperyManagers); // Log managers to be emailed

    for (const manager of nearbyProperyManagers) {
      if (!manager.email || manager.email.length < 1) {
        console.log(`Skipping email for manager without email:`, manager);
        continue; // Skip to the next manager if email is missing
      }
      for (const email of manager.email) {
        await sendEmail({
          to: email,
          subject: `${manager.propertyManagerName} Potential Travelers looking for a stay in ${input.requestLocation}`,
          content: RequestOutreachEmail({
            requestLocation: input.requestLocation, // Email content still uses requestLocation for now
          }),
        });
        console.log(`Email sent to: ${email}`);
      }
    }
  } catch (err) {
    console.error("Error in emailPMFromCityRequest:", err);
  }
}
