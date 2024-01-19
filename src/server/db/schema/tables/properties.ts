import {
  serial,
  doublePrecision,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  varchar,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const propertyTypeEnum = pgEnum("property_type", [
  "house",
  "guesthouse",
  "apartment",
  "room",
  "townhouse",
]);

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
    originalPrice: integer("original_price"), // in cents
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
export const propertyInsertFormSchema = createInsertSchema(properties, {
  imageUrls: z.array(
    z.object({
      value: z.string().url({ message: "Please enter a valid URL." }),
    }),
  ),
  airbnbUrl: z.string().url(),
});
