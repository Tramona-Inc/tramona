import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const hostTypeEnum = pgEnum("host_type", [
  "airbnb",
  "direct",
  "vrbo",
  "other",
]);

export const hostProfiles = pgTable("host_profiles", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: hostTypeEnum("type").notNull().default("other"),
  profileUrl: varchar("profile_url", { length: 1000 }),
  becameHostAt: timestamp("became_host_at").notNull().defaultNow(),
});
