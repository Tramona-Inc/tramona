import {
  integer,
  pgTable,
  serial,
  timestamp,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { trips } from "./trips";
import { users } from "./users";

export const ALL_ACTIONS = ["create", "update", "delete"] as const;
export const actionEnum = pgEnum("action", ALL_ACTIONS);

export const superhogErrors = pgTable("superhog_errors", {
  id: serial("id").primaryKey(),
  echoToken: text("echo_token"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  tripId: integer("trip_id").references(() => trips.id, {
    onDelete: "cascade",
  }),
  propertiesId: integer("properties_id").references(() => properties.id),
  action: actionEnum("action").default("create").notNull(),
});

//didnt set up relations up yet because we do not have the shema flow yet

export type SuperhogErrors = typeof superhogErrors.$inferSelect;
