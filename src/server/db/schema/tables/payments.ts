import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { trips } from "./trips";

export const tripCheckouts = pgTable("trip_checkouts", {
  id: serial("id").primaryKey().notNull(),
  totalTripAmount: integer("total_trip_amount").notNull(),
  calculatedTravelerPrice: integer(
    "traveler_offered_price_before_fees",
  ).notNull(),
  paymentIntentId: varchar("payment_intent_id").notNull(),
  checkoutSessionId: varchar("checkout_session_id"),
  taxesPaid: integer("taxes_paid").notNull(),
  taxPercentage: doublePrecision("tax_percentage"), //will save as percentage ex. 2.9  = 2.9%
  superhogFee: integer("superhog_fee").notNull(),
  stripeTransactionFee: integer("stripe_transaction_fee").notNull(),
  totalSavings: integer("total_savings").notNull(),
  securityDeposit: integer("security_deposit").notNull(),
});

export type TripCheckout = typeof tripCheckouts.$inferSelect;

// enforce mutual exclusion of offerId and bidId -- note that this is
// not reflected in the types but you can use non-null assertions to work around it
export const tripPaymentInsertSchema = createInsertSchema(tripCheckouts);

export const refundedPayments = pgTable("refunded_payments", {
  id: serial("id").primaryKey().notNull(),
  tripId: integer("trip_id").references(() => trips.id),
  amountRefunded: integer("amount_refunded").notNull(),
  description: varchar("description").default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
