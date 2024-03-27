import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { propertyTypeEnum } from "./properties";
import { groups } from "./groups";

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  madeByGroupId: integer("made_by_group_id")
    .notNull()
    // for this onDelete cascade to do anything, well need to delete groups with no members
    .references(() => groups.id, { onDelete: "cascade" }),
  requestGroupId: integer("request_group_id")
    .notNull()
    .references(() => requestGroups.id, { onDelete: "cascade" }),
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
  haveSentFollowUp: boolean("have_sent_follow_up").default(false).notNull(),
});

export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
export const requestSelectSchema = createSelectSchema(requests);
export const requestInsertSchema = createInsertSchema(requests);

export const MAX_REQUEST_GROUP_SIZE = 10;

export const requestGroups = pgTable("request_groups", {
  id: serial("id").primaryKey(),
  hasApproved: boolean("has_approved").default(false).notNull(),
  confirmationSentAt: timestamp("confirmation_sent_at").notNull().defaultNow(),
  haveSentFollowUp: boolean("have_sent_follow_up").default(false).notNull(),
});

export type RequestGroup = typeof requestGroups.$inferSelect;
export type NewRequestGroup = typeof requestGroups.$inferInsert;
export const requestGroupSelectSchema = createSelectSchema(requestGroups);
export const requestGroupInsertSchema = createInsertSchema(requestGroups);
