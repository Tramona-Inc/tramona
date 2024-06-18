import { zodTime } from "@/utils/zod-utils";
import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
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
  "Studio",
  "Aparthotel",
  "Hotel",
  "Yurt",
  "Treehouse",
  "Cottage",
  "Guest suite",
  "Tiny house",
  "Bed & breakfast",
  "Camper/rv",
  "Serviced apartment",
  "Other",
  "Home",
  "Hotels",
  "Alternative",
  "house",
] as const;

export const ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER = [
  "Entire place",
  "Shared room",
  "Private room",
] as const;

export const ALL_PROPERTY_ROOM_TYPES = [
  ...ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER,
  "Other",
] as const;

export const propertyTypeEnum = pgEnum("property_type", ALL_PROPERTY_TYPES);

export const propertyRoomTypeEnum = pgEnum(
  "property_room_type",
  ALL_PROPERTY_ROOM_TYPES,
);

export const ALL_HOUSE_RULE_ITEMS = ["Pets allowed", "Smoking Allowed"];

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

export const propertyStatusEnum = pgEnum("property_status", [
  "Listed",
  "Drafted",
  "Archived",
]);

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  hostId: text("host_id").references(() => users.id, { onDelete: "cascade" }),
  hostTeamId: integer("host_team_id"), //.references(() => hostTeams.id, { onDelete: "cascade" }),

  propertyType: propertyTypeEnum("property_type").notNull(),
  roomType: propertyRoomTypeEnum("room_type").notNull().default("Entire place"),

  // how many guests does this property accomodate at most?
  maxNumGuests: smallint("max_num_guests").notNull(),
  numBeds: smallint("num_beds").notNull(),
  numBedrooms: smallint("num_bedrooms").notNull(),
  numBathrooms: doublePrecision("num_bathrooms"),

  // for when blake/preju manually upload, otherwise get the host's name via hostId
  hostName: varchar("host_name", { length: 255 }),

  address: varchar("address", { length: 1000 }).notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),

  originalListingUrl: varchar("url"),

  checkInInfo: varchar("check_in_info"),
  checkInTime: time("check_in_time"),
  checkOutTime: time("check_out_time"),

  // amenities: propertyAmenitiesEnum("amenities").array().notNull(),
  amenities: varchar("amenities").array(),
  otherAmenities: varchar("other_amenities")
    .array()
    .notNull()
    .default(sql`'{}'`), // .default([]) doesnt work, you gotta do this

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
  cancellationPolicy: text("cancellation_policy"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  isPrivate: boolean("is_private").notNull().default(false),
  priceRestriction: integer("price_restriction"),
  propertyStatus: propertyStatusEnum("property_status").notNull(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export const propertySelectSchema = createSelectSchema(properties);

// https://github.com/drizzle-team/drizzle-orm/issues/1609
export const propertyInsertSchema = createInsertSchema(properties, {
  imageUrls: z.array(z.string().url()),
  originalListingUrl: z.string().url(),
  amenities: z.array(z.string()),
  otherAmenities: z.array(z.string()),
  checkInTime: zodTime,
  checkOutTime: zodTime,
});

// make everything except id optional
export const propertyUpdateSchema = propertyInsertSchema.partial().required({
  id: true,
});

export const bookedDates = pgTable(
  "booked_dates",
  {
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    date: date("date", { mode: "date" }).notNull(),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.date, t.propertyId],
    }),
    propertyidIdx: index().on(t.propertyId),
  }),
);
