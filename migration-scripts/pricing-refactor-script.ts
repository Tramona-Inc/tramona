// import { db } from "@/server/db";
// import { properties } from "@/server/db/schema";
// import { getAddress } from "@/server/google-maps";
// import { eq, inArray, isNull } from "drizzle-orm";
// import { groupBy } from "lodash";
// import dotenv from "dotenv";
// dotenv.config();

// function addressToString(
//   address: Awaited<ReturnType<typeof getAddress>> | null,
// ) {
//   if (address === null) {
//     return "null";
//   }
//   return [
//     address.county,
//     address.city,
//     address.stateCode ?? address.stateName,
//     address.postcode,
//     `${address.country} (${address.countryISO})`,
//   ]
//     .filter(Boolean)
//     .join(", ");
// }

// const allProperties = await db.query.properties.findMany({
//   columns: {
//     id: true,
//     latLngPoint: true,
//     city: true,
//   },
//   where: eq(properties.originalListingPlatform, "Airbnb"),
//   limit: 2000,
//   where: isNull(properties.country),
// });

// console.log(`Found ${allProperties.length} properties`);

// const groupedProperties = groupBy(allProperties, (p) => p.city);

// for (const [city, props] of Object.entries(groupedProperties)) {
//   console.log(
//     `\nGetting address for property ${property.id} with current city ${city} and coords ${property.latLngPoint.y}/${property.latLngPoint.x}`,
//   );
//   const unswappedCity = await getCity(
//     property.latLngPoint.y,
//     property.latLngPoint.x,
//   );
//   const swappedCity = await getCity(
//     property.latLngPoint.x,
//     property.latLngPoint.y,
//   );
//   async function swapCoords() {
//     await db
//       .update(properties)
//       .set({
//         latLngPoint: { x: property.latLngPoint.y, y: property.latLngPoint.x },
//       })
//       .where(eq(properties.id, property.id))
//       .returning();
//   }
//   if (unswappedCity === null) {
//     if (swappedCity === null) {
//       console.error("Both were null");
//       continue;
//     }
//     console.warn(`swapping coords, swapped city: ${swappedCity}`);
//     await swapCoords();
//   } else {
//     if (city.includes(unswappedCity)) {
//       console.log(`City likely correct: ${unswappedCity}`);
//       continue;
//     }
//     if (swappedCity === null) {
//       console.error(
//         `Swapped city was null and unswapped city was ${unswappedCity}`,
//       );
//       continue;
//     }
//     if (city.includes(swappedCity)) {
//       console.warn(`swapping coords, swapped city: ${swappedCity}`);
//       await swapCoords();
//     } else {
//       console.error(
//         `Both wrong, unswapped city: ${unswappedCity}, swapped city: ${swappedCity}`,
//       );
//     }
//   }

//   console.log(`Getting address for city ${city}`);

//   const firstProperty = props[0]!;

//   const [unswappedAddress, swappedAddress] = await Promise.all([
//     getAddress({
//       lat: firstProperty.latLngPoint.y,
//       lng: firstProperty.latLngPoint.x,
//     }).catch((e) => {
//       console.error(e);
//       return null;
//     }),
//     getAddress({
//       lat: firstProperty.latLngPoint.x,
//       lng: firstProperty.latLngPoint.y,
//     }).catch((e) => {
//       console.error(e);
//       return null;
//     }),
//   ]);

//   console.log("unswapped:", addressToString(unswappedAddress));
//   console.log("swapped:", addressToString(swappedAddress));

//   if (unswappedAddress === null && swappedAddress === null) {
//     console.error("Both were null");
//     continue;
//   }

//   const swap =
//     unswappedAddress === null ||
//     (!city.includes(unswappedAddress.city) &&
//       swappedAddress !== null &&
//       city.includes(swappedAddress.city));

//   const address = swap ? swappedAddress : unswappedAddress;

//   if (swap) {
//     console.log(`Swapping coords for property ${firstProperty.id}`);
//     await db
//       .update(properties)
//       .set({
//         latLngPoint: {
//           x: firstProperty.latLngPoint.y,
//           y: firstProperty.latLngPoint.x,
//         },
//       })
//       .where(eq(properties.id, firstProperty.id));
//   }

//   if (address === null) {
//     console.error(`Address was null for property ${firstProperty.id}`);
//     continue;
//   }

//   void db
//     .update(properties)
//     .set(address)
//     .where(
//       inArray(
//         properties.id,
//         props.map((p) => p.id),
//       ),
//     )
//     .then(() => console.log(`Updated property ${firstProperty.id}`));
// }
