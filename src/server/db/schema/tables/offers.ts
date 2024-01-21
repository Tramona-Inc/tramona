import {
  serial,
  integer,
  pgTable,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { requests } from "./requests";
import { properties } from "./properties";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const offers = pgTable(
  "offers",
  {
    id: serial("id").primaryKey(),
    requestId: integer("request_id")
      .notNull()
      .references(() => requests.id),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id),
    totalPrice: integer("total_price").notNull(), // in cents
    createdAt: timestamp("created_at").notNull().defaultNow(),
    madePublicAt: timestamp("made_public_at"),
    acceptedAt: timestamp("accepted_at"),
  },
  (t) => ({
    madePublicAtIndex: index("made_public_at_index").on(t.madePublicAt),
    acceptedAtIndex: index("accepted_at_index").on(t.acceptedAt),
  }),
);

export type Offer = typeof offers.$inferSelect;
export const offerSelectSchema = createSelectSchema(offers);
export const offerInsertSchema = createInsertSchema(offers);
