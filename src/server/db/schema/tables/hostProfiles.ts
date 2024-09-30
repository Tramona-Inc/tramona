import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { referralCodes, users } from "./users";
import { hostTeams } from "./hostTeams";
import { trips } from "./trips";

export const ALL_HOST_TYPES = ["airbnb", "direct", "vrbo", "other"] as const;

export const hostTypeEnum = pgEnum("host_type", ALL_HOST_TYPES);

export const hostProfiles = pgTable(
  "host_profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    // type: hostTypeEnum("type").notNull().default("other"),
    // profileUrl: varchar("profile_url", { length: 1000 }),
    becameHostAt: timestamp("became_host_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    hostawayApiKey: varchar("hostaway_api_key"),
    hostawayAccountId: varchar("hostaway_account_id"),
    hostawayBearerToken: varchar("hostaway_bearer_token"),
    isHospitableCustomer: boolean("is_hospitable_customer").default(false),
    curTeamId: integer("cur_team_id")
      .notNull()
      .references(() => hostTeams.id),
  },
  (t) => ({
    curTeamidIdx: index().on(t.curTeamId),
  }),
);

export type HostProfile = typeof hostProfiles.$inferSelect;

export const hostReferralDiscounts = pgTable(
  "host_referral_discounts",
  {
    id: serial("id").primaryKey(),
    referralCode: text("referral_code")
      .notNull()
      .references(() => referralCodes.referralCode),
    ownerId: text("owner_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    refereeUserId: text("referee_user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    discountAmount: integer("discount").notNull().default(0),
    discountPercentage: real("discount_percentage").notNull().default(0.025),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    validatedAt: timestamp("validated_at", { withTimezone: true }), //when the referee has completed a trip
    redeemedAt: timestamp("resolved_at", { withTimezone: true }), // when the referer wants to redeem the discount
    tripId: integer("trip_id").references(() => trips.id),
  },
  (t) => ({
    referralCodesIdx: index().on(t.referralCode),
    ownerIdIdx: index().on(t.ownerId),
    refereeUserIdIdx: index().on(t.refereeUserId),
    tripIdIdx: index().on(t.tripId),
  }),
);
