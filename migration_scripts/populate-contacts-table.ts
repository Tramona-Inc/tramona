// import { db } from "@/server/db";
// import {
//   propertyManagerContacts,
//   type PropertyManagerContactInsert,
// } from "@/server/db/schema";
// import { faker } from "@faker-js/faker";

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
