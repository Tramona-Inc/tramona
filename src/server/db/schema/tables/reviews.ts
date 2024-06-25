import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    profilePic: varchar("profile_pic").notNull(),
    rating: integer("rating").notNull(),
    review: text("review").notNull(),
  },
);

export const reviewsSelectSchema = createSelectSchema(reviews);
export const reviewsInsertSchema = createInsertSchema(reviews, {
  profilePic: z.string().url(),
  rating: z.number().int().min(1).max(5),
});

// make everything except id optional
export const reviewsUpdateSchema = reviewsInsertSchema.partial().required({
  id: true,
});