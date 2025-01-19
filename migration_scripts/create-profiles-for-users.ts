// migration_scripts/create-profiles.ts
import { db } from "@/server/db"; // Adjust path to your db instance
import { users, profiles } from "@/server/db/schema"; // Adjust path to your schema
import { eq } from "drizzle-orm";
import "dotenv/config"; // If you are using a .env file

interface User {
  id: string;
}

async function createProfiles() {
  try {
    const allUsers = (await db.select({ id: users.id }).from(users)) as User[];

    const failedProfiles: string[] = [];

    for (const user of allUsers) {
      try {
        console.log(`Creating profile for user: ${user.id}`);

        await db.insert(profiles).values({
          userId: user.id,
        });
        console.log(
          `Successfully created profile for user with id: ${user.id}`,
        );
      } catch (error) {
        console.error(`Failed to create profile for user ${user.id}:`, error);
        failedProfiles.push(user.id);
      }
    }

    if (failedProfiles.length > 0) {
      console.warn(
        "The following users could not have a profile created:",
        failedProfiles,
      );
    } else {
      console.log("All profiles created successfully.");
    }
  } catch (error) {
    console.error("Error fetching users or creating profiles:", error);
  }
}

await createProfiles();
