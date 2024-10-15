import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { offers } from "..";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { zodString } from "@/utils/zod-utils";

// we need to put referralCodes and users in the same file because
// the tables depend on each other

export const REFERRAL_CODE_LENGTH = 7;
export const ALL_ROLES = ["guest", "host", "admin"] as const;
export const roleEnum = pgEnum("role", ALL_ROLES);
export const COHOST_ROLES = ["strict", "medium", "loose"] as const;
export const coHostRoleEnum = pgEnum("coHostRole", COHOST_ROLES);
export const referralTierEnum = pgEnum("referral_tier", [
  "Partner",
  "Ambassador",
]);
export const earningStatusEnum = pgEnum("earning_status", [
  "pending",
  "paid",
  "cancelled",
]);

export const isIdentityVerifiedEnum = pgEnum("is_identity_verified", [
  "false",
  "true",
  "pending",
]);

// NOTE: every time you add a column to the users table,
// you can choose to either add it to the session (e.g. session.user.newColumn)
// or not. If you do want to, go to src/server/auth.ts and youll see 3 places
// where you need to add the new column
export const users = pgTable(
  "user",
  {
    // nextauth fields
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { withTimezone: true }),
    image: text("image"),

    // custom fields
    password: varchar("password", { length: 510 }),
    username: varchar("username", { length: 60 }),
    referralCodeUsed: varchar("referral_code_used", {
      length: REFERRAL_CODE_LENGTH,
    }),
    role: roleEnum("role").notNull().default("guest"),
    referralTier: referralTierEnum("referral_tier")
      .notNull()
      .default("Partner"),
    phoneNumber: varchar("phone_number", { length: 20 }),
    lastTextAt: timestamp("last_text_at", { withTimezone: true }).defaultNow(),
    isWhatsApp: boolean("is_whats_app").default(false).notNull(),
    stripeCustomerId: varchar("stripe_customer_id"),
    stripeConnectId: varchar("stripe_connect_id"),
    chargesEnabled: boolean("charges_enabled").default(false),
    setupIntentId: varchar("setup_intent_id"),

    // mode: "string" cuz nextauth doesnt serialize/deserialize dates
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    //stripe identity verifications
    isIdentityVerified: isIdentityVerifiedEnum("is_identity_verified")
      .default("false")
      .notNull(),
    verificationReportId: varchar("verification_report_id"),
    dateOfBirth: varchar("date_of_birth"),

    profileUrl: varchar("profile_url", { length: 1000 }),
    location: varchar("location", { length: 1000 }),
    socials: varchar("socials")
      .array()
      .default(sql`'{}'`),
    about: text("about"),
    // destinations: varchar("destinations").array(),
    onboardingStep: integer("onboarding_step").notNull().default(0),
    isBurner: boolean("is_burner").default(false),
    sessionToken: text("session_token").unique(),
  },
  (t) => ({
    phoneNumberIdx: index().on(t.phoneNumber),
    emailIdx: index().on(t.email),
  }),
);

export type User = typeof users.$inferSelect;

export const referralCodes = pgTable(
  "referral_codes",
  {
    referralCode: varchar("referral_code", {
      length: REFERRAL_CODE_LENGTH,
    }).primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    totalBookingVolume: integer("total_booking_volume").notNull().default(0),
    numSignUpsUsingCode: integer("num_sign_ups_using_code")
      .notNull()
      .default(0),
    numBookingsUsingCode: integer("num_bookings_using_code")
      .notNull()
      .default(0),
    numHostSignUpsUsingCode: integer("num_host_sign_ups_using_code")
      .notNull()
      .default(0),
    curBalance: integer("cur_balance").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    ownerIdIdx: index("owner_id_idx").on(t.ownerId),
  }),
);

export const referralEarnings = pgTable(
  "referral_earnings",
  {
    id: serial("id").primaryKey(),
    referralCode: text("referral_code")
      .notNull()
      .references(() => referralCodes.referralCode, { onDelete: "cascade" }),
    refereeId: text("referee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    offerId: integer("offer_id")
      .notNull()
      .references(() => offers.id, { onDelete: "cascade" }),
    earningStatus: earningStatusEnum("earning_status").default("pending"),
    cashbackEarned: integer("cashback_earned").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    hostFeesSaved: integer("host_fees_saved"),
  },
  (t) => ({
    referralCodeIdx: index().on(t.referralCode),
    refereeIdIdx: index().on(t.refereeId),
    offerIdIdx: index().on(t.offerId),
  }),
);

export type ReferralEarnings = typeof referralEarnings.$inferSelect;
export const referralEarningsSelectSchema =
  createSelectSchema(referralEarnings);
export const referralEarningsInsertSchema =
  createInsertSchema(referralEarnings);

export type ReferralCode = typeof referralCodes.$inferSelect;
export const referralCodeSelectSchema = createSelectSchema(referralCodes);
export const referralCodeInsertSchema = createInsertSchema(referralCodes);

export const userInsertSchema = createInsertSchema(users, {
  socials: z.string().array(),
});
export const userSelectSchema = createSelectSchema(users);
export const userUpdateSchema = userInsertSchema
  .partial()
  .required({ id: true });
export const ProfileInfoSchema = z.object({
  name: zodString(),
  about: zodString({ maxLen: 1000 }),
  location: zodString(),
  facebook_link: z
    .string()
    .url()
    .startsWith("https://www.facebook.com/", "Must be a Facebook link")
    .optional()
    .or(z.literal("")),
  youtube_link: z
    .string()
    .url()
    .startsWith("https://www.youtube.com/", "Must be a YouTube link")
    .optional()
    .or(z.literal("")),
  instagram_link: z
    .string()
    .url()
    .startsWith("https://www.instagram.com/", "Must be a Instagram link")
    .optional()
    .or(z.literal("")),
  twitter_link: z
    .string()
    .url()
    .startsWith("https://x.com/", "Must be a Twitter link")
    .optional()
    .or(z.literal("")),
});
