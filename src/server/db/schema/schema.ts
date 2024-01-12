import {
  bigserial,
  boolean,
  date,
  doublePrecision,
  integer,
  pgEnum,
  pgTableCreator,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `tramona-trpc_${name}`);

export const referrals = pgTable("referrals", {
  referral_id: bigserial("referral_id", { mode: "number" }).primaryKey(),
  referral_code: varchar("referral_code"),
});

export const requests = pgTable("requests", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  // requestPrice: doublePrecision("request_price"),
  address: varchar("address", { length: 256 }),
  check_in: date("check_in"),
  check_out: date("check_in"),
  guests: smallint("guests").default(1),
  active: boolean("guests"),
  updated_at: timestamp("updated_at"),
  created_at: timestamp("created_at"),
});

export const properties = pgTable("properites", {
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
