import {
  pgTable,
  integer,
  date,
  serial,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { properties } from "./properties";

export const platformBookedOnEnum = pgEnum("platform_booked_on_enum", [
  "airbnb",
  "tramona",
]);

export const reservedDateRanges = pgTable(
  "reserved_date_ranges",
  {
    id: serial("id").primaryKey(),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    start: date("start").notNull(),
    end: date("end").notNull(),
    platformBookedOn: platformBookedOnEnum("platform_booked_on").notNull(),
  },
  (t) => ({
    propertyIdIndex: index().on(t.propertyId),
  }),
);

export type ReservedDate = typeof reservedDateRanges.$inferSelect;
export const reservedDateSelectSchema = createSelectSchema(reservedDateRanges);
export const reservedDateInsertSchema = createInsertSchema(reservedDateRanges);
