import { db, secondaryDb } from "@/server/db";
// import {
//   propertyManagerContacts,
//   type PropertyManagerContactInsert,
// } from "@/server/db/schema";
// import { faker } from "@faker-js/faker";

import { createLatLngGISPoint } from "@/server/server-utils";
import { and, eq, exists, isNotNull, isNull } from "drizzle-orm";
import { propertyManagerContacts } from "@/server/db/secondary-schema";
import { getCoordinates } from "@/server/google-maps";

// // Initialize Bun SQLite database

// async function populatePropertyManagerContacts(numberOfRows: number) {
//   const inserts: PropertyManagerContactInsert[] = []; // 1. Declare inserts array with the type
//   for (let i = 0; i < numberOfRows; i++) {
//     const email: string = "ueharaneal@gmail.com"; // Explicitly typed as string
//     const city = faker.location.city(); // Explicitly typed as string
//     const state: string = faker.location.state({ abbreviated: true }); // Explicitly typed as string
//     const url: string = faker.internet.url(); // Explicitly typed as string
//     const propertyManagerName: string = faker.company.name(); //
//     inserts.push({
//       email: "ueharaneal@gmail.com" as string, // Type assertion as string
//       city: faker.location.city() as string, // Type assertion as string
//       state: faker.location.state({ abbreviated: true }) as string, // Type assertion as string
//       url: faker.internet.url() as string, // Type assertion as string
//       propertyManagerName: faker.company.name() as string, // Type assertion as string
//     });
//   }

//   try {
//     await db.insert(propertyManagerContacts).values(inserts); // 3. Use inserts array in the insert query
//     console.log(
//       `Successfully inserted ${numberOfRows} rows into propertyManagerContacts table.`,
//     );
//   } catch (error) {
//     console.error("Error inserting data:", error);
//   }
// }

// async function main() {
//   const numberOfRowsToInsert = 100; // You can change this number
//   await populatePropertyManagerContacts(numberOfRowsToInsert);
// }

// await main();

//function to populate the table with gis points
// export const populateGIS = async () => {
//   const latLngPoint = createLatLngGISPoint({
//     lat: 33.985664,
//     lng: -117.885414,
//   });

//   await db
//     .update(propertyManagerContacts)
//     .set({
//       latLngPoint: latLngPoint,
//     })
//     .where(
//       eq(propertyManagerContacts.id, 1),
//       //isNull(propertyManagerContacts.latLngPoint)
//     )
//     .then((res) => res.map((property) => console.log("updated:", property)));
// };

// await populateGIS();

export async function populateLatLngPoint() {
  try {
    const managersWOLatLng =
      await secondaryDb.query.propertyManagerContacts.findMany({
        where: and(
          isNull(propertyManagerContacts.latLngPoint),
          isNotNull(propertyManagerContacts.city),
        ),
        columns: {
          // Select only necessary columns for efficiency
          id: true,
          city: true,
        },
      });

    console.log(
      `Found ${managersWOLatLng.length} managers without LatLng to update.`,
    );

    for (const manager of managersWOLatLng) {
      if (!manager.city) {
        console.warn(
          `Skipping manager with id ${manager.id} due to missing city.`,
        ); // Warn if city is unexpectedly missing
        continue; // Skip to the next manager
      }

      try {
        const coords = await getCoordinates(manager.city);
        if (coords.location) {
          const latLongPont = createLatLngGISPoint({
            lat: coords.location.lat,
            lng: coords.location.lng,
          });
          console.log(`Fetched coordinates for ${manager.city}:`, coords);
          await secondaryDb
            .update(propertyManagerContacts)
            .set({ latLngPoint: latLongPont }) // Use the fetched coords
            .where(eq(propertyManagerContacts.id, manager.id)); // Target the specific manager

          console.log(
            `Updated latLngPoint for manager id ${manager.id} in city ${manager.city}`,
          );
        } else {
          console.warn(
            `Could not get coordinates for city: ${manager.city}. Skipping update for manager id ${manager.id}.`,
          );
        }
      } catch (geoError) {
        console.error(
          `Error fetching coordinates for city ${manager.city} (manager id ${manager.id}):`,
          geoError,
        );
        // Consider more robust error handling, e.g., retry logic or storing error details
      }
    }

    console.log("Finished populating latLngPoint for property managers.");
  } catch (dbError) {
    console.error("Error in populateLatLngPoint function:", dbError);
  }
}
