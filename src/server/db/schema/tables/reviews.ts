import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  profilePic: varchar("profile_pic"),
  rating: integer("rating").notNull(),
  review: text("review").notNull(),
});

export type Review = Omit<typeof reviews.$inferSelect, "id" | "propertyId">;
export type NewReview = Omit<typeof reviews.$inferInsert, "id" | "propertyId">;

export const reviewsInsertSchema = createInsertSchema(reviews, {
  profilePic: z.string().url(),
  rating: z.number().int().min(1).max(5),
});

// make everything except id optional
export const reviewsUpdateSchema = reviewsInsertSchema.partial().required({
  id: true,
});
