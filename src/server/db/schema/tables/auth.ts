import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

// the users, accounts, sessions, and verificationTokens tables are all from nextauth
// (except for the custom fields on the users table)
// https://authjs.dev/reference/adapter/drizzle

export const REFERRAL_CODE_LENGTH = 7;
export const ALL_ROLES = ["guest", "host", "admin"] as const;

export const roleEnum = pgEnum("role", ALL_ROLES);

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

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const referralCodes = pgTable("referral_codes", {
  referralCode: varchar("referral_code", {
    length: REFERRAL_CODE_LENGTH,
  }).primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  totalBookingVolume: integer("total_booking_volume").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
