import {
  date,
  index,
  integer,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { groups } from "./groups";
import { properties } from "./properties";
import { users } from "./users";

export const requestsToBook = pgTable(
  "requests_to_book",
  {
    id: serial("id").primaryKey(),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    madeByGroupId: integer("made_by_group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    numGuests: smallint("num_guests").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (t) => ({
    propertyIdIdx: index().on(t.propertyId),
    userIdIdx: index().on(t.userId),
    madeByGroupIdIdx: index().on(t.madeByGroupId),
  })
);

export type RequestsToBook = typeof requestsToBook.$inferSelect;
export type NewRequestsToBook = typeof requestsToBook.$inferInsert;

export const requestsToBookSelectSchema = createSelectSchema(requestsToBook);
export const requestsToBookInsertSchema = createInsertSchema(requestsToBook);