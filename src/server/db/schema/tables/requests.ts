import {
  date,
  doublePrecision,
  geometry,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { groups } from "./groups";
import { propertyTypeEnum } from "../common";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { linkInputProperties } from "./linkInputProperties";

export const ALL_REQUESTABLE_AMENITIES = [
  "Pool",
  "Hot tub",
  "A/C",
  "Dedicated workspace",
  "Kitchen",
  "Wifi",
] as const;

export type RequestableAmenity = (typeof ALL_REQUESTABLE_AMENITIES)[number];

export const requestableAmenitiesEnum = pgEnum(
  "requestable_amenities",
  ALL_REQUESTABLE_AMENITIES,
);

export const requests = pgTable(
  "requests",
  {
    id: serial("id").primaryKey(),
    madeByGroupId: integer("made_by_group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    linkInputPropertyId: integer("link_input_property_id").references(
      () => linkInputProperties.id,
      { onDelete: "set null" },
    ),
    maxTotalPrice: integer("max_total_price").notNull(), // in cents
    location: varchar("location", { length: 255 }).notNull(), // TODO: use postGIS
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    numGuests: smallint("num_guests").notNull().default(1),
    minNumBeds: smallint("min_num_beds").default(1),
    minNumBedrooms: smallint("min_num_bedrooms").default(1),
    minNumBathrooms: smallint("min_num_bathrooms").default(1),
    propertyType: propertyTypeEnum("property_type"),
    amenities: requestableAmenitiesEnum("amenities")
      .array()
      .notNull()
      .default(sql`'{}'`),
    note: varchar("note", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    // lat: doublePrecision("lat").notNull(),
    // lng: doublePrecision("lng").notNull(),
    radius: doublePrecision("radius").notNull(),
    latLngPoint: geometry("lat_lng_point", {
      type: "point",
      mode: "xy",
      srid: 4326,
    })
      .notNull()
      .$type<{ x: number; y: number }>(),
  },
  (t) => ({
    madeByGroupidIdx: index().on(t.madeByGroupId),
    requestSpatialIndex: index("request_spacial_index").using(
      "gist",
      t.latLngPoint,
    ),
  }),
);
export type Request = typeof requests.$inferSelect;
export type NewRequest = typeof requests.$inferInsert;
export type MinimalRequest = Pick<
  Request,
  "id" | "location" | "checkIn" | "checkOut" | "numGuests" | "maxTotalPrice"
>;

export const requestSelectSchema = createSelectSchema(requests);
export const requestInsertSchema = createInsertSchema(requests, {
  latLngPoint: z.object({ x: z.number(), y: z.number() }),
  amenities: z.array(z.enum(ALL_REQUESTABLE_AMENITIES)),
});

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
