import { zodTime } from "@/utils/zod-utils";
import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
  geometry,
  index,
  integer,
  jsonb,
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
import { ALL_LISTING_SITE_NAMES, propertyTypeEnum } from "../common";

export const CANCELLATION_POLICIES = [
  "Flexible",
  "Moderate",
  "Firm",
  "Strict",
  "Super Strict 30 Days",
  "Super Strict 60 Days",
  "Long Term",
  "Non-refundable",
] as const;

export type CancellationPolicy = (typeof CANCELLATION_POLICIES)[number];

// cancellation policies that are internal to Tramona (can't be set by host)
const INTERNAL_CANCELLATION_POLICIES = ["Vacasa"] as const;

const ALL_CANCELLATION_POLICIES = [
  ...CANCELLATION_POLICIES,
  ...INTERNAL_CANCELLATION_POLICIES,
] as const;

export type CancellationPolicyWithInternals =
  (typeof ALL_CANCELLATION_POLICIES)[number];

export const cancellationPolicyEnum = pgEnum(
  "cancellation_policy",
  ALL_CANCELLATION_POLICIES,
);

export const ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER = [
  "Entire place",
  "Shared room",
  "Private room",
] as const;

export type PropertyRoomType = (typeof ALL_PROPERTY_ROOM_TYPES)[number];

export const ALL_PROPERTY_ROOM_TYPES = [
  ...ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER,
  "Other",
] as const;

export const propertyRoomTypeEnum = pgEnum(
  "property_room_type",
  ALL_PROPERTY_ROOM_TYPES,
);

export const ALL_HOUSE_RULE_ITEMS = ["Pets allowed", "Smoking Allowed"];

export const propertyAmenitiesEnum = pgEnum(
  "property_amenities",
  ALL_PROPERTY_AMENITIES,
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

export const ALL_CURRENCY = ["USD", "EUR"] as const;

export const currencyEnum = pgEnum("currency", ALL_CURRENCY);

export const propertyStatusEnum = pgEnum("property_status", [
  "Listed",
  "Drafted",
  "Archived",
]);

export const ALL_PROPERTY_PMS = ["Hostaway", "Hospitable", "Ownerrez"] as const;

export const propertyPMSEnum = pgEnum("property_pms", ALL_PROPERTY_PMS);

export const listingPlatformEnum = pgEnum("listing_platform", [
  ...ALL_LISTING_SITE_NAMES,

  ...ALL_PROPERTY_PMS,
]);

export const ALL_BED_TYPES = [
  "Single Bed",
  "Double Bed",
  "Queen Bunk Bed",
  "Twin Bunk Bed",
  "TwinXL Bunk Bed",
  "Crib",
  "Full Day Bed",
  "King Day Bed",
  "Queen Day Bed",
  "Twin Day Bed",
  "TwinXL Day Bed",
  "Full Bed",
  "Full Futon",
  "King Futon",
  "Queen Futon",
  "Twin Futon",
  "TwinXL Futon",
  "King Bed",
  "Full Murphy Bed",
  "King Murphy Bed",
  "Queen Murphy Bed",
  "Twin Murphy Bed",
  "TwinXL Murphy Bed",
  "Queen Bed",
  "Full Rollaway Bed",
  "King Rollaway Bed",
  "Queen Rollaway Bed",
  "Twin Rollaway Bed",
  "TwinXL Rollaway Bed",
  "Full Sofa Bed",
  "King Sofa Bed",
  "Queen Sofa Bed",
  "Twin Sofa Bed",
  "TwinXL Sofa Bed",
  "Full Trundle Bed",
  "King Trundle Bed",
  "Queen Trundle Bed",
  "Twin Trundle Bed",
  "TwinXL Trundle Bed",
  "Twin Bed",
  "Twin XL Bed",
  "Full Water Bed",
  "King Water Bed",
  "Queen Water Bed",
  "Twin Water Bed",
  "TwinXL Water Bed",
  "Full Bunk Bed",
  "King Bunk Bed",
  "Air Mattress",
  "Floor Mattress",
  "Toddler Bed",
  "Hammock",
  "Small Double Bed",
  "California King Bed",
  "Double Sofa Bed",
  "Sofa Bed",
] as const;

export type BedType = (typeof ALL_BED_TYPES)[number];

export const roomsWithBedsSchema = z.array(
  z.object({
    name: z.string().trim().min(1, { message: "Room name cannot be empty" }),
    beds: z.array(
      z.object({
        count: z.number().int().positive(),
        type: z.enum(ALL_BED_TYPES, {
          errorMap: (_, ctx) => ({
            message: `Unsupported bed type '${ctx.data}'`,
          }),
        }),
      }),
    ),
  }),
);

export type RoomWithBeds = z.infer<typeof roomsWithBedsSchema.element>;

export const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    hostId: text("host_id").references(() => users.id, { onDelete: "cascade" }),
    hostTeamId: integer("host_team_id"), // TODO: migrate fully away from hostId
    originalListingPlatform: listingPlatformEnum("original_listing_platform"), // null = only on Tramona
    originalListingId: varchar("original_listing_id"),

    roomsWithBeds: jsonb("rooms_with_beds").$type<RoomWithBeds[]>(),
    propertyType: propertyTypeEnum("property_type").notNull(),
    roomType: propertyRoomTypeEnum("room_type")
      .notNull()
      .default("Entire place"),

    // how many guests does this property accomodate at most?
    maxNumGuests: smallint("max_num_guests").notNull(),
    numBeds: smallint("num_beds").notNull(),
    numBedrooms: smallint("num_bedrooms").notNull(),
    numBathrooms: doublePrecision("num_bathrooms"),
    // propertyPMS: propertyPMSEnum("property_pms"),

    // for when blake/preju manually upload, otherwise get the host's name via hostId
    hostName: varchar("host_name", { length: 255 }),
    hostProfilePic: varchar("host_profile_pic"),
    hostNumReviews: integer("host_num_reviews"),
    hostRating: doublePrecision("host_rating"),

    address: varchar("address", { length: 1000 }).notNull(),
    // latitude: doublePrecision("latitude").notNull(),
    // longitude: doublePrecision("longitude").notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    originalListingUrl: varchar("url"),
    checkInInfo: varchar("check_in_info"),
    checkInTime: time("check_in_time"),
    checkOutTime: time("check_out_time"),

    // amenities: propertyAmenitiesEnum("amenities").array().notNull(),
    amenities: varchar("amenities")
      .array()
      .notNull()
      .default(sql`'{}'`), // .default([]) doesnt work, you gotta do this
    otherAmenities: varchar("other_amenities")
      .array()
      .notNull()
      .default(sql`'{}'`),

    imageUrls: varchar("image_url").array().notNull(),

    name: varchar("name", { length: 255 }).notNull(),
    about: text("about").notNull(),

    petsAllowed: boolean("pets_allowed"),
    smokingAllowed: boolean("smoking_allowed"),

    otherHouseRules: text("other_house_rules"),

    avgRating: doublePrecision("avg_rating").notNull().default(0),
    numRatings: integer("num_ratings").notNull().default(0),
    airbnbUrl: varchar("airbnb_url"),
    originalNightlyPrice: integer("original_nightly_price"), // in cents
    areaDescription: text("area_description"),
    mapScreenshot: text("map_screenshot"),
    cancellationPolicy: cancellationPolicyEnum("cancellation_policy"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    isPrivate: boolean("is_private").notNull().default(false),
    ageRestriction: integer("age_restriction"),
    priceRestriction: integer("price_restriction").default(0),
    stripeVerRequired: boolean("stripe_ver_required").default(false),
    propertyStatus: propertyStatusEnum("property_status").default("Listed"),
    hostImageUrl: varchar("host_image_url"),
    pricingScreenUrl: varchar("pricing_screen_url"),
    currency: currencyEnum("currency").notNull().default("USD"),
    // hostawayListingId: integer("hostaway_listing_id"),
    latLngPoint: geometry("lat_lng_point", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),
    iCalLink: text("ical_link"),
  },
  (t) => ({
    spatialIndex: index("spacial_index").using("gist", t.latLngPoint),
  }),
);

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
  roomsWithBeds: roomsWithBedsSchema,
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
