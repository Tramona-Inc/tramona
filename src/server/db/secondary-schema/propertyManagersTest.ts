import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const propertyManagersTest = pgTable("property_managers_test", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  profilePic: varchar("profile_pic"),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
});
