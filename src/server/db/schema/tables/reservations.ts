import {
  date,
  integer,
  pgTable,
  serial,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
export const superhogStatusEnum = pgEnum("superhog_status", [
  "Approved",
  "Flagged",
  "Rejected",
  "Pending",
]);

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  echoToken: varchar("echo_token", { length: 100 }).notNull(),
  propertyId: integer("property_id"), // relation to properties
  userId: integer("user_id"), //relation to users table
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  propertyAddress: varchar("property_address", { length: 100 }).notNull(),
  propertyTown: varchar("property_town", { length: 100 }).notNull(),
  propertyCountryIso: varchar("property_country_iso", { length: 4 }).notNull(),
  superhogVerificationId: varchar("superhog_verification_id", {
    length: 100,
  }).notNull(),
  superhogReservationId: varchar("superhog_reservation_id", {
    length: 100,
  }).notNull(),
  superhogStatus: superhogStatusEnum("superhog_status"),
  nameOfVerifiedUser: varchar("name_of_verified_user", {
    length: 100,
  }).notNull(),
});
//didnt set up relations up yet because we do not have the shema flow yet

export type Reservation = typeof reservations.$inferSelect;
export const reservationSelectSchema = createSelectSchema(reservations);
export const reservationInsertSchema = createInsertSchema(reservations);

export const superhogFormSchema = reservationInsertSchema.partial();
