import {
  integer,
  pgTable,
  serial,
  pgEnum,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { properties } from "./properties";
import { users } from "./users";

export const superhogStatusEnum = pgEnum("superhog_status", [
  "Approved",
  "Flagged",
  "Rejected",
  "Pending",
]);

export const superhogRequests = pgTable("superhog_requests", {
  id: serial("id").primaryKey(),
  echoToken: varchar("echo_token", { length: 100 }).notNull(),
  superhogVerificationId: varchar("superhog_verification_id", {
    length: 100,
  }).notNull(),
  superhogReservationId: varchar("superhog_reservation_id", {
    length: 100,
  }).notNull(),
  superhogStatus: superhogStatusEnum("superhog_status"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  // tripId: integer("trip_id")
  //   .notNull()
  //   .references(() => trips.id, { onDelete: "cascade" }),
  // nameOfVerifiedUser: varchar("name_of_verified_user", {
  //   length: 100,
  // }).references(() => users.name, { onDelete: "cascade" }), //we need to make non-nullable after we require it in signup
  //propertyTown: varchar("property_town", { length: 100 }).notNull(),
  //propertyAddress: varchar("property_address", { length: 100 }).notNull(),
  //propertyCountryIso: varchar("property_country_iso", { length: 4 }).notNull(),
});
//didnt set up relations up yet because we do not have the shema flow yet

export type SuperhogRequests = typeof superhogRequests.$inferSelect;
export const superhogRequestsSelectSchema =
  createSelectSchema(superhogRequests);
export const superhogRequestsInsertSchema =
  createInsertSchema(superhogRequests);

export const superhogRequestsFormSchema =
  superhogRequestsInsertSchema.partial();
