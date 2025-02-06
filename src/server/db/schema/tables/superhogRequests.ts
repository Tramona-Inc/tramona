import {
  integer,
  pgTable,
  boolean,
  serial,
  pgEnum,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { properties } from "./properties";
import { users } from "./users";
import { trips } from "./trips";

export const superhogStatusEnum = pgEnum("superhog_status", [
  "Approved",
  "Flagged",
  "Rejected",
  "Pending",
]);

export const superhogRequests = pgTable("superhog_requests", {
  id: serial("id").primaryKey(),
  echoToken: varchar("echo_token", { length: 100 }).notNull(),
  superhogVerificationId: varchar("superhog_verification_id", {
    length: 100,
  }).notNull(),
  superhogReservationId: varchar("superhog_reservation_id", {
    length: 100,
  }).notNull(),
  superhogStatus: superhogStatusEnum("superhog_status"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  propertyId: integer("property_id")
    .references(() => properties.id, {
      onDelete: "cascade",
    })
    .notNull()
    .default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  isCancelled: boolean("is_cancelled").default(false).notNull(),
});

//superhog Error schema

export const ALL_ACTIONS = ["create", "update", "delete"] as const;
export const superhogErrorAction = pgEnum("superhog_error_action", ALL_ACTIONS);

export const superhogErrors = pgTable("superhog_errors", {
  id: serial("id").primaryKey(),
  echoToken: text("echo_token"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  tripId: integer("trip_id").references(() => trips.id, {
    onDelete: "cascade",
  }),
  propertiesId: integer("properties_id").references(() => properties.id),
  action: superhogErrorAction("action").default("create").notNull(),
});

//didnt set up relations up yet because we do not have the shema flow yet

//superhog action on trips schema
export const superhogActionOnTrips = pgTable(
  "superhog_action_on_trips",
  {
    id: serial("id").primaryKey(),
    tripId: integer("trip_id").references(() => trips.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    action: superhogErrorAction("action").default("create").notNull(),
    superhogRequestId: integer("superhog_request_id").references(
      () => superhogRequests.id,
      { onDelete: "set null" },
    ),
  },
  (t) => ({
    tripIdIdx: index().on(t.tripId),
    superhogRequestIdIdx: index().on(t.superhogRequestId),
  }),
);

export type SuperhogRequests = typeof superhogRequests.$inferSelect;

export const superhogRequestsSelectSchema =
  createSelectSchema(superhogRequests);

export const superhogRequestsInsertSchema =
  createInsertSchema(superhogRequests);

export const superhogRequestsFormSchema =
  superhogRequestsInsertSchema.partial();

export type SuperhogErrors = typeof superhogErrors.$inferSelect;
