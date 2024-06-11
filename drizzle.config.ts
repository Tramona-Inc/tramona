import { defineConfig } from "drizzle-kit";
import { env } from "@/env";

interface DBCredentials {
  url: string;
}

export default defineConfig({
  schema: "./src/server/db/schema/*", //separate the schemas
  dialect: "postgresql",
  verbose: true,
  dbCredentials: {
    url: env.DATABASE_URL,
    wranglerConfigPath: "./wrangler.toml",
    dbName: "db",
  } as DBCredentials,
  out: "./src/server/drizzle",
});
