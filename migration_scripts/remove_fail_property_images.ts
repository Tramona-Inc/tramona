import { db } from "@/server/db";
import { properties } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const propertiesWithFailedLoad: number[] = [];

for (const property of propertiesWithFailedLoad) {
  console.log(property);
  const deletedProperty = await db
    .delete(properties)
    .where(eq(properties.id, property))
    .returning();
  console.log(deletedProperty);
}
