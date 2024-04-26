import { date, integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { groups } from "./groups";
import { properties } from "./properties";
import { index } from "drizzle-orm/pg-core";

export const bids = pgTable(
  "bids",
  {
    id: serial("id").primaryKey(),
    madeByGroupId: integer("made_by_group_id")
      .notNull()
      // for this onDelete cascade to do anything, well need to delete groups with no members
      .references(() => groups.id, { onDelete: "cascade" }),
    propertyId: integer("property_id").references(() => properties.id, {
      onDelete: "cascade",
    }),
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    numGuests: integer("num_guests").notNull().default(1),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at"),
  },
  (t) => ({
    madeByGroupidIdx: index().on(t.madeByGroupId),
    propertyidIdx: index().on(t.propertyId),
  }),
);

export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;

export const bidSelectSchema = createSelectSchema(bids);
export const bidInsertSchema = createInsertSchema(bids);
