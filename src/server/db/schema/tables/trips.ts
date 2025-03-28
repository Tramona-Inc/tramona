import {
  date,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { groups } from "./groups";
import { offers } from "./offers";
import { superhogRequests } from "./superhogRequests";
import { requestsToBook } from "./requestsToBook";
import { properties } from "./properties";
import { z } from "zod";
import { tripCheckouts } from "./payments";

const TRIP_STATUS = ["Booked", "Needs attention", "Cancelled"] as const;
export type TripStatus = (typeof TRIP_STATUS)[number];

export const tripStatusEnum = pgEnum("trip_status", TRIP_STATUS);

export const ALL_TRIP_SOURCES = [
  "City request",
  "Request to book",
  "Book it now",
] as const;

export const tripSourceEnum = pgEnum("trip_source", ALL_TRIP_SOURCES);

export const trips = pgTable(
  "trips",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),

    // One of offerId and bidId will be null, and the other will be non-null.
    // This is currently only enforced by the insert schema (see below)
    offerId: integer("offer_id").references(() => offers.id, {
      onDelete: "set null",
    }),
    requestToBookId: integer("request_to_book_id").references(
      () => requestsToBook.id,
      {
        onDelete: "set null",
      },
    ),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    checkIn: timestamp("check_in", { withTimezone: true }).notNull(),
    checkOut: timestamp("check_out", { withTimezone: true }).notNull(),
    numGuests: integer("num_guests").notNull(),
    travelerTotalPaidAmount: integer("traveler_total_paid_amount")
      .default(0)
      .notNull(), // in cents

    paymentIntentId: varchar("payment_intent_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    paymentCaptured: timestamp("payment_captured", { withTimezone: true }),
    hostPayed: timestamp("host_payed", { withTimezone: true }),
    superhogRequestId: integer("superhog_request_id").references(
      () => superhogRequests.id,
    ),
    tripsStatus: tripStatusEnum("trip_status").default("Booked"),
    tripCheckoutId: integer("tripCheckoutId").references(
      () => tripCheckouts.id,
      { onDelete: "set null" },
    ),
    tripSource: tripSourceEnum("trip_source").notNull().default("City request"),
  },
  (t) => ({
    groupIdIdx: index().on(t.groupId),
    offerIdIdx: index().on(t.offerId),
    requestToBookIdx: index().on(t.requestToBookId),
    propertyIdIdx: index().on(t.propertyId),
    tripCheckoutIdx: index().on(t.tripCheckoutId),
  }),
);

export type Trip = typeof trips.$inferSelect;

// enforce mutual exclusion of offerId and bidId -- note that this is
// not reflected in the types but you can use non-null assertions to work around it
export const tripInsertSchema = createInsertSchema(trips)
  .omit({ requestToBookId: true, offerId: true })
  .and(
    z.union([
      z.object({ offerId: z.number(), bidId: z.undefined() }),
      z.object({ offerId: z.undefined(), bidId: z.number() }),
    ]),
  );

export const tripCancellations = pgTable(
  "trip-cancellations",
  {
    id: serial("id").primaryKey(),
    reason: varchar("reason").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    tripId: integer("trips_id")
      .notNull()
      .references(() => trips.id, {
        onDelete: "cascade",
      }),
    amountRefunded: integer("amount_refunded").notNull().default(0),
  },
  (t) => {
    return {
      tripIdIdx: index().on(t.tripId),
    };
  },
);
