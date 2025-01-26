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
    baseAmountBeforeFees: integer("base_amount_before_fees").notNull(), //we need both in case we change the markup it wouldn't affect previous request to books
    amountAfterTravelerMarkupAndBeforeFees: integer(
      "amount_after_traveler_markup_and_before_fees",
    ).notNull(), // this is the amount the host will see the traveler requested.
    isDirectListing: boolean("is_direct_listing").notNull(), //true = scraped property : false = our property
  },
  (t) => ({
    propertyIdIdx: index().on(t.propertyId),
    userIdIdx: index().on(t.userId),
    madeByGroupIdIdx: index().on(t.madeByGroupId),
  }),
);

export type RequestsToBook = typeof requestsToBook.$inferSelect;
export type NewRequestsToBook = typeof requestsToBook.$inferInsert;

export const requestsToBookSelectSchema = createSelectSchema(requestsToBook);
export const requestsToBookInsertSchema = createInsertSchema(requestsToBook);
