import { db } from "@/server/db";
import { properties } from "@/server/db/schema";
import { eq, inArray } from "drizzle-orm";

const HOST_TEAM_ID = 1;

const propertiesToConvert = await db.query.properties
  .findMany({
    where: eq(properties.originalListingPlatform, "Evolve"),
    limit: 200,
  })
  .then((res) => res.map((property) => property.id));

const updated = await db
  .update(properties)
  .set({
    hostTeamId: HOST_TEAM_ID,
  })
  .where(inArray(properties.id, propertiesToConvert))
  .returning();

console.log(updated);
console.log(updated.length);
