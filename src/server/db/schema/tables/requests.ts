import {
  serial,
  date,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { propertyTypeEnum } from "./properties";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  maxTotalPrice: integer("max_total_price").notNull(), // in cents
  location: varchar("location", { length: 255 }).notNull(), // TODO: use postGIS
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  numGuests: smallint("num_guests").notNull().default(1),
  minNumBeds: smallint("min_num_beds").default(1),
  minNumBedrooms: smallint("min_num_bedrooms").default(1),
  propertyType: propertyTypeEnum("property_type"),
  note: varchar("note", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export type Request = typeof requests.$inferSelect;
export const requestSelectSchema = createSelectSchema(requests);
export const requestInsertSchema = createInsertSchema(requests);
