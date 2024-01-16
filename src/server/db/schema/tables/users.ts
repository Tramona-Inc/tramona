import {
  pgTable,
  text,
  timestamp,
  varchar,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

// we need to put referralCodes and users in the same file because
// the tables depend on each other

export const REFERRAL_CODE_LENGTH = 7;
export const roleEnum = pgEnum("role", ["guest", "host", "admin"]);

export const users = pgTable("user", {
  // nextauth fields
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  // custom fields
  referralCodeUsed: varchar("referral_code_used", {
    length: REFERRAL_CODE_LENGTH,
  }),
  role: roleEnum("role").notNull().default("guest"),
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
  numSignUpsGenerated: integer("num_sign_ups_generated").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ReferralCode = typeof referralCodes.$inferSelect;
