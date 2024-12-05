import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { trips } from "./trips";
import { users } from "./users";
import { superhogRequests } from "./superhogRequests";
import {
  ALL_PAYMENT_SOURCES,
  ALL_RESOLUTION_RESULTS,
  ALL_TRAVELER_CLAIM_RESPONSES,
} from "../common";
export const claimStatus = pgEnum("claim_status", [
  "Submitted",
  "Resolved",
  "In Review",
]);

export const resolutionResults = pgEnum(
  "resolution_results",
  ALL_RESOLUTION_RESULTS,
);

export const travelerClaimResponses = pgEnum(
  "traveler_claim_response",
  ALL_TRAVELER_CLAIM_RESPONSES,
);

export const paymentSources = pgEnum("payment_sources", ALL_PAYMENT_SOURCES);

//<------- tables  -------_>
export const claims = pgTable(
  "claims",
  {
    id: text("id").primaryKey().notNull(), //using uuid
    tripId: integer("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    filedByHostId: varchar("filed_by_host_id").references(() => users.id, {
      //we need to make it the teams id
      onDelete: "set null",
    }),
    claimsLink: varchar("claims_link").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    inReviewAt: timestamp("in_review_at", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    superhogRequestId: integer("superhog_request_id").references(
      () => superhogRequests.id,
    ),
    reportedThroughSuperhogAt: timestamp("reported_through_superhog_at", {
      withTimezone: true,
    }),
    claimStatus: claimStatus("claim_status").default("Submitted"),
  },
  (t) => ({
    tripId: index().on(t.tripId),
    filedByHostId: index().on(t.filedByHostId),
  }),
);

export const claimItemResolutions = pgTable(
  "claim_item_resolutions",
  {
    //can have multiple per claim, 2+ is re resolve
    id: serial("id").primaryKey().notNull(),
    claimId: text("claim_id")
      .references(() => claims.id, { onDelete: "cascade" })
      .notNull(),
    claimItemId: integer("claim_item_id")
      .notNull()
      .references(() => claimItems.id, { onDelete: "cascade" }),
    resolutionResult: resolutionResults("resolution_results")
      .notNull()
      .default("Pending"),
    resolutionDescription: varchar("resolution_description")
      .notNull()
      .default("No Description"),
    resolvedByAdminId: varchar("resolved_by_admin_id").references(
      () => users.id,
    ),
  },
  (t) => ({
    claimId: index().on(t.claimId),
    claimItemId: index().on(t.claimItemId),
  }),
);

export const claimItems = pgTable(
  "claim_items",
  {
    //can have multiple per claim
    id: serial("id").primaryKey(),
    itemName: text("item_name").notNull(),
    claimId: text("claim_id")
      .notNull()
      .references(() => claims.id, { onDelete: "cascade" }),
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
    imageUrls: varchar("image_urls").array().notNull(),
    travelerClaimResponse: travelerClaimResponses("traveler_claim_responses")
      .notNull()
      .default("Pending"),
    travelerResponseDescription: varchar("traveler_response_description"),
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
    superhogRequestId: integer("superhog_request_id").references(
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

export type Claim = typeof claims.$inferInsert;
export type ClaimItem = typeof claimItems.$inferInsert;
export type ClaimPayment = typeof claimPayments.$inferInsert;
export type ClaimItemResolution = typeof claimItemResolutions.$inferInsert;
