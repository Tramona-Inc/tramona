import { relations, sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `tramona-trpc_${name}`);

export const referrals = pgTable("referrals", {
  referral_id: bigserial("referral_id", { mode: "number" }).primaryKey(),
  referral_code: varchar("referral_code"),
});

export const property_request = pgTable("property-listing", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  requestPrice: doublePrecision("request_price"),
  address: varchar("address", { length: 256 }),
  check_in: date("check_in"),
  check_out: date("check_in"),
  guests: smallint("guests").default(1),
  active: boolean("guests"),
  updated_at: timestamp("updated_at"),
  created_at: timestamp("created_at"),
});

export const property_listing = pgTable("property_listing", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  property_name: varchar("property_name", { length: 256 }),
  guests: smallint("guests").default(1),
  beds: smallint("beds").default(0),
  baths: smallint("baths").default(0),
  price: doublePrecision("price"),
  rating: doublePrecision("rating"),
  updated_at: timestamp("updated_at"),
  created_at: timestamp("created_at"),
});

export const statusEnum = pgEnum("status", ["pending", "approved", "rejected"]);

export const offers = pgTable("offer", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  address: varchar("address", { length: 256 }),
  host_name: varchar("host_name", { length: 256 }),
  beds: smallint("beds").default(0),
  baths: smallint("baths").default(0),
  area: integer("area"),
  price: doublePrecision("price"),
  original_price: doublePrecision("original_price"),
  rating: doublePrecision("rating"),
  rating_count: integer("rating_count"),
  status: statusEnum("status"),
  image_url: varchar("image_url"),
  airbnb_url: varchar("airbnb_url"),
  updated_at: timestamp("updated_at"),
  created_at: timestamp("created_at"),
});


export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
