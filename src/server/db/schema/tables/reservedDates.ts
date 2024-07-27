// db/schema/tables/reservedDates.ts

import {
  pgTable,
  integer,
  date,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const reservedDates = pgTable("reserved_dates", {
  id: serial('id').primaryKey(),
  propertyId: integer("property_id").primaryKey(),
  checkIn: date("check_in", { mode: "date" }).notNull(),
  checkOut: date("check_out", { mode: "date" }).notNull(),
});

export type ReservedDate = typeof reservedDates.$inferSelect;
export const SelectSchema = createSelectSchema(reservedDates);
export const reservedDateInsertSchema = createInsertSchema(reservedDates);