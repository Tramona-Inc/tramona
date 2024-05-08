import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const profile = pgTable("profile", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  propertiesReceived: varchar("properties_received").array(),
  propertiesGiven: varchar("properties_given").array(),
  destinations: varchar("destinations").array(),
});
