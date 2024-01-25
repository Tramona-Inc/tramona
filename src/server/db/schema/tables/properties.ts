import {
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";

export const ALL_PROPERTY_TYPES = [
  "house",
  "guesthouse",
  "apartment",
  "room",
  "townhouse",
] as const;

export const propertyTypeEnum = pgEnum("property_type", ALL_PROPERTY_TYPES);

export const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    hostId: text("host_id").references(() => users.id),
    name: varchar("name", { length: 255 }).notNull(),

    // for when blake/preju manually upload, otherwise get the host's name via hostId
    hostName: varchar("host_name", { length: 255 }),

    // how many guests does this property accomodate at most?
    maxNumGuests: smallint("max_num_guests").notNull(),
    numBeds: smallint("num_beds").notNull(),
    numBedrooms: smallint("num_bedrooms").notNull(),
    avgRating: doublePrecision("avg_rating").notNull(),
    numRatings: integer("num_ratings").notNull(),
    airbnbUrl: varchar("airbnb_url").notNull(),
    imageUrls: varchar("image_url").array().notNull(),
    propertyType: propertyTypeEnum("property_type").notNull(),
    originalNightlyPrice: integer("original_nightly_price").notNull(), // in cents
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueAirbnbUrls: unique("unique_airbnb_urls").on(t.airbnbUrl),
  }),
);

export type Property = typeof properties.$inferSelect;
export const propertySelectSchema = createSelectSchema(properties);

export const propertyInsertSchema = createInsertSchema(properties, {
  imageUrls: z.array(z.string().url({ message: "Please enter a valid URL." })),
});
