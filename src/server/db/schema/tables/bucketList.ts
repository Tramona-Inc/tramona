import {
  date,
  integer,
  pgTable,
  serial,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { properties } from "./properties";
import { createSelectSchema } from "drizzle-zod";
import { zodNumber, zodString } from "@/utils/zod-utils";
import { z } from "zod";

export const bucketListDestinations = pgTable("bucket_list_destinations", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  location: varchar("location").notNull(),
  plannedCheckIn: date("planned_check_in", { mode: "date" }).notNull(),
  plannedCheckOut: date("planned_check_out", { mode: "date" }).notNull(),
});

export const bucketListProperties = pgTable("bucket_list_properties", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
});

export type BucketListDestination = typeof bucketListDestinations.$inferSelect;
export type NewBucketListDestination =
  typeof bucketListDestinations.$inferInsert;

export const BucketListDestinationSelectSchema = createSelectSchema(
  bucketListDestinations,
);

export const ProfileInfoSchema = z.object({
  name: zodString(),
  about: zodString({ maxLen: 1000 }),
  location: zodString(),
  facebook_link: z
    .string()
    .url()
    .startsWith("https://www.facebook.com/", "Must be a Facebook link")
    .optional()
    .or(z.literal("")),
  youtube_link: z
    .string()
    .url()
    .startsWith("https://www.youtube.com/", "Must be a YouTube link")
    .optional()
    .or(z.literal("")),
  instagram_link: z
    .string()
    .url()
    .startsWith("https://www.instagram.com/", "Must be a Instagram link")
    .optional()
    .or(z.literal("")),
  twitter_link: z
    .string()
    .url()
    .startsWith("https://x.com/", "Must be a Twitter link")
    .optional()
    .or(z.literal("")),
});

export const BucketListPropertySchema =
  createSelectSchema(bucketListProperties);
