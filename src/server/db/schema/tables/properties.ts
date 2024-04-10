import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  time,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { ALL_PROPERTY_AMENITIES } from "./propertyAmenities";
import { users } from "./users";

export const ALL_PROPERTY_TYPES = [
  "Condominium",
  "Apartment",
  "Guesthouse",
  "House",
  "Loft",
  "Boat",
  "Camper/RV",
  "Chalet",
  "Bed & Breakfast",
  "Villa",
  "Tent",
  "Cabin",
  "Townhouse",
  "Bungalow",
  "Hut",
  "Other",
  "Home",
  "Hotels",
  "Alternative",
  "",
] as const;

export const ALL_PROPERTY_ROOM_TYPES = [
  "Entire place",
  "Shared room",
  "Private room",
] as const;

export const propertyTypeEnum = pgEnum("property_type", ALL_PROPERTY_TYPES);

export const propertyRoomTypeEnum = pgEnum(
  "property_room_type",
  ALL_PROPERTY_ROOM_TYPES,
);

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

// TODO: add a new column to properties
export const ALL_PROPERTY_AMENITIES_ONBOARDING = [
  "Stove",
  "Refrigerator",
  "Microwave",
  "Oven",
  "Freezer",
  "Dishwashwer",
  "Dishes & silverware",
  "Dining table & chairs",
  "Coffee maker",
  "TV",
  "Couch",
  "Heating",
  "Air conditioning",
  "Washer",
  "Dryzer",
  "Workspace",
  "Wifi",
  "Street parking",
  "Garage parking",
  "EV charging",
  "Driveway parking",
] as const;

export const propertySafetyItemsEnum = pgEnum(
  "property_safety_items",
  ALL_PROPERTY_SAFETY_ITEMS,
);

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  hostId: text("host_id").references(() => users.id, { onDelete: "cascade" }),

  propertyType: propertyTypeEnum("property_type").notNull(),
  roomType: propertyRoomTypeEnum("room_type").notNull().default("Entire place"),

  // how many guests does this property accomodate at most?
  maxNumGuests: smallint("max_num_guests").notNull(),
  numBeds: smallint("num_beds").notNull(),
  numBedrooms: smallint("num_bedrooms").notNull(),
  numBathrooms: smallint("num_bathrooms").notNull(),

  // for when blake/preju manually upload, otherwise get the host's name via hostId
  hostName: varchar("host_name", { length: 255 }),
  address: varchar("address", { length: 1000 }),

  checkInInfo: varchar("check_in_info"),
  checkInTime: time("check_in_time"),
  checkOutTime: time("check_out_time"),

  // amenities: propertyAmenitiesEnum("amenities").array().notNull(),
  amenities: varchar("amenities").array(),

  otherAmenities: varchar("other_amenities").array(),

  imageUrls: varchar("image_url").array().notNull(),

  name: varchar("name", { length: 255 }).notNull(),
  about: text("about").notNull(),

  petsAllowed: boolean("pets_allowed"),
  smokingAllowed: boolean("smoking_allowed"),

  otherHouseRules: varchar("other_house_rules", { length: 1000 }),

  avgRating: doublePrecision("avg_rating").notNull().default(0),
  numRatings: integer("num_ratings").notNull().default(0),
  airbnbUrl: varchar("airbnb_url"),
  airbnbMessageUrl: varchar("airbnb_message_url"),
  originalNightlyPrice: integer("original_nightly_price"), // in cents
  areaDescription: text("area_description"),
  mapScreenshot: text("map_screenshot"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export const propertySelectSchema = createSelectSchema(properties);

// https://github.com/drizzle-team/drizzle-orm/issues/1609
export const propertyInsertSchema = createInsertSchema(properties, {
  imageUrls: z.array(z.string().url()),
  amenities: z.array(z.enum(ALL_PROPERTY_AMENITIES)),
  otherAmenities: z.array(z.string()),
});

// make everything except id optional
export const propertyUpdateSchema = propertyInsertSchema.partial().required({
  id: true,
});
