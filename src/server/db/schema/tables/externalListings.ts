import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { listingSiteEnum } from "../common";
import { requests } from "./requests";

export const externalListings = pgTable("external_listings", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id")
    .notNull()
    .references(() => requests.id),
  listingSite: listingSiteEnum("listing_site").notNull(),
  originalNightlyPrice: integer("original_nightly_price").notNull(),
  nightlyPrice: integer("nightly_price").notNull(),
  url: varchar("url").notNull(),
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  imageUrl: varchar("image_url").notNull(),
});

export type ExternalListing = Omit<
  typeof externalListings.$inferSelect,
  "requestId" | "id"
>;
