import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { trips } from "./trips";
import { users } from "./users";
import { superhogRequests } from "./superhogRequests";

const claimStatus = pgEnum("claim_status", [
  "Submitted",
  "Resolved",
  "In Review",
]);

const resolutionResults = pgEnum("resolution_results", [
  "Approved",
  "Insufficient evidence",
  "Rejected",
]);

const paymentSources = pgEnum("payment_sources", [
  "Superhog",
  "Security Deposit",
  "Tramona",
]);

//<------- tables  -------_>
export const claims = pgTable(
  "claims",
  {
    id: serial("id").primaryKey().notNull(),
    tripId: integer("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    filedByUserId: varchar("filed_by_user_id").references(() => users.id, {
      //we need to make it the teams id
      onDelete: "set null",
    }),
    description: varchar("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    inReviewAt: timestamp("in_review_at", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    superhogRequestId: varchar("superhog_request_id").references(
      () => superhogRequests.id,
    ),
    reportedThroughSuperhogAt: timestamp("reported_through_superhog_at", {
      withTimezone: true,
    }),
    claimStatus: claimStatus("claim_status").default("Submitted"),
  },
  (t) => ({
    tripId: index().on(t.tripId),
    filedByUserId: index().on(t.filedByUserId),
  }),
);

export const claimResolutions = pgTable(
  "claim_resolutions",
  {
    //can have multiple per claim, 2+ is re resolve
    id: serial("id").primaryKey().notNull(),
    claimId: integer("claim_id")
      .notNull()
      .references(() => claims.id)
      .notNull(),
    resolutionResult: resolutionResults("resolution_results")
      .notNull()
      .default("Approved"),
    resolutionDescription: varchar("resolution_description").notNull(),
    resolvedByAdminId: varchar("resolved_by_admin_id").references(
      () => users.id,
    ),
  },
  (t) => ({
    claimId: index().on(t.claimId),
  }),
);

export const claimItems = pgTable(
  "claim_items",
  {
    //can have multiple per claim
    id: serial("id").primaryKey(),
    claimId: integer("claim_id")
      .notNull()
      .references(() => claims.id),
    tripId: integer("trips_id")
      .notNull()
      .references(() => trips.id, {
        onDelete: "cascade",
      }),
    requestedAmount: integer("requested_amount").notNull(),
    outstandingAmount: integer("outstanding_amount"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    paymentCompleteAt: timestamp("payment_complete_at", { withTimezone: true }),
    description: varchar("description").notNull(),
    propertyId: integer("property_id").references(() => properties.id),
    resolvedBySuperhog: boolean("resolved_by_superhog").default(false),
  },
  (t) => ({
    claimId: index().on(t.claimId),
    tripId: index().on(t.tripId),
  }),
);

export const claimPayments = pgTable(
  "claim_payments",
  {
    //can have multiple per claimItem
    id: serial("id").primaryKey(),
    claimItemId: integer("claim_item_id")
      .notNull()
      .references(() => claimItems.id, { onDelete: "cascade" }),
    source: paymentSources("source").notNull(), // Enum: Superhog, Security Deposit
    superhogRequestId: varchar("superhog_request_id").references(
      () => superhogRequests.id,
    ),
    amountPaid: integer("amount_paid").notNull(),
    paymentDate: timestamp("payment_date", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    claimItemId: index().on(t.claimItemId),
    superhogRequestId: index().on(t.superhogRequestId),
  }),
);
