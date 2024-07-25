import {
  date,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { groups } from "./groups";
import { offers } from "./offers";
import { superhogRequests } from "./superhogRequests";
import { bids } from "./bids";
import { properties } from "./properties";
import { z } from "zod";

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
      onDelete: "cascade",
    }),
    bidId: integer("bid_id").references(() => bids.id, { onDelete: "cascade" }),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    numGuests: integer("num_guests").notNull(),
    paymentIntentId: varchar("payment_intent_id"),
    checkoutSessionId: varchar("checkout_session_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    superhogRequestId: integer("superhog_request_id").references(
      () => superhogRequests.id,
    ),
  },
  (t) => ({
    groupIdIdx: index().on(t.groupId),
    offerIdIdx: index().on(t.offerId),
    bidIdIdx: index().on(t.bidId),
    propertyIdIdx: index().on(t.propertyId),
  }),
);

export type Trip = typeof trips.$inferSelect;

// enforce mutual exclusion of offerId and bidId -- note that this is
// not reflected in the types but you can use non-null assertions to work around it
export const tripInsertSchema = createInsertSchema(trips)
  .omit({ bidId: true, offerId: true })
  .and(
    z.union([
      z.object({ offerId: z.number(), bidId: z.undefined() }),
      z.object({ offerId: z.undefined(), bidId: z.number() }),
    ]),
  );
