import { type Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: 'pg',
  verbose: true,
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  out: "./src/server/drizzle",
  // tablesFilter: ["t3-drzl_*"],
} satisfies Config;
