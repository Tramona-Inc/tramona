import { properties } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";

const populateRandomPercentage = async () => {
  const updatedProperties = await db
    .update(properties)
    .set({
      randomPercentageForScrapedProperties:
        Math.floor(Math.random() * (10 - 5 + 1)) + 5,
    })
    .where(eq(properties.originalListingPlatform, "Casamundo"));
  console.log(updatedProperties);
};

await populateRandomPercentage();
