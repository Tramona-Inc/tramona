import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const ALL_HOST_TYPES = ["airbnb", "direct", "vrbo", "other"] as const;

export const hostTypeEnum = pgEnum("host_type", ALL_HOST_TYPES);

export const hostProfiles = pgTable("host_profiles", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  type: hostTypeEnum("type").notNull().default("other"),
  profileUrl: varchar("profile_url", { length: 1000 }),
  becameHostAt: timestamp("became_host_at").notNull().defaultNow(),
  stripeAccountId: varchar("stripeAccountId"),
  chargesEnabled: boolean("charges_enabled").default(false),
});
