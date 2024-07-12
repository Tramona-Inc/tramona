import {
  boolean,
  date,
  doublePrecision,
  geometry,
  index,
  integer,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { groups } from "./groups";
import { propertyTypeEnum } from "./properties";
import { users } from "./users";
import { z } from "zod";

export const requests = pgTable(
  "requests",
  {
    id: serial("id").primaryKey(),
    madeByGroupId: integer("made_by_group_id")
      .notNull()
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
    minNumBathrooms: smallint("min_num_bathrooms").default(1),
    propertyType: propertyTypeEnum("property_type"),
    note: varchar("note", { length: 255 }),
    airbnbLink: varchar("airbnb_link", { length: 512 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    radius: doublePrecision("radius"),
    latLngPoint: geometry("lat_lng_point", { type: 'point', mode: 'xy', srid: 4326 }),
  },
  (t) => ({
    madeByGroupidIdx: index().on(t.madeByGroupId),
    requestGroupidIdx: index().on(t.requestGroupId),
    requestSpatialIndex: index('request_spacial_index').using('gist', t.latLngPoint)
  }),
);
export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
export const requestSelectSchema = createSelectSchema(requests);
export const requestInsertSchema = createInsertSchema(requests, {
  latLngPoint: z.object({x:z.number(), y:z.number()})
});

export const MAX_REQUEST_GROUP_SIZE = 10;

// TO-DO: maybe add relation
export const requestUpdatedInfo = pgTable(
  "request_updated_info",
  {
    id: serial("id").primaryKey(),
    requestId: integer("request_id").references(() => requests.id, {
      onDelete: "cascade",
    }),
    preferences: varchar("preferences", { length: 255 }),
    updatedPriceNightlyUSD: integer("updated_price_usd_nightly"),
    propertyLinks: text("property_links"),
  },
  (t) => ({
    requestidIdx: index().on(t.requestId),
  }),
);

export const requestGroups = pgTable(
  "request_groups",
  {
    id: serial("id").primaryKey(),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hasApproved: boolean("has_approved").default(false).notNull(),
    confirmationSentAt: timestamp("confirmation_sent_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    haveSentFollowUp: boolean("have_sent_follow_up").default(false).notNull(),
  },
  (t) => ({
    createdByUseridIdx: index().on(t.createdByUserId),
  }),
);

export type RequestGroup = typeof requestGroups.$inferSelect;
export type NewRequestGroup = typeof requestGroups.$inferInsert;
export const requestGroupSelectSchema = createSelectSchema(requestGroups);
export const requestGroupInsertSchema = createInsertSchema(requestGroups);
