// // import { fetchPriceNoRateLimit } from "@/server/direct-sites-scraping/casamundo-scraper";
// // import axios from "axios";

// // const handler = async () => {
// //   for (let i = 0; i < 1; i++) {
// //     try {
// //       const headers = {
// //         Host: "www.casamundo.com",
// //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
// //         "Accept": "application/json, text/plain, */*",
// //         "Accept-Encoding": "gzip, deflate, br",
// //         "Accept-Language": "en-US,en;q=0.9",
// //         "Connection": "keep-alive",
// //         "Referer": "https://www.casamundo.com",
// //         Cookie: "wowref=wanon021523f208dbf2699cf92650afd; abr=1; abhs=6557025; meas=imperial; pt=[2]; cookie_consent={%22timestamp%22:1726527185217%2C%22names%22:{%22localStorage%22:{%22analyticslastAction%22:1}%2C%22cookie%22:{%22bftul%22:1}%2C%22sessionStorage%22:{}%2C%22thirdParty%22:{%22Mouseflow%22:1%2C%22trustBadge%22:1%2C%22braze%22:1%2C%22gtm_a_adup%22:1%2C%22gtm_a_bing%22:1%2C%22gtm_a_fb%22:1%2C%22gtm_a_ga%22:1%2C%22gtm_a_gads%22:1%2C%22gtm_a_pin%22:1%2C%22gtm_a_tvsq%22:1%2C%22gtm_m_adup%22:1%2C%22gtm_m_crit%22:1%2C%22gtm_m_gads%22:1%2C%22gtm_m_rtbh%22:1%2C%22gtm_a_tt%22:1%2C%22gtm_a_tiktok%22:1%2C%22adcellTracking%22:1%2C%22tradetrackerTracking%22:1%2C%22awinTracking%22:1%2C%22gtm_m_gads_ec%22:1%2C%22gtm_a_x%22:1%2C%22gtm_a_reddit%22:1}}%2C%22analytical%22:true%2C%22marketing%22:true%2C%22functional%22:true}; _ga=GA1.1.1213070996.1726527186; FPID=FPID2.2.YJW1VEbqaaiLFSJyWU5Lpb9s%2FN9%2BzArsRuUEKwuz6AU%3D.1726527186; c=EUR; abh=8675a14851b0f4e71b0d8b3083d19db9; is_cookie_consent_enabled=true; dprao2=false; FPLC=iKlCYJIhHrue8RXLnmBZjdNPvc7Qq6TQ4Y3QAKgMgU84MxlVFLGvwBSLsOIsJ%2BqlTa5j3ovwXUO7ge4W9fLGiFN9oF0krOpsOi%2FgQJ8MM2YtE1uCc5PPG%2F1UknRM8Q%3D%3D; FPAU=1.2.1000508438.1735848018; search=[{%22location%22:%225460aea295689%22%2C%22pricetype%22:%22totalPrice%22}]; pinboardSearch=%7B%22location%22%3A%225460aea295689%22%2C%22pricetype%22%3A%22totalPrice%22%7D; abal=e1910v0-e4157v1-e4190v1; abv=e1910v0-e2888v1-e2889v0-e3621v1-e3826v1-e4038v1-e4130v1-e4157v1-e4160v0-e4166v1-e4167v1-e4170v0-e4180v1-e4183v0-e4184v0-e4190v1-e4192v1; rvol=bf48a49019e058ec%2C9d58109bf7322055; tdck={%22startDate%22:%222025-02-11%22%2C%22endDate%22:%222025-02-14%22}; _uetsid=300b54d0c94411efabaa9be25bbd5741; _uetvid=441097e0967411efad9291fb41e8e1c3; _ga_7RE8DF4NP0=GS1.1.1735852376.29.1.1735852380.0.0.322119391; _sp_id.9fba=96b01e77-1312-43f5-8743-3dff5320b287.1730261156.113.1735854582.1735848690.b55385d9-a55a-4ac5-8244-3e9349ac8e55; _sp_ses.9fba=1735856381836"
// //       };
// //       const priceInfo = await axios.get(
// //         "https://www.casamundo.com/booking/checkout/priceDetails/bf48a49019e058ec?sT=withDates&adults=2&children=0&pets=0&arrival=2025-02-11&c=USD&duration=3&pricetype=perNight&country=US&isExtrasTouched=0&action=pageOpen&pageType=details&isCachedPaymentMethods=true",
// //         { headers },
// //       );

// //       // const priceInfo = await fetchPriceNoRateLimit({
// //       //   offerId: "bf48a49019e058ec",
// //       //   checkIn: new Date("2025-02-11"),
// //       //   numGuests: 2,
// //       //   duration: 3,
// //       // });
// //       console.log(priceInfo);
// //     } catch (error) {
// //       console.error(error.message);
// //     }
// //   }
// // };

// // await handler();
// // process.exit(0);


// import { db } from "@/server/db";
// import { properties } from "@/server/db/schema/tables/properties";
// import { and, eq, isNull } from "drizzle-orm";

// // Helper function to update properties in batches
// const updateInBatch = async (propertiesBatch) => {
//   console.log(`Updating batch of ${propertiesBatch.length} properties...`);

//   const updatePromises = propertiesBatch.map((property) => {
//     return db.update(properties).set({
//       tempCasamundoPrice: Math.floor(Math.random() * (350 - 150 + 1) + 150) * 100,
//     }).where(eq(properties.id, property.id));
//   });

//   // Run all updates in parallel for this batch
//   await Promise.all(updatePromises);

//   console.log(`Batch update complete.`);
// };

// // Helper function to fetch properties in batches
// const fetchPropertiesInBatch = async (offset, limit) => {
//   console.log(`Fetching properties with offset ${offset} and limit ${limit}...`);

//   const propertiesBatch = await db.query.properties.findMany({
//     where: and(eq(properties.originalListingPlatform, "Casamundo"), isNull(properties.tempCasamundoPrice)),
//     limit,
//     offset,
//   });

//   console.log(`Fetched ${propertiesBatch.length} properties.`);
//   return propertiesBatch;
// };

// const handler = async () => {
//   const batchSize = 100; // Adjust batch size as needed
//   const limit = 1000;    // Limit for each query (this is an example)
//   let offset = 0;
//   let totalProcessed = 0;

//   console.log("Starting batch processing of properties...");

//   while (true) {
//     // Fetch properties in batches
//     const propertiesBatch = await fetchPropertiesInBatch(offset, limit);

//     if (propertiesBatch.length === 0) {
//       console.log("No more properties to process. Exiting...");
//       break; // Exit loop when no more properties are found
//     }

//     // Process the batch of properties
//     await updateInBatch(propertiesBatch);

//     // Track total number of processed properties
//     totalProcessed += propertiesBatch.length;

//     console.log(`Total processed: ${totalProcessed} properties.`);

//     // Increase the offset for the next batch
//     offset += limit;
//   }

//   console.log(`Batch processing complete. Total processed: ${totalProcessed} properties.`);
// };

// await handler();
// process.exit(0);


