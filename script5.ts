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
// //         Cookie: "wowref=wanon021523f208dbf2699cf92650afd; abr=1; abhs=6557025; meas=imperial; pt=[2]; cookie_consent={%22timestamp%22:1726527185217%2C%22names%22:{%22localStorage%22:{%22analyticslastAction%22:1}%2C%22cookie%22:{%22bftul%22:1}%2C%22sessionStorage%22:{}%2C%22thirdParty%22:{%22Mouseflow%22:1%2C%22trustBadge%22:1%2C%22braze%22:1%2C%22gtm_a_adup%22:1%2C%22gtm_a_bing%22:1%2C%22gtm_a_fb%22:1%2C%22gtm_a_ga%22:1%2C%22gtm_a_gads%22:1%2C%22gtm_a_pin%22:1%2C%22gtm_a_tvsq%22:1%2C%22gtm_m_adup%22:1%2C%22gtm_m_crit%22:1%2C%22gtm_m_gads%22:1%2C%22gtm_m_rtbh%22:1%2C%22gtm_a_tt%22:1%2C%22gtm_a_tiktok%22:1%2C%22adcellTracking%22:1%2C%22tradetrackerTracking%22:1%2C%22awinTracking%22:1%2C%22gtm_m_gads_ec%22:1%2C%22gtm_a_x%22:1%2C%22gtm_a_reddit%22:1}}%2C%22analytical%22:true%2C%22marketing%22:true%2C%22functional%22:true}; _ga=GA1.1.1213070996.1726527186; FPID=FPID2.2.YJW1VEbqaaiLFSJyWU5Lpb9s%2FN9%2BzArsRuUEKwuz6AU%3D.1726527186; c=EUR; abh=8675a14851b0f4e71b0d8b3083d19db9; is_cookie_consent_enabled=true; dprao2=false; FPLC=iKlCYJIhHrue8RXLnmBZjdNPvc7Qq6TQ4Y3QAKgMgU84MxlVFLGvwBSLsOIsJ%2BqlTa5j3ovwXUO7ge4W9fLGiFN9oF0krOpsOi%2FgQJ8MM2YtE1uCc5PPG%2F1UknRM8Q%3D%3D; FPAU=1.2.1000508438.1735848018; search=[{%22location%22:%225460aea295689%22%2C%22pricetype%22:%22totalPrice%22}]; pinboardSearch=%7B%22location%22%3A%225460aea295689%22%2C%22pricetype%22%3A%22totalPrice%22%7D; abal=e1910v0-e4157v1-e4190v1-e4192v1; abv=e1910v0-e2888v1-e2889v0-e3621v1-e3826v1-e4038v1-e4130v1-e4157v1-e4160v0-e4166v1-e4167v1-e4170v0-e4180v1-e4183v0-e4184v0-e4190v1-e4192v1; rvol=bf48a49019e058ec%2C9d58109bf7322055; tdck={%22startDate%22:%222025-02-11%22%2C%22endDate%22:%222025-02-14%22}; _uetsid=300b54d0c94411efabaa9be25bbd5741; _uetvid=441097e0967411efad9291fb41e8e1c3; _ga_7RE8DF4NP0=GS1.1.1735852376.29.1.1735852380.0.0.322119391; _sp_id.9fba=96b01e77-1312-43f5-8743-3dff5320b287.1730261156.113.1735854582.1735848690.b55385d9-a55a-4ac5-8244-3e9349ac8e55; _sp_ses.9fba=1735856381836"
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


import { db } from "@/server/db";
import { properties } from "@/server/db/schema/tables/properties";
import { and, eq, isNull, or } from "drizzle-orm";

// Function to calculate realistic price range based on property characteristics
const calculatePriceRange = (property: {
  numBeds: number;
  maxNumGuests: number;
  numBathrooms: number | null;
  propertyType: string;
  roomType: string;
  amenities: string[];
  city: string;
}) => {
  // Increased base prices for larger properties
  const basePricePerBed = {
    "House": 180,      // Increased base prices
    "Apartment": 150,
    "Condo": 160,
    "Villa": 250,
    "Cabin": 140,
    "Other": 150,
  }[property.propertyType] ?? 150;

  // Location multiplier (adjust based on city/market)
  const locationMultiplier = {
    "Austin": 1.25,    // More balanced multipliers
    "Nashville": 1.2,
    "Miami": 1.35,
    "New York": 1.5,
    "Los Angeles": 1.4,
    "San Francisco": 1.5,
    "Chicago": 1.3,
    "Denver": 1.2,
    "Phoenix": 1.15,
    "Las Vegas": 1.2,
    "Orlando": 1.15,
    "Other": 1.0,
  }[property.city] ?? 1.0;

  // Room type multiplier
  const roomTypeMultiplier = {
    "Entire place": 1.0,
    "Private room": 0.45,
    "Shared room": 0.25,
    "Other": 0.8,
  }[property.roomType] ?? 1.0;

  // Guest capacity factor with progressive scaling for larger groups
  const guestPricing = (() => {
    if (property.maxNumGuests <= 4) {
      // Small groups (1-4): Base pricing
      return property.maxNumGuests * 40;
    } else if (property.maxNumGuests <= 8) {
      // Medium groups (5-8): Base + additional per guest
      return (4 * 40) + ((property.maxNumGuests - 4) * 35);
    } else if (property.maxNumGuests <= 12) {
      // Large groups (9-12): Progressive scaling
      return (4 * 40) + (4 * 35) + ((property.maxNumGuests - 8) * 30);
    } else {
      // Extra large groups (13+): Additional premium
      return (4 * 40) + (4 * 35) + (4 * 30) + ((property.maxNumGuests - 12) * 25);
    }
  })();

  // Minimum base price for large groups
  const largeGroupMinPrice = Math.max(
    property.maxNumGuests * 45, // At least $45 per guest
    property.maxNumGuests <= 8 ? 150 : 300 // Higher minimum for large groups
  );

  // Additional price per bathroom (if available)
  const bathroomMultiplier = property.numBathrooms ? property.numBathrooms * 40 : 0;

  // Calculate base price with all factors
  const basePrice = Math.max(
    (property.numBeds * basePricePerBed) +
    bathroomMultiplier +
    guestPricing,
    largeGroupMinPrice
  ) * locationMultiplier * roomTypeMultiplier;

  // For properties with more than 10 guests, ensure minimum price per guest
  const minPricePerGuest = property.maxNumGuests > 10 ? 40 : 35;
  const absoluteMinPrice = Math.max(
    property.maxNumGuests * minPricePerGuest,
    basePrice * 0.92
  );

  // Tighter price range for more consistent pricing
  const maxPrice = Math.max(
    basePrice * 1.08,
    absoluteMinPrice + 50
  );

  return {
    minPrice: Math.floor(absoluteMinPrice),
    maxPrice: Math.floor(maxPrice)
  };
};

// Helper function to update properties in batches
const updateInBatch = async (propertiesBatch: Array<{
  id: number;
  numBeds: number;
  maxNumGuests: number;
  numBathrooms: number | null;
  propertyType: string;
  roomType: string;
  amenities: string[];
  originalListingPlatform: string | null;
  city: string;
}>) => {
  console.log(`Updating batch of ${propertiesBatch.length} properties...`);

  // Process in larger chunks now that lock contention is resolved
  const chunkSize = 1000;
  for (let i = 0; i < propertiesBatch.length; i += chunkSize) {
    const chunk = propertiesBatch.slice(i, i + chunkSize);

    // Process all properties in parallel within the chunk
    await Promise.all(
      chunk.map(async (property) => {
        const { minPrice, maxPrice } = calculatePriceRange(property);
        const randomPrice = Math.floor(Math.random() * (maxPrice - minPrice + 1) + minPrice) * 100;

        return db.update(properties)
          .set({
            ...(property.originalListingPlatform === "Casamundo"
              ? { tempCasamundoPrice: randomPrice }
              : { tempEvolvePrice: randomPrice }
            ),
          })
          .where(eq(properties.id, property.id));
      })
    );

    console.log(`Processed ${Math.min(i + chunkSize, propertiesBatch.length)} of ${propertiesBatch.length} properties`);
  }
};

// Helper function to fetch properties in batches
const fetchPropertiesInBatch = async (offset: number, limit: number) => {
  console.log(`Fetching Evolve properties with offset ${offset} and limit ${limit}...`);

  const propertiesBatch = await db.query.properties.findMany({
    where: or(
      eq(properties.originalListingPlatform, "Evolve"),
      eq(properties.originalListingPlatform, "Casamundo")
    ),
    limit,
    offset,
    columns: {
      id: true,
      numBeds: true,
      maxNumGuests: true,
      numBathrooms: true,
      propertyType: true,
      roomType: true,
      amenities: true,
      originalListingPlatform: true,
      city: true,
    },
  });

  console.log(`Fetched ${propertiesBatch.length} Evolve properties.`);
  return propertiesBatch;
};

const fetchSpecificProperty = async (propertyId: number) => {
  console.log(`Fetching property ${propertyId}...`);

  const property = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId),
    columns: {
      id: true,
      numBeds: true,
      maxNumGuests: true,
      numBathrooms: true,
      propertyType: true,
      roomType: true,
      amenities: true,
      originalListingPlatform: true,
      city: true,
    },
  });

  if (!property) {
    throw new Error(`Property ${propertyId} not found`);
  }

  console.log("Property details:", JSON.stringify(property, null, 2));
  return property;
};

const calculatePriceWithLogging = (property: {
  numBeds: number;
  maxNumGuests: number;
  numBathrooms: number | null;
  propertyType: string;
  roomType: string;
  amenities: string[];
  city: string;
}) => {
  console.log("\nPrice Calculation Breakdown:");

  // Base price per bed
  const basePricePerBed = {
    "House": 180,
    "Apartment": 150,
    "Condo": 160,
    "Villa": 250,
    "Cabin": 140,
    "Other": 150,
  }[property.propertyType] ?? 150;
  console.log(`Base price per bed: $${basePricePerBed} (Property type: ${property.propertyType})`);
  console.log(`Total base price for ${property.numBeds} beds: $${basePricePerBed * property.numBeds}`);

  // Location multiplier
  const locationMultiplier = {
    "Austin": 1.25,
    "Nashville": 1.2,
    "Miami": 1.35,
    "New York": 1.5,
    "Los Angeles": 1.4,
    "San Francisco": 1.5,
    "Chicago": 1.3,
    "Denver": 1.2,
    "Phoenix": 1.15,
    "Las Vegas": 1.2,
    "Orlando": 1.15,
    "Other": 1.0,
  }[property.city] ?? 1.0;
  console.log(`Location multiplier: ${locationMultiplier}x (City: ${property.city})`);

  // Room type multiplier
  const roomTypeMultiplier = {
    "Entire place": 1.0,
    "Private room": 0.45,
    "Shared room": 0.25,
    "Other": 0.8,
  }[property.roomType] ?? 1.0;
  console.log(`Room type multiplier: ${roomTypeMultiplier}x (Room type: ${property.roomType})`);

  // Guest pricing calculation
  const guestPricing = (() => {
    if (property.maxNumGuests <= 4) {
      console.log("Small group pricing (1-4 guests):");
      return property.maxNumGuests * 40;
    } else if (property.maxNumGuests <= 8) {
      console.log("Medium group pricing (5-8 guests):");
      const price = (4 * 40) + ((property.maxNumGuests - 4) * 35);
      console.log(`First 4 guests: ${4 * 40}`);
      console.log(`Additional ${property.maxNumGuests - 4} guests: ${(property.maxNumGuests - 4) * 35}`);
      return price;
    } else if (property.maxNumGuests <= 12) {
      console.log("Large group pricing (9-12 guests):");
      const price = (4 * 40) + (4 * 35) + ((property.maxNumGuests - 8) * 30);
      console.log(`First 4 guests: ${4 * 40}`);
      console.log(`Next 4 guests: ${4 * 35}`);
      console.log(`Additional ${property.maxNumGuests - 8} guests: ${(property.maxNumGuests - 8) * 30}`);
      return price;
    } else {
      console.log("Extra large group pricing (13+ guests):");
      const price = (4 * 40) + (4 * 35) + (4 * 30) + ((property.maxNumGuests - 12) * 25);
      console.log(`First 4 guests: ${4 * 40}`);
      console.log(`Next 4 guests: ${4 * 35}`);
      console.log(`Next 4 guests: ${4 * 30}`);
      console.log(`Additional ${property.maxNumGuests - 12} guests: ${(property.maxNumGuests - 12) * 25}`);
      return price;
    }
  })();
  console.log(`Total guest pricing: $${guestPricing}`);

  // Large group minimum price
  const largeGroupMinPrice = Math.max(
    property.maxNumGuests * 45,
    property.maxNumGuests <= 8 ? 150 : 300
  );
  console.log(`Large group minimum price: $${largeGroupMinPrice}`);

  // Bathroom multiplier
  const bathroomMultiplier = property.numBathrooms ? property.numBathrooms * 40 : 0;
  console.log(`Bathroom multiplier: $${bathroomMultiplier} (${property.numBathrooms} bathrooms)`);

  // Base price calculation
  const basePrice = Math.max(
    (property.numBeds * basePricePerBed) +
    bathroomMultiplier +
    guestPricing,
    largeGroupMinPrice
  ) * locationMultiplier * roomTypeMultiplier;
  console.log(`\nBase price calculation:`);
  console.log(`(${property.numBeds} beds × $${basePricePerBed}) + $${bathroomMultiplier} + $${guestPricing}`);
  console.log(`= $${basePrice} after location (${locationMultiplier}x) and room type (${roomTypeMultiplier}x) multipliers`);

  // Min price per guest
  const minPricePerGuest = property.maxNumGuests > 10 ? 40 : 35;
  const absoluteMinPrice = Math.max(
    property.maxNumGuests * minPricePerGuest,
    basePrice * 0.92
  );
  console.log(`\nMinimum price calculations:`);
  console.log(`Minimum price per guest: $${minPricePerGuest}`);
  console.log(`Absolute minimum price: $${absoluteMinPrice}`);

  // Final price range
  const maxPrice = Math.max(
    basePrice * 1.08,
    absoluteMinPrice + 50
  );
  console.log(`\nFinal price range: $${Math.floor(absoluteMinPrice)} - $${Math.floor(maxPrice)}`);

  return {
    minPrice: Math.floor(absoluteMinPrice),
    maxPrice: Math.floor(maxPrice)
  };
};

const validateAndUpdatePrices = async () => {
  let offset = 0;
  const batchSize = 1000;
  let totalUpdated = 0;

  while (true) {
    // Fetch properties with their current prices
    const propertiesBatch = await db.query.properties.findMany({
      where: or(
        eq(properties.originalListingPlatform, "Evolve"),
        eq(properties.originalListingPlatform, "Casamundo")
      ),
      limit: batchSize,
      offset,
      columns: {
        id: true,
        numBeds: true,
        maxNumGuests: true,
        numBathrooms: true,
        propertyType: true,
        roomType: true,
        amenities: true,
        originalListingPlatform: true,
        city: true,
        tempCasamundoPrice: true,
        tempEvolvePrice: true,
      },
    });

    if (propertiesBatch.length === 0) break;

    // Filter properties that need price adjustment
    const propertiesToUpdate = propertiesBatch.filter(property => {
      const currentPrice = property.originalListingPlatform === "Casamundo"
        ? property.tempCasamundoPrice
        : property.tempEvolvePrice;

      if (!currentPrice) return false;

      const pricePerNight = currentPrice / 100; // Convert cents to dollars
      const { minPrice } = calculatePriceRange(property);

      // Criteria for identifying incorrect prices:
      // 1. Price is less than 50% of the calculated minimum price
      // 2. For properties with >10 guests, price is less than $40 per guest
      const minExpectedPrice = Math.min(
        minPrice,
        property.maxNumGuests > 10 ? property.maxNumGuests * 40 : 0
      );

      const needsUpdate = pricePerNight < (minExpectedPrice * 0.5);

      if (needsUpdate) {
        console.log(`\nProperty ${property.id} needs update:`);
        console.log(`- Current price: $${pricePerNight}`);
        console.log(`- Min expected: $${minExpectedPrice}`);
        console.log(`- Guests: ${property.maxNumGuests}`);
        console.log(`- City: ${property.city}`);
        console.log(`- Type: ${property.propertyType}`);
      }

      return needsUpdate;
    });

    if (propertiesToUpdate.length > 0) {
      console.log(`\nUpdating ${propertiesToUpdate.length} properties with incorrect prices...`);
      await updateInBatch(propertiesToUpdate);
      totalUpdated += propertiesToUpdate.length;
    }

    offset += batchSize;
    console.log(`Processed ${offset} properties. Updated ${totalUpdated} so far.`);
  }

  console.log(`\nFinished! Updated ${totalUpdated} properties with incorrect prices.`);
};

// Run the validation and update
await validateAndUpdatePrices();
process.exit(0);


