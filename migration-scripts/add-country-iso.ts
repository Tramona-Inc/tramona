// import { db } from "@/server/db";
// import { properties } from "@/server/db/schema";
// import { getAddress, getCoordinates } from "@/server/google-maps";
// import { and, eq, isNull } from "drizzle-orm";

// async function getCountryISO(country: string) {
//   console.log(`Getting ISO code for country: ${country}`);
//   return await getCoordinates(country).then(async ({ location }) => {
//     if (!location) throw new Error(`couldn't get coordinates for ${country}`);
//     console.log(
//       `Got coordinates for ${country}: ${location.lat}, ${location.lng}`,
//     );
//     const address = await getAddress(location);
//     if (address.country !== country) {
//       throw new Error(
//         `country mismatch for ${country}, got ${address.country}`,
//       );
//     }
//     console.log(`Got ISO code for ${country}: ${address.countryISO}`);
//     return address.countryISO;
//   });
// }

// console.log("Fetching unique countries from database...");
// const uniqueCountries = await db
//   .selectDistinct({
//     country: properties.country,
//   })
//   .from(properties)
//   .then((res) => res.map((p) => p.country));

// console.log(`Found ${uniqueCountries.length} unique countries`);

// for (const country of uniqueCountries) {
//   console.log(`Processing country: ${country}`);
//   const countryISO = await getCountryISO(country);

//   console.log(
//     `Updating database records for ${country} with ISO: ${countryISO}`,
//   );
//   await db
//     .update(properties)
//     .set({ countryISO })
//     .where(and(eq(properties.country, country), isNull(properties.countryISO)));
//   console.log(`Successfully updated records for ${country}`);
// }

// console.log("Finished processing all countries");
