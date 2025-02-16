import { db } from "@/server/db";
import { propertyDiscounts } from "@/server/db/schema";

const properties = await db.query.properties.findMany();
const allDiscountValues = properties.map((property) => ({
  propertyId: property.id,
  weekdayDiscount: 0,
  weekendDiscount: 0,
  mondayDiscount: 0,
  tuesdayDiscount: 0,
  wednesdayDiscount: 0,
  thursdayDiscount: 0,
  fridayDiscount: 0,
  saturdayDiscount: 0,
  sundayDiscount: 0,
  isDailyDiscountsCustomized: false,
}));

const batchSize = 1000;
const numBatches = Math.ceil(allDiscountValues.length / batchSize);

for (let i = 0; i < numBatches; i++) {
  const start = i * batchSize;
  const end = Math.min((i + 1) * batchSize, allDiscountValues.length);
  const batchValues = allDiscountValues.slice(start, end);

  await db.insert(propertyDiscounts).values(batchValues);
  console.log(`Batch ${i + 1}/${numBatches} inserted`); // Optional progress logging
}

console.log("All property discounts inserted in batches");