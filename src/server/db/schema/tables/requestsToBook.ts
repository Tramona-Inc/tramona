import {
  date,
  index,
  integer,
  pgTable,
  serial,
  smallint,
  text,
  pgEnum,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { groups } from "./groups";
import { properties } from "./properties";
import { users } from "./users";
import { hostTeams } from "./hostTeams";

export const statusEnumArray = [
  "Accepted",
  "Withdrawn",
  "Denied",
  "Expired",
  "Pending",
] as const;

export const statusEnum = pgEnum("status", [
  "Accepted",
  "Withdrawn",
  "Denied",
  "Expired",
  "Pending",
]);

export const requestsToBook = pgTable(
  "requests_to_book",
  {
    id: serial("id").primaryKey(),
    hostTeamId: integer("host_team_id")
      .notNull()
      .references(() => hostTeams.id),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    madeByGroupId: integer("made_by_group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
    numGuests: smallint("num_guests").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    status: statusEnum("status").default("Pending"),
    paymentIntentId: text("payment_intent_id").notNull(),
    isDirectListing: boolean("is_direct_listing").notNull(), //true = scraped property : false = our property
    //what do we need we need calculated 1.) calculatedTravelerPrice and
    calculatedBasePrice: integer("calculated_base_price").notNull(), // not including markup and additional fees (SOURCE OF ALL TRUTH)
    calculatedTravelerPrice: integer("calculated_traveler_price").notNull(), // this is the amount after primary layer  and before secondary
    additionalFees: integer("additional_fees").notNull().default(0), // we have this in here and trip checkout
  },
  (t) => ({
    propertyIdIdx: index().on(t.propertyId),
    userIdIdx: index().on(t.userId),
    madeByGroupIdIdx: index().on(t.madeByGroupId),
    hostTeamIdIdx: index("requests_to_book_host_team_id_idx").on(t.hostTeamId),
    statusIdx: index("requests_to_book_status_idx").on(t.status),
    propertyIdStatusIdx: index("requests_to_book_property_id_status_idx").on(
      t.propertyId,
      t.status,
    ),
    checkInIdx: index("requests_to_book_check_in_idx").on(t.checkIn),
    checkOutIdx: index("requests_to_book_check_out_idx").on(t.checkOut),
    checkInOutIdx: index("requests_to_book_check_in_out_idx").on(
      t.checkIn,
      t.checkOut,
    ),
    createdAtIdx: index("requests_to_book_created_at_idx").on(t.createdAt),
  }),
);

export type RequestsToBook = typeof requestsToBook.$inferSelect;
export type NewRequestsToBook = typeof requestsToBook.$inferInsert;

export const requestsToBookSelectSchema = createSelectSchema(requestsToBook);
export const requestsToBookInsertSchema = createInsertSchema(requestsToBook);
