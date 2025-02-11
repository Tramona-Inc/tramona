import {
  date,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { properties } from "./properties";

export const fillerRequests = pgTable(
  "filler_requests",
  {
    id: serial("id").primaryKey(),
    maxTotalPrice: integer("max_total_price").notNull(), // in cents
    location: varchar("location", { length: 255 }).notNull(),
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    userName: varchar("user_name", { length: 255 }).notNull(),
    userProfilePicUrl: varchar("user_profile_pic_url", { length: 512 }),
    // The creation time of the filler request entry can be specified by the admin so that it can be insert to anytime
    entryCreationTime: timestamp("entry_creation_time", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      // Index for faster lookups based on location and date range
      locationCheckInCheckOutIndex: index(
        "filler_requests_location_checkin_checkout_idx",
      ).on(table.location, table.checkIn, table.checkOut),
      // Index for faster lookups based on userName
      userNameIndex: index("filler_requests_user_name_idx").on(table.userName),
      // Index for faster lookups based on entryCreationTime
      entryCreationTimeIndex: index(
        "filler_requests_entry_creation_time_idx",
      ).on(table.entryCreationTime),
    };
  },
);

export type FillerRequest = typeof fillerRequests.$inferSelect;
export type NewFillerRequest = typeof fillerRequests.$inferInsert;
export const fillerRequestSelectSchema = createSelectSchema(fillerRequests);
export const fillerRequestInsertSchema = createInsertSchema(fillerRequests);
// make everything except id optional
export const fillerRequestUpdateSchema = fillerRequestInsertSchema
  .partial()
  .required({
    id: true,
  });

export const fillerOffers = pgTable(
  "filler_offers",
  {
    id: serial("id").primaryKey(),
    maxTotalPrice: integer("max_total_price").notNull(), // in cents
    originalNightlyPrice: integer("original_nightly_price").notNull(), // in cents
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    userName: varchar("user_name", { length: 255 }).notNull(),
    userProfilePicUrl: varchar("user_profile_pic_url", { length: 512 }),
    // The creation time of the offer entry can be specified by the admin
    entryCreationTime: timestamp("entry_creation_time", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      // Index for faster lookups based on propertyId
      propertyIdIndex: index("filler_offers_property_id_idx").on(
        table.propertyId,
      ),
      // Index for faster lookups based on date range
      checkInCheckOutIndex: index("filler_offers_checkin_checkout_idx").on(
        table.checkIn,
        table.checkOut,
      ),
      // Index for faster lookups based on userName
      userNameIndex: index("filler_offers_user_name_idx").on(table.userName),
      // Index for faster lookups based on entryCreationTime
      entryCreationTimeIndex: index("filler_offers_entry_creation_time_idx").on(
        table.entryCreationTime,
      ),
    };
  },
);
export type FillerOffer = typeof fillerOffers.$inferSelect;
export type NewFillerOffer = typeof fillerOffers.$inferInsert;
export const fillerOfferSelectSchema = createSelectSchema(fillerOffers);
export const fillerOfferInsertSchema = createInsertSchema(fillerOffers);
// make everything except id optional
export const fillerOfferUpdateSchema = fillerOfferInsertSchema
  .partial()
  .required({
    id: true,
  });

export const fillerBookings = pgTable(
  "filler_bookings",
  {
    id: serial("id").primaryKey(),
    maxTotalPrice: integer("max_total_price").notNull(), // in cents
    originalNightlyPrice: integer("original_nightly_price").notNull(), // in cents
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    userName: varchar("user_name", { length: 255 }).notNull(),
    userProfilePicUrl: varchar("user_profile_pic_url", { length: 512 }),
    // The creation time of the Booking entry can be specified by the admin
    entryCreationTime: timestamp("entry_creation_time", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      // Index for faster lookups based on propertyId
      propertyIdIndex: index("filler_bookings_property_id_idx").on(
        table.propertyId,
      ),
      // Index for faster lookups based on date range
      checkInCheckOutIndex: index("filler_bookings_checkin_checkout_idx").on(
        table.checkIn,
        table.checkOut,
      ),
      // Index for faster lookups based on userName
      userNameIndex: index("filler_bookings_user_name_idx").on(table.userName),
      // Index for faster lookups based on entryCreationTime
      entryCreationTimeIndex: index(
        "filler_bookings_entry_creation_time_idx",
      ).on(table.entryCreationTime),
    };
  },
);
export type FillerBooking = typeof fillerBookings.$inferSelect;
export type NewFillerBooking = typeof fillerBookings.$inferInsert;
export const fillerBookingselectSchema = createSelectSchema(fillerBookings);
export const fillerBookingInsertSchema = createInsertSchema(fillerBookings);
// make everything except id optional
export const fillerBookingUpdateSchema = fillerBookingInsertSchema
  .partial()
  .required({
    id: true,
  });
