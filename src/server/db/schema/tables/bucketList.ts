import { date, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { properties } from "./properties";

export const bucketListDestinations = pgTable("bucket_list_destinations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  city: varchar("city").notNull(),
  plannedCheckIn: date("planned_check_in", { mode: "date" }).notNull(),
  plannedCheckOut: date("planned_check_out", { mode: "date" }).notNull(),
});

export const bucketListProperties = pgTable("bucket_list_properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id),
  plannedCheckIn: date("planned_check_in", { mode: "date" }).notNull(),
  plannedCheckOut: date("planned_check_out", { mode: "date" }).notNull(),
});
