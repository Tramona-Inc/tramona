import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const REFERRAL_CODE_LENGTH = 7;

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
