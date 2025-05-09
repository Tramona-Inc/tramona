import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { groups } from "./groups";
import { properties } from "./properties";

export const bidStatusEnum = pgEnum("bid_status", [
  "Pending",
  "Accepted",
  "Rejected",
  "Cancelled",
]);

export const bids = pgTable(
  "bids",
  {
    id: serial("id").primaryKey(),
    madeByGroupId: integer("made_by_group_id")
      .notNull()
      // for this onDelete cascade to do anything, well need to delete groups with no members
      .references(() => groups.id, { onDelete: "cascade" }),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, {
        onDelete: "cascade",
      }),
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),

    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    paymentIntentId: varchar("payment_intent_id"),
    setupIntentId: varchar("setup_intent_id"),
    paymentMethodId: varchar("payment_method_id"),

    numGuests: integer("num_guests").notNull().default(1),
    amount: integer("amount").notNull(),
    status: bidStatusEnum("status").notNull().default("Pending"),
    statusUpdatedAt: timestamp("status_updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    dialogShown: boolean("dialog_shown").notNull().default(false),
  },
  (t) => ({
    madeByGroupIdIdx: index().on(t.madeByGroupId),
    propertyIdIdx: index().on(t.propertyId),
  }),
);

export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;

export const bidSelectSchema = createSelectSchema(bids);
export const bidInsertSchema = createInsertSchema(bids);

