import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { bids } from "./bids";
import { properties } from "./properties";
import { users } from "./users";

export const counterStatusEnum = pgEnum("bid_status", [
  "Pending",
  "Accepted",
  "Rejected",
  "Cancelled",
]);

export const counters = pgTable(
  "counters",
  {
    id: serial("id").primaryKey(),
    bidId: integer("bid_id")
      .notNull()
      // for this onDelete cascade to do anything, well need to delete groups with no members
      .references(() => bids.id, { onDelete: "cascade" }),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, {
        onDelete: "cascade",
      }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    counterAmount: integer("counter_amount").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    status: counterStatusEnum("status").notNull().default("Pending"),
    statusUpdatedAt: timestamp("status_updated_at"),
  },
  (t) => ({
    bidId: index().on(t.bidId),
    propertyidIdx: index().on(t.propertyId),
  }),
);

export type Counter = typeof counters.$inferSelect;
export type NewCounter = typeof counters.$inferInsert;

export const counterSelectSchema = createSelectSchema(counters);
export const counterInsertSchema = createInsertSchema(counters);
