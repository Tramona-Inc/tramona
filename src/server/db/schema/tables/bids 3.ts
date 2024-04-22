import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { properties } from "./properties";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  madeByGroupId: integer("made_by_group_id")
    .notNull()
    // for this onDelete cascade to do anything, well need to delete groups with no members
    .references(() => groups.id, { onDelete: "cascade" }),
  propertyId: integer("property_id").references(() => properties.id, {
    onDelete: "cascade",
  }),
  numGuests: integer("num_guests").notNull().default(1),
  amount: integer("amount"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;

export const bidSelectSchema = createSelectSchema(bids);
export const bidInsertSchema = createInsertSchema(bids);
