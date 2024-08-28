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
    totalPrice: integer("total_price").notNull(), // in cents
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    madePublicAt: timestamp("made_public_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    paymentIntentId: varchar("payment_intent_id"),
    checkoutSessionId: varchar("checkout_session_id"),
    tramonaFee: integer("tramona_fee").default(0), // in cents
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    hostPayout: integer("host_payout").notNull(), // in cents
    travelerOfferedPrice: integer("traveler_offered_price").notNull(), // in cents
    scrapeUrl: varchar("scrape_url"),
    isAvailableOnOriginalSite: boolean("is_available_on_original_site"),
    availabilityCheckedAt: timestamp("availability_checked_at"),
  },
  (t) => ({
    requestIdIdx: index().on(t.requestId),
    propertyIdIdx: index().on(t.propertyId),
    madePublicAtIndex: index().on(t.madePublicAt),
    acceptedAtIndex: index().on(t.acceptedAt),
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
