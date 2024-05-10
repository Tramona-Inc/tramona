import {
  date,
  integer,
  pgTable,
  serial,
  varchar,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
export const superhogStatusEnum = pgEnum("superhog_status", [
  "Approved",
  "Flagged",
  "Rejected",
  "Pending",
  "null",
]);

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  echoToken: uuid("echo_token"),
  propertyId: integer("property_id"), // relation to properties
  userId: integer("user_id"), //relation to users table
  checkIn: date("check_in"),
  checkOut: date("check_out"),
  propertyAddress: varchar("property_address", { length: 100 }),
  propertyTown: varchar("property_town", { length: 100 }),
  propertyCountryIso: varchar("property_country_iso", { length: 4 }),
  superhogVerificicationId: varchar("superhog_verification_id", {
    length: 100,
  }),

  superhogStatus: superhogStatusEnum("superhog_status").default("null"),
});

export type Reservation = typeof reservations.$inferSelect;
export const reservationSelectSchema = createSelectSchema(reservations);
export const reservationInsertSchema = createInsertSchema(reservations);
