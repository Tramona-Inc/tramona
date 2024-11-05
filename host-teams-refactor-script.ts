// import { env } from "@/env";
// import { db } from "@/server/db";
// import { hostTeams, properties, users } from "@/server/db/schema";
// import { createInitialHostTeam } from "@/server/server-utils";
// import { and, eq, isNotNull, isNull } from "drizzle-orm";

// const adminTeamId = env.ADMIN_TEAM_ID;

// // Update all properties with null hostId to use admin team
// console.log("Updating properties with null hostId to use admin team...");
// await db
//   .update(properties)
//   .set({ hostTeamId: adminTeamId })
//   .where(isNull(properties.hostId));

// console.log("Fetching all properties with non-null hostId...");
// const propertiesWithHost = await db.query.properties.findMany({
//   with: { hostTeam: true },
//   where: and(isNull(properties.hostTeamId), isNotNull(properties.hostId)),
// });
// console.log(`Found ${propertiesWithHost.length} properties with hosts`);

// for (const property of propertiesWithHost) {
//   console.log(`Processing property ${property.id}...`);
//   console.log(`Finding host ${property.hostId} for property ${property.id}...`);
//   const host = await db.query.users.findFirst({
//     where: eq(users.id, property.hostId!),
//   });

//   if (!host)
//     throw Error(
//       `Host ${property.hostId} not found for property ${property.id}`,
//     );

//   console.log(`Finding teams owned by host ${host.id}...`);
//   const ownedTeams = await db.query.hostTeams.findMany({
//     where: and(eq(hostTeams.ownerId, host.id)),
//   });

//   const teamId = ownedTeams[0]?.id ?? (await createInitialHostTeam(host));
//   console.log(`Using team ${teamId} for property ${property.id}`);

//   await db
//     .update(properties)
//     .set({ hostTeamId: teamId })
//     .where(eq(properties.id, property.id));

//   console.log(`Finished processing property ${property.id}`);
// }
// console.log("Script completed successfully");
