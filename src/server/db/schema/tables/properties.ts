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
const INTERNAL_CANCELLATION_POLICIES = [
  "Vacasa",
  "CB Island Vacations",
  "Evolve",
  "Casamundo",
  "Integrity Arizona",
  "RedAwning 7 Days",
  "RedAwning 14 Days",
] as const;

const ALL_CANCELLATION_POLICIES = [
  ...CANCELLATION_POLICIES,
  ...INTERNAL_CANCELLATION_POLICIES,
] as const;

export type CancellationPolicyWithInternals =
  (typeof ALL_CANCELLATION_POLICIES)[number];

// export const cancellationPolicyEnum = pgEnum(
//   "cancellation_policy",
//   ALL_CANCELLATION_POLICIES,
// );

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

export const ALL_CHECKIN_TYPES = [
  "Smart lock",
  "Keypad",
  "Lockbox",
  "Building staff",
] as const;

export const ALL_CHECKOUT_TYPES = [
  "Gather used towels",
  "Throw trash away",
  "Turn things off",
  "Lock up",
  "Return keys",
] as const;

export const ALL_HOUSE_RULES = [
  "No smoking",
  "No pets",
  "No parties or events",
  "Quiet hours",
] as const;

export const ALL_INTERACTION_PREFERENCES = [
  "not available",
  "say hello",
  "socialize",
  "no preference",
] as const;

export type DailyDiscounts = {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
};

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

export const checkInEnum = pgEnum("check_in_type", ALL_CHECKIN_TYPES);

export const checkOutEnum = pgEnum("check_out_info", ALL_CHECKOUT_TYPES);

export const houseRulesEnum = pgEnum("house_rules", ALL_HOUSE_RULES);

export const interactionPreferencesEnum = pgEnum(
  "interaction_preference",
  ALL_INTERACTION_PREFERENCES,
);

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
        // type: z.enum(ALL_BED_TYPES, {
        //   errorMap: (_, ctx) => ({
        //     message: `Unsupported bed type '${ctx.data}'`,
        //   }),
        // }),
        type: z.string(),
      }),
    ),
  }),
);

export type RoomWithBeds = z.infer<typeof roomsWithBedsSchema.element>;

export const discountTierSchema = z.object({
  days: z.number().int().nonnegative(),
  percentOff: z.number().int().min(0).max(100),
});

export type DiscountTier = z.infer<typeof discountTierSchema>;

export const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    hostTeamId: integer("host_team_id").notNull(),
    originalListingPlatform: listingPlatformEnum("original_listing_platform"), // null = only on Tramona
    originalListingId: varchar("original_listing_id"),

    roomsWithBeds: jsonb("rooms_with_beds").$type<RoomWithBeds[]>(),
    propertyType: propertyTypeEnum("property_type").notNull(),
    roomType: propertyRoomTypeEnum("room_type")
      .notNull()
      .default("Entire place"),

    /** how many guests does this property accomodate at most? */
    maxNumGuests: smallint("max_num_guests").notNull(),
    numBeds: smallint("num_beds").notNull(),
    numBedrooms: smallint("num_bedrooms").notNull(),
    numBathrooms: doublePrecision("num_bathrooms"),
    // propertyPMS: propertyPMSEnum("property_pms"),

    /** for when blake/preju manually upload, otherwise get the host's name via hostId */
    hostName: varchar("host_name", { length: 255 }),
    hostProfilePic: varchar("host_profile_pic"),
    hostNumReviews: integer("host_num_reviews"),
    hostRating: doublePrecision("host_rating"),

    address: varchar("address", { length: 1000 }).notNull(),
    county: varchar("county", { length: 255 }),
    stateName: varchar("state_name", { length: 255 }),
    stateCode: varchar("state_code", { length: 8 }),
    city: varchar("city", { length: 255 }).notNull(),
    country: varchar("country", { length: 255 }).notNull(),
    countryISO: varchar("country_iso", { length: 3 }).notNull(),

    originalListingUrl: varchar("original_listing_url"),
    // checkInInfo: varchar("check_in_info"),
    checkInType: checkInEnum("check_in_type"),
    additionalCheckInInfo: varchar("additional_check_in_info"),
    checkOutInfo: checkOutEnum("check_out_info").array(),
    additionalCheckOutInfo: varchar("additional_check_out_info"),
    houseRules: houseRulesEnum("house_rules").array(),
    additionalHouseRules: varchar("additional_house_rules"),
    interactionPreference: interactionPreferencesEnum("interaction_preference"),
    directions: varchar("directions"),
    wifiName: varchar("wifi_name"),
    wifiPassword: varchar("wifi_password"),
    houseManual: varchar("house_manual"),
    checkInTime: time("check_in_time").notNull().default("15:00:00"),
    checkOutTime: time("check_out_time").notNull().default("10:00:00"),
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
    currentSecurityDeposit: integer("current_security_deposit")
      .notNull()
      .default(0), //cant be null
    areaDescription: text("area_description"),
    cancellationPolicy: text("cancellation_policy"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    isPrivate: boolean("is_private").notNull().default(false),
    ageRestriction: integer("age_restriction"),
    stripeVerRequired: boolean("stripe_ver_required").default(false),
    status: propertyStatusEnum("property_status").default("Listed"),
    pricingScreenUrl: varchar("pricing_screen_url"),
    currency: currencyEnum("currency").notNull().default("USD"),
    hospitableListingId: varchar("hospitable_listing_id"),
    hospitableChannel: varchar("hostpitable_channel"),
    datesLastUpdated: timestamp("dates_last_updated", {
      withTimezone: true,
    }).defaultNow(),
    latLngPoint: geometry("lat_lng_point", {
      type: "point",
      mode: "xy",
      srid: 4326,
    })
      .notNull()
      .$type<{ x: number; y: number }>(),
    iCalLink: text("ical_link"),
    iCalLinkLastUpdated: timestamp("ical_link_last_updated", {
      withTimezone: true,
    }),
    tempCasamundoPrice: integer("temp_casamundo_price"),
    tempEvolvePrice: integer("temp_evolve_price"),
    bookOnAirbnb: boolean("book_on_airbnb").notNull().default(false),
    autoOfferEnabled: boolean("auto_offer_enabled").notNull().default(false),
    discountTiers: jsonb("discount_tiers").$type<DiscountTier[]>(),
    bookItNowEnabled: boolean("book_it_now_enabled").notNull().default(false),
    bookItNowHostDiscountPercentOffInput: integer(
      "book_it_now_host_discount_percent_off_input",
    )
      .default(0)
      .notNull(), //the host inputs this in in the /calender settings page. Percent off of airbnb price
    cleaningFeePerStay: integer("cleaning_fee_per_stay").default(0).notNull(),
    petFeePerStay: integer("pet_fee_per_stay").default(0).notNull(),
    extraGuestFeePerNight: integer("extra_guest_fee_per_night")
      .default(0)
      .notNull(),
    maxGuestsWithoutFee: integer("max_guests_without_fee"),
    randomPercentageForScrapedProperties: integer(
      "random_percentage_for_scraped_properties",
    ),
  },
  (t) => ({
    spatialIndex: index("spacial_index").using("gist", t.latLngPoint),
    hostTeamIdIdx: index("properties_host_team_id_idx").on(t.hostTeamId),
    propertyTypeRoomTypeGuestsIdx: index("properties_type_room_guests_idx").on(
      t.propertyType,
      t.roomType,
      t.maxNumGuests,
    ),
    cityIdx: index("properties_city_idx").on(t.city),
    cityTypeRoomGuestsIdx: index("properties_city_type_room_guests_idx").on(
      t.city,
      t.propertyType,
      t.roomType,
      t.maxNumGuests,
    ),
    amenitiesGinIdx: index("properties_amenities_gin_idx")
      .on(
        // Corrected syntax here
        t.amenities,
      )
      .with({ using: "gin" }),
    bookItNowAutoOfferIdx: index("properties_book_it_now_auto_offer_idx").on(
      t.bookItNowEnabled,
      t.autoOfferEnabled,
    ),
    statusIdx: index("properties_status_idx").on(t.status),
    originalNightlyPriceIdx: index("properties_nightly_price_idx").on(
      t.originalNightlyPrice,
    ),
    avgRatingNumRatingsIdx: index("properties_avg_rating_num_ratings_idx").on(
      t.avgRating,
      t.numRatings,
    ),
    datesLastUpdatedIdx: index("properties_dates_last_updated_idx").on(
      t.datesLastUpdated,
    ),
    listedStatusIdx: index("properties_listed_status_idx")
      .on(t.status)
      .where(sql`${t.status} = 'Listed'`), // Partial index for listed properties
  }),
);

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export const propertySelectSchema = createSelectSchema(properties);

// https://github.com/drizzle-team/drizzle-orm/issues/1609
export const propertyInsertSchema = createInsertSchema(properties, {
  checkOutInfo: z.array(z.enum(ALL_CHECKOUT_TYPES)),
  houseRules: z.array(z.enum(ALL_HOUSE_RULES)),
  imageUrls: z.array(z.string().url()),
  originalListingUrl: z.string().url(),
  amenities: z.array(z.string()),
  otherAmenities: z.array(z.string()),
  additionalCheckInInfo: z.string(),
  checkInTime: zodTime,
  checkOutTime: zodTime,
  roomsWithBeds: roomsWithBedsSchema,
  discountTiers: z.array(discountTierSchema).nullable(),
  latLngPoint: z.object({ x: z.number(), y: z.number() }),
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
    dateIdx: index("booked_dates_date_idx").on(t.date),
    propertyIdDateIdx: index("booked_dates_property_date_idx").on(
      t.propertyId,
      t.date,
    ),
  }),
);

export const propertyDiscounts = pgTable(
  "property_discounts",
  {
    propertyId: integer("property_id").primaryKey().references(() => properties.id, { onDelete: "cascade" }),
    mondayDiscount: integer("monday_discount").default(0).notNull(),
    tuesdayDiscount: integer("tuesday_discount").default(0).notNull(),
    wednesdayDiscount: integer("wednesday_discount").default(0).notNull(),
    thursdayDiscount: integer("thursday_discount").default(0).notNull(),
    fridayDiscount: integer("friday_discount").default(0).notNull(),
    saturdayDiscount: integer("saturday_discount").default(0).notNull(),
    sundayDiscount: integer("sunday_discount").default(0).notNull(),
  },
);

export type PropertyDiscounts = typeof propertyDiscounts.$inferSelect;
export const propertyDiscountsInsertSchema = createInsertSchema(propertyDiscounts);
export const propertyDiscountsUpdateSchema = propertyDiscountsInsertSchema.partial().required({
  propertyId: true,
});
// - added neals stuff to db
// - did sasha already update drizzle schema and usages of latitude and longitude?
// - I did and got Offset is outside the bounds of the DataView for the map
