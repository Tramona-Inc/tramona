import { db } from "@/server/db";
import { isNull, eq } from "drizzle-orm";
import { properties, hostTeams } from "../src/server/db/schema";
import { env } from "@/env";

const propertiesWithoutHostTeams = await db
  .select({
    id: properties.id,
    hostTeamId: properties.hostTeamId,
  })
  .from(properties)
  .leftJoin(hostTeams, eq(properties.hostTeamId, hostTeams.id)) // Perform the join
  .where(isNull(hostTeams.id)); // Filter where there is no matching host_team_id

console.log(propertiesWithoutHostTeams);
console.log(env.ADMIN_TEAM_ID);

for (const property of propertiesWithoutHostTeams) {
  const updatedProperty = await db
    .update(properties)
    .set({
      hostTeamId: env.ADMIN_TEAM_ID,
    })
    .where(eq(properties.id, property.id))
    .returning({ id: properties.id });

  console.log(updatedProperty);
}
