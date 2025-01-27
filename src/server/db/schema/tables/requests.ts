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
  timestamp,
  varchar,
  boolean,
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

export const REQUEST_STATUS = ["Pending", "Resolved", "Withdrawn"] as const;

export const requestStatusEnum = pgEnum("request_status", REQUEST_STATUS);

export const requestableAmenitiesEnum = pgEnum(
  "requestable_amenities",
  ALL_REQUESTABLE_AMENITIES,
);

export const ALL_REQUEST_MESSAGE_CASES = [
  "No matches within price range",
  "Some close matches",
  "No close matches",
  "Many close matches",
] as const;

export type RequestMessageCase = (typeof ALL_REQUEST_MESSAGE_CASES)[number];
export const requestMessageCasesEnum = pgEnum(
  "request_message_cases",
  ALL_REQUEST_MESSAGE_CASES,
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
    radius: doublePrecision("radius").notNull(),
    latLngPoint: geometry("lat_lng_point", {
      type: "point",
      mode: "xy",
      srid: 4326,
    })
      .notNull()
      .$type<{ x: number; y: number }>(),
    notifiedNoOffers: boolean("notified_no_offers").notNull().default(false),
    messageCase: requestMessageCasesEnum("message_case"),
    messageSent: timestamp("message_sent", { withTimezone: true }),
    status: requestStatusEnum("status").default("Pending").notNull(),
  },
  (t) => ({
    madeByGroupidIdx: index().on(t.madeByGroupId),
    requestSpatialIndex: index("request_spacial_index").using(
      "gist",
      t.latLngPoint,
    ),
    statusIdx: index("request_status_idx").on(t.status),
    checkInIdx: index("request_check_in_idx").on(t.checkIn),
    checkOutIdx: index("request_check_out_idx").on(t.checkOut),
    propertyTypeIdx: index("request_property_type_idx").on(t.propertyType),
    amenitiesIdx: index("request_amenities_idx")
      .on(t.amenities)
      .with({ using: "gin" }),
    createdAtIdx: index("request_created_at_idx").on(t.createdAt),
    groupIdStatusCreatedAtIdx: index("request_group_status_created_at_idx").on(
      t.madeByGroupId,
      t.status,
      t.createdAt,
    ),
    checkInOutIdx: index("request_check_in_out_idx").on(t.checkIn, t.checkOut),
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
