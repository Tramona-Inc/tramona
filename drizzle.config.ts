import { type Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./src/server/db/schema/*", //separate the schemas
  dialect: "postgresql",
  verbose: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "./src/server/drizzle",
  // tablesFilter: ["t3-drzl_*"],
} satisfies Config;
