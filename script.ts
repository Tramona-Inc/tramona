// import { db } from "@/server/db";
// import {
//   bookedDates,
//   properties,
//   propertyInsertSchema,
// } from "@/server/db/schema";
// import { eq, notExists } from "drizzle-orm";
// import _urls from "scrape-url.json";
// import _allData from "allData.json";
// import { z } from "zod";
// import { formatDate } from "date-fns";

// const urls = _urls as Record<
//   string,
//   { latitude: number; longitude: number; url: string }
// >;

// const schema = propertyInsertSchema.extend({
//   dates: z
//     .string()
//     .refine((x) => new Date(x).toString() !== "Invalid Date")
//     .array()
//     .array()
//     .transform((x) => x.flat(1).map((d) => formatDate(d, "yyyy-MM-dd"))),
// });

// const allData = (_allData as unknown[])
//   .map((p) => {
//     const res = schema.safeParse(p);
//     if (!res.success) return;
//     const moreData = urls[res.data.name];
//     if (!moreData) return;
//     return {
//       ...res.data,
//       latitude: moreData.latitude,
//       longitude: moreData.longitude,
//       originalListingUrl: moreData.url,
//     };
//   })
//   .filter(Boolean);

// async function getId(propertyName: string) {
//   return await db.query.properties
//     .findFirst({
//       where: eq(properties.name, propertyName),
//     })
//     .then((res) => res!.id);
// }

// await Promise.all(
//   allData
//     .filter(({ dates }) => dates.length > 0)
//     .map(async (property) => {
//       const propertyId = await getId(property.name);
//       return db
//         .insert(bookedDates)
//         .values(property.dates.map((date) => ({ date, propertyId })));
//     }),
// );

process.exit();
