import { db } from "@/server/db";
import { properties } from "@/server/db/schema";
import { validateImage } from "@/utils/utils";
import { eq, and, isNotNull } from "drizzle-orm";

const BATCH_SIZE = 1000;

async function processPropertiesBatch(offset: number) {
  // Fetch a batch of properties in a consistent order, excluding already-deleted ones
  const batch = await db
    .select({
      id: properties.id,
      imageUrls: properties.imageUrls,
    })
    .from(properties)
    .where(
      and(
        eq(properties.originalListingPlatform, "Casamundo"),
        isNotNull(properties.id) // Ensures valid IDs
      )
    )
    .orderBy(properties.id) // Ensures a consistent order
    .offset(offset)
    .limit(BATCH_SIZE);

  if (batch.length === 0) {
    console.log(`No more properties to process at offset ${offset}.`);
    return 0;
  }

  console.log(`Processing batch starting at offset ${offset}, size: ${batch.length}`);

  // Validate images and delete invalid properties
  await Promise.all(
    batch.map(async (property) => {
      if (property.imageUrls.length > 0) {
        const firstImageUrl = property.imageUrls[0]!;
        const isValid = await validateImage(firstImageUrl);

        if (!isValid) {
          console.log(`Invalid image for property ID: ${property.id}, deleting property.`);
          await db.delete(properties).where(eq(properties.id, property.id));
        }
      } else {
        console.log(`No images for property ID: ${property.id}, deleting property.`);
        await db.delete(properties).where(eq(properties.id, property.id));
      }
    })
  );

  return batch.length;
}

async function processAllProperties() {
  let offset = 0;
  let totalProcessed = 0;

  while (true) {
    const processedCount = await processPropertiesBatch(offset);

    if (processedCount === 0) {
      break; // Exit if no more properties to process
    }

    totalProcessed += processedCount;
    offset += BATCH_SIZE;

    console.log(`Batch processed. Total properties processed so far: ${totalProcessed}`);
  }

  console.log(`Processing complete. Total properties checked: ${totalProcessed}`);
}

// Start processing
processAllProperties()
  .then(() => {
    console.log(`Script completed successfully.`);
  })
  .catch((error) => {
    console.error("Error during processing:", error);
  });
