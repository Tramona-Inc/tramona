import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// we need to put referralCodes and users in the same file because
// the tables depend on each other

export const REFERRAL_CODE_LENGTH = 7;
export const roleEnum = pgEnum("role", ["guest", "host", "admin"]);
export const referralTierEnum = pgEnum("referral_tier", [
  "Partner",
  "Ambassador",
]);

export const users = pgTable("user", {
  // nextauth fields
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  // custom fields
  password: varchar("password", { length: 510 }),
  referralCodeUsed: varchar("referral_code_used", {
    length: REFERRAL_CODE_LENGTH,
  }),
  role: roleEnum("role").notNull().default("guest"),
  referralTier: referralTierEnum("referral_tier").notNull().default("Partner"),
  phoneNumber: varchar("phone_number", { length: 20 }),
});

export type User = typeof users.$inferSelect;

export const referralCodes = pgTable("referral_codes", {
  referralCode: varchar("referral_code", {
    length: REFERRAL_CODE_LENGTH,
  }).primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  totalBookingVolume: integer("total_booking_volume").notNull().default(0),
  numSignUpsUsingCode: integer("num_sign_ups_using_code").notNull().default(0),
  numBookingsUsingCode: integer("num_bookings_using_code").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ReferralCode = typeof referralCodes.$inferSelect;
export const referralCodeSelectSchema = createSelectSchema(referralCodes);
export const referralCodeInsertSchema = createInsertSchema(referralCodes);
