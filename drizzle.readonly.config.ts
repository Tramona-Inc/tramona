import { defineConfig } from "drizzle-kit";
import { env } from "@/env";

interface DBCredentials {
  url: string;
}
console.log(" hi");

export default defineConfig({
  schema: "./src/server/db/secondary-schema/*", //separate the schemas
  dialect: "postgresql",
  verbose: true,
  dbCredentials: {
    url: env.SECONDARY_DATABASE_URL,
    wranglerConfigPath: "./wrangler.toml",
    dbName: "db",
  } as DBCredentials,
  out: "./src/server/drizzle",
});
