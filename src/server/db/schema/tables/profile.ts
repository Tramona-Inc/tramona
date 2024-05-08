import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const profile = pgTable("profile", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  profileUrl: varchar("profile_url", { length: 1000 }),
  location: varchar("location", { length: 1000 }),
  socials: varchar("socials").array(),
  about: text("about"),
  propertiesReceived: varchar("properties_received").array(),
  propertiesGiven: varchar("properties_given").array(),
  destinations: varchar("destinations").array(),
});
