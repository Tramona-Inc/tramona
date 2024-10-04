import {
  date,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  pgEnum,
  primaryKey,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { groups } from "./groups";
import { offers } from "./offers";
import { superhogRequests } from "./superhogRequests";
import { trips } from "./trips";
import { properties } from "./properties";
import { z } from "zod";
import { time } from "console";

export const tripCheckouts = pgTable("trip_checkouts", {
  id: serial("id").primaryKey().notNull(),
  totalTripAmount: integer("total_trip_amount").notNull(),
  travelerOfferedPriceBeforeFees: integer(
    "traveler_offered_price_before_fees",
  ).notNull(),
  paymentIntentId: varchar("payment_intent_id").notNull().default(""),
  taxesPaid: integer("taxes_paid").notNull().default(0),
  taxPercentage: decimal("tax_percentage", { precision: 3, scale: 1 }), //will save as percentage ex. 2.9  = 2.9%
  superhogPaid: integer("superhog_paid").notNull().default(0),
  stripeTransactionFee: integer("stripe_transaction_fee").notNull().default(0),
});

export type TripCheckouts = typeof tripCheckouts.$inferSelect;

// enforce mutual exclusion of offerId and bidId -- note that this is
// not reflected in the types but you can use non-null assertions to work around it
export const tripPaymentInsertSchema = createInsertSchema(tripCheckouts);

export const refundedPayments = pgTable("refunded_payments", {
  id: serial("id").primaryKey().notNull(),
  tripId: integer("trip_id").references(() => trips.id),
  amountRefunded: integer("amount_refunded").notNull(),
  reason: varchar("reason").default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
