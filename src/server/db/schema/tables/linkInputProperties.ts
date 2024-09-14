import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { listingSiteEnum } from "../common";
import { createInsertSchema } from "drizzle-zod";

export const linkInputProperties = pgTable("link_input_properties", {
  id: serial("id").primaryKey(),
  listingSite: listingSiteEnum("listing_site").notNull(),
  url: varchar("url").notNull(),
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  imageUrl: varchar("image_url").notNull(),
});

export type LinkInputProperty = Omit<
  typeof linkInputProperties.$inferSelect,
  "id"
>;

export const linkInputPropertyInsertSchema =
  createInsertSchema(linkInputProperties);
