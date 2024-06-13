import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { properties } from "./properties";
import { requests } from "./requests";

export const offers = pgTable(
  "offers",
  {
    id: serial("id").primaryKey(),
    requestId: integer("request_id")
      .notNull()
      .references(() => requests.id, { onDelete: "cascade" }),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    totalPrice: integer("total_price").notNull(), // in cents
    createdAt: timestamp("created_at").notNull().defaultNow(),
    madePublicAt: timestamp("made_public_at"),
    acceptedAt: timestamp("accepted_at"),
    paymentIntentId: varchar("payment_intent_id"),
    checkoutSessionId: varchar("checkout_session_id"),
    tramonaFee: integer("tramona_fee").notNull().default(0), // in cents
    //fromUnclaimedOffers: boolean("from_unclaimed_offers_form").default(false),
  },
  (t) => ({
    madePublicAtIndex: index().on(t.madePublicAt),
    acceptedAtIndex: index().on(t.acceptedAt),
    requestidIdx: index().on(t.requestId),
    propertyidIdx: index().on(t.propertyId),
  }),
);

export type Offer = typeof offers.$inferSelect;
export const offerSelectSchema = createSelectSchema(offers);
export const offerInsertSchema = createInsertSchema(offers);

// make everything except id optional
export const offerUpdateSchema = offerInsertSchema.partial().required({
  id: true,
});
