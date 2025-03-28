import {
  date,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { properties } from "./properties";
import { requests } from "./requests";
import { statusEnum } from "./requestsToBook";

export const offers = pgTable(
  "offers",
  {
    id: serial("id").primaryKey(),
    requestId: integer("request_id").references(() => requests.id, {
      onDelete: "set null",
    }),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    madePublicAt: timestamp("made_public_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    checkIn: timestamp("check_in", { withTimezone: true }).notNull(),
    checkOut: timestamp("check_out", { withTimezone: true }).notNull(),
    hostPayout: integer("host_payout").notNull(), // in cents
    totalBasePriceBeforeFees: integer("total_base_price_before_fees").notNull(), // in cents
    calculatedTravelerPrice: integer("calculated_traveler_price").notNull(), // in cents
    datePriceFromAirbnb: integer("date_price_from_airbnb"), // If host uploaded property, we will scrape the price for the offer if they gave us the link for property creation
    randomDirectListingDiscount: integer("random_direct_listing_discount"),
    scrapeUrl: varchar("scrape_url"),
    isAvailableOnOriginalSite: boolean("is_available_on_original_site"),
    availabilityCheckedAt: timestamp("availability_checked_at", {
      withTimezone: true,
    }),
    becomeVisibleAt: timestamp("become_visible_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    status: statusEnum("status").default("Pending").notNull(),
    // tripCheckoutId: integer("trip_checkout_id")
    //   .notNull()
    //   .references(() => tripCheckouts.id, { onDelete: "cascade" }),
  },
  (t) => ({
    requestIdIdx: index().on(t.requestId),
    propertyIdIdx: index().on(t.propertyId),
    madePublicAtIndex: index().on(t.madePublicAt),
    acceptedAtIndex: index().on(t.acceptedAt),
    // tripCheckoutIdx: index().on(t.tripCheckoutId),
  }),
);

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;

export const offerSelectSchema = createSelectSchema(offers);
export const offerInsertSchema = createInsertSchema(offers);

// make everything except id optional
export const offerUpdateSchema = offerInsertSchema.partial().required({
  id: true,
});
