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

export const ALL_PROPERTY_AMENITIES = [
  "Wifi",
  "TV",
  "Kitchen",
  "Washer",
  "Free parking on premises",
  "Paid parking on premises",
  "Air conditioning",
  "Dedicated workspace",
] as const;

export const propertyAmenitiesEnum = pgEnum(
  "property_amenities",
  ALL_PROPERTY_AMENITIES,
);

export const ALL_PROPERTY_STANDOUT_AMENITIES = [
  "Pool",
  "Hot tub",
  "Patio",
  "BBQ grill",
  "Outdoor dining area",
  "Fire pit",
  "Pool table",
  "Indoor fireplace",
  "Piano",
  "Exercise equipment",
  "Lake access",
  "Beach access",
  "Ski-in/Ski-out",
  "Outdoor shower",
] as const;

export const propertyStandoutAmenitiesEnum = pgEnum(
  "property_standout_amenities",
  ALL_PROPERTY_STANDOUT_AMENITIES,
);

export const ALL_PROPERTY_SAFETY_ITEMS = [
  "Smoke alarm",
  "First aid kit",
  "Fire extinguisher",
  "Carbon monoxide alarm",
] as const;

export const propertySafetyItemsEnum = pgEnum(
  "property_safety_items",
  ALL_PROPERTY_SAFETY_ITEMS,
);

export const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    hostId: text("host_id").references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),

    // for when blake/preju manually upload, otherwise get the host's name via hostId
    hostName: varchar("host_name", { length: 255 }),

    // how many guests does this property accomodate at most?
    address: varchar("address", { length: 1000 }),
    maxNumGuests: smallint("max_num_guests").notNull(),
    numBeds: smallint("num_beds").notNull(),
    numBedrooms: smallint("num_bedrooms").notNull(),
    avgRating: doublePrecision("avg_rating").notNull(),
    numRatings: integer("num_ratings").notNull(),
    airbnbUrl: varchar("airbnb_url"),
    airbnbMessageUrl: varchar("airbnb_message_url"),
    imageUrls: varchar("image_url").array().notNull(),
    originalNightlyPrice: integer("original_nightly_price").notNull(), // in cents
    propertyType: propertyTypeEnum("property_type").notNull(),
    amenities: propertyAmenitiesEnum("property_amenities").array().notNull(),
    standoutAmenities: propertyStandoutAmenitiesEnum(
      "property_standout_amenities",
    )
      .array()
      .notNull(),
    safetyItems: propertySafetyItemsEnum("property_safety_items")
      .array()
      .notNull(),
    about: text("about").notNull(),
    areaDescription: text("area_description"),
    mapScreenshot: text("map_screenshot"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueAirbnbUrls: unique("unique_airbnb_urls").on(t.airbnbUrl),
  }),
);

export type Property = typeof properties.$inferSelect;
export const propertySelectSchema = createSelectSchema(properties);

// https://github.com/drizzle-team/drizzle-orm/issues/1609
export const propertyInsertSchema = createInsertSchema(properties, {
  imageUrls: z.array(z.string().url()),
  amenities: z.array(z.enum(ALL_PROPERTY_AMENITIES)),
  standoutAmenities: z.array(z.enum(ALL_PROPERTY_STANDOUT_AMENITIES)),
  safetyItems: z.array(z.enum(ALL_PROPERTY_SAFETY_ITEMS)),
});

// make everything except id optional
export const propertyUpdateSchema = propertyInsertSchema.partial().required({
  id: true,
});
