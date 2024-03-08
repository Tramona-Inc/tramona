import {
  serial,
  date,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  varchar,
  boolean,
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
  checkIn: date("check_in", { mode: "date" }).notNull(),
  checkOut: date("check_out", { mode: "date" }).notNull(),
  numGuests: smallint("num_guests").notNull().default(1),
  minNumBeds: smallint("min_num_beds").default(1),
  minNumBedrooms: smallint("min_num_bedrooms").default(1),
  propertyType: propertyTypeEnum("property_type"),
  note: varchar("note", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  hasApproved: boolean("has_approved").default(false).notNull(),
  confirmationSentAt: timestamp("confirmation_sent_at").notNull().defaultNow(),
  haveSentFollowUp: boolean("has_approved").default(false).notNull(),
});

export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
export const requestSelectSchema = createSelectSchema(requests);
export const requestInsertSchema = createInsertSchema(requests);
