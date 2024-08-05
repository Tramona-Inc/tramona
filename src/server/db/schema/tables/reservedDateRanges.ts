// db/schema/tables/reservedDates.ts

import { pgTable, integer, date, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { properties } from "./properties";

export const reservedDateRanges = pgTable(
  "reserved_date_ranges",
  {
    id: serial("id").primaryKey(),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id),
    start: date("start").notNull(),
    end: date("end").notNull(),
  },
  (t) => ({
    propertyIdIndex: index().on(t.propertyId),
  }),
);

export type ReservedDate = typeof reservedDateRanges.$inferSelect;
export const reservedDateSelectSchema = createSelectSchema(reservedDateRanges);
export const reservedDateInsertSchema = createInsertSchema(reservedDateRanges);
