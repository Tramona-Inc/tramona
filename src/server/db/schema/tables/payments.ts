import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { trips } from "./trips";

export const tripCheckouts = pgTable("trip_checkouts", {
  id: serial("id").primaryKey().notNull(),
  totalTripAmount: integer("total_trip_amount").notNull(),
  calculatedTravelerPrice: integer("calculated_traveler_price").notNull(),
  paymentIntentId: varchar("payment_intent_id").notNull(),
  checkoutSessionId: varchar("checkout_session_id"),
  taxesPaid: integer("taxes_paid").notNull(),
  taxPercentage: decimal("tax_percentage").notNull(), //will save as integer 10 = 10% 222  = 22.2%
  superhogFee: integer("superhog_fee").notNull(),
  stripeTransactionFee: integer("stripe_transaction_fee").notNull(),
  totalSavings: integer("total_savings").notNull(),
  securityDeposit: integer("security_deposit").notNull(),
  additionalFees: integer("additional_fees"), //Cleaning, pet and additional guests
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
