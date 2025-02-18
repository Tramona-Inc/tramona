// import { secondaryDb } from "@/server/db";
// // import {
// //   propertyManagerContacts,
// //   type PropertyManagerContactInsert,
// // } from "@/server/secondaryDb/schema";
// import { faker } from "@faker-js/faker";

// import { createLatLngGISPoint } from "@/server/server-utils";
// import { and, eq, exists, isNotNull, isNull } from "drizzle-orm";
// import {
//   propertyManagerContactsTest,
//   PropertyManagerContactTest,
// } from "@/server/db/secondary-schema";

// import { getCoordinates } from "@/server/google-maps";

// // // Initialize Bun SQLite database

// async function populatePropertyManagerContacts(numberOfRows: number) {
//   const inserts: PropertyManagerContactTest[] = []; // 1. Declare inserts array with the type
//   for (let i = 0; i < numberOfRows; i++) {
//     const email: string[] = ["sashagordin22@gmail.com"]; // Explicitly typed as string
//     const city: string = "Seattle, WA"; // Explicitly typed as string
//     const url: string = faker.internet.url(); // Explicitly typed as string
//     const propertyManagerName: string = faker.company.name(); //
//     const coords = await getCoordinates(city);
//     let latLngPoint: { x: number; y: number } | null = null;
//     console.log("coords", coords);
//     if (coords.location) {
//       latLngPoint = createLatLngGISPoint({
//         lat: coords.location.lat,
//         lng: coords.location.lng,
//       });
//     }

//       inserts.push({
//         email: email, // Type assertion as string
//         city: "Seattle, WA", // Type assertion as string
//         url: url, // Type assertion as string
//         name: propertyManagerName, // Type assertion as string
//         latLngPoint: latLngPoint,
//       });
//     }
//     console.log(inserts);

//     try {
//       await secondaryDb.insert(propertyManagerContactsTest).values(inserts); // 3. Use inserts array in the insert query
//       console.log(
//         `Successfully inserted ${numberOfRows} rows into propertyManagerContactsTests table.`,
//       );
//     } catch (error) {
//       console.error("Error inserting data:", error);
//     }
//   }

// async function main() {
//   const numberOfRowsToInsert = 1; // You can change this number
//   await populatePropertyManagerContacts(numberOfRowsToInsert);
// }

// await main();

// process.exit(0);

//function to populate the table with gis points
// export const populateGIS = async ( id : number) => {
//   const latLngPoint = createLatLngGISPoint({
//     lat: 33.985664,
//     lng: -117.885414,
//   });

//   await secondaryDb
//     .update(propertyManagerContactsTest)
//     .set({
//       latLngPoint: latLngPoint,
//     })
//     .where(
//       eq(propertyManagerContactsTest.id, id),
//       //isNull(propertyManagerContacts.latLngPoint)
//     )
//     .then((res) => res.map((property) => console.log("updated:", property)));
// };

// console.log("hit");

// const desiredId = pickk one
// await populateGIS( desiredID);

// export async function populateLatLngPoint() {
//   try {
//     const managersWOLatLng =
//       await secondarysecondaryDb.query.propertyManagerContactsTest.findMany({
//         where: and(
//           isNull(propertyManagerContactsTest.latLngPoint),
//           isNotNull(propertyManagerContactsTest.city),
//         ),
//         columns: {
//           // Select only necessary columns for efficiency
//           id: true,
//           city: true,
//         },
//       });

//     console.log(
//       `Found ${managersWOLatLng.length} managers without LatLng to update.`,
//     );

//     for (const manager of managersWOLatLng) {
//       if (!manager.city) {
//         console.warn(
//           `Skipping manager with id ${manager.id} due to missing city.`,
//         ); // Warn if city is unexpectedly missing
//         continue; // Skip to the next manager
//       }

//       try {
//         const coords = await getCoordinates(manager.city);
//         if (coords.location) {
//           const latLongPont = createLatLngGISPoint({
//             lat: coords.location.lat,
//             lng: coords.location.lng,
//           });
//           console.log(`Fetched coordinates for ${manager.city}:`, coords);
//           await secondarysecondaryDb
//             .update(propertyManagerContactsTest)
//             .set({ latLngPoint: latLongPont }) // Use the fetched coords
//             .where(eq(propertyManagerContactsTest.id, manager.id)); // Target the specific manager

//           console.log(
//             `Updated latLngPoint for manager id ${manager.id} in city ${manager.city}`,
//           );
//         } else {
//           console.warn(
//             `Could not get coordinates for city: ${manager.city}. Skipping update for manager id ${manager.id}.`,
//           );
//         }
//       } catch (geoError) {
//         console.error(
//           `Error fetching coordinates for city ${manager.city} (manager id ${manager.id}):`,
//           geoError,
//         );
//         // Consider more robust error handling, e.g., retry logic or storing error details
//       }
//     }

//     console.log("Finished populating latLngPoint for property managers.");
//   } catch (secondaryDbError) {
//     console.error("Error in populateLatLngPoint function:", secondaryDbError);
//   }
// }
