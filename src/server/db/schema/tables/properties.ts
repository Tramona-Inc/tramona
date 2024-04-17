import {
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
import { users } from "./users";
import { ALL_PROPERTY_AMENITIES } from "./propertyAmenities";
import { hostTeams } from "./hostTeams";

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

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  hostId: text("host_id").references(() => users.id, { onDelete: "cascade" }),
  hostTeamId: text("host_team_id").references(() => hostTeams.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 255 }).notNull(),

  // for when blake/preju manually upload, otherwise get the host's name via hostId
  hostName: varchar("host_name", { length: 255 }),
  address: varchar("address", { length: 1000 }),

  // how many guests does this property accomodate at most?
  maxNumGuests: smallint("max_num_guests").notNull(),
  numBeds: smallint("num_beds").notNull(),
  numBedrooms: smallint("num_bedrooms").notNull(),
  numBathrooms: smallint("num_bathrooms"),
  avgRating: doublePrecision("avg_rating").notNull().default(0),
  numRatings: integer("num_ratings").notNull().default(0),
  airbnbUrl: varchar("airbnb_url"),
  airbnbMessageUrl: varchar("airbnb_message_url"),
  imageUrls: varchar("image_url").array().notNull(),
  originalNightlyPrice: integer("original_nightly_price").notNull(), // in cents
  propertyType: propertyTypeEnum("property_type").notNull(),
  roomType: propertyRoomTypeEnum("room_type").notNull().default("Entire place"),
  amenities: propertyAmenitiesEnum("amenities").array().notNull(),
  checkInInfo: varchar("check_in_info"),
  checkInTime: time("check_in_time"),
  checkOutTime: time("check_out_time"),
  about: text("about").notNull(),
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
});

// make everything except id optional
export const propertyUpdateSchema = propertyInsertSchema.partial().required({
  id: true,
});
