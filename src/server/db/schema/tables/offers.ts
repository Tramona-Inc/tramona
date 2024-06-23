import {
  date,
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
import { groups } from "./groups";

export const offers = pgTable(
  "offers",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    requestId: integer("request_id").references(() => requests.id, {
      onDelete: "set null",
    }),
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
    checkIn: date("check_in", { mode: "date" }).notNull(),
    checkOut: date("check_out", { mode: "date" }).notNull(),
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

///////////////////////////// intermediate schema ///////////////////////////

// import {
//   date,
//   index,
//   integer,
//   pgTable,
//   serial,
//   timestamp,
//   varchar,
// } from "drizzle-orm/pg-core";
// import { createInsertSchema, createSelectSchema } from "drizzle-zod";
// import { properties } from "./properties";
// import { requests } from "./requests";
// import { groups } from "./groups";

// export const offers = pgTable(
//   "offers",
//   {
//     id: serial("id").primaryKey(),
//     groupId: integer("group_id")
//       .references(() => groups.id, { onDelete: "cascade" }),
//     requestId: integer("request_id").references(() => requests.id, {
//       onDelete: "set null",
//     }),
//     propertyId: integer("property_id")
//       .notNull()
//       .references(() => properties.id, { onDelete: "cascade" }),
//     totalPrice: integer("total_price").notNull(), // in cents
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     madePublicAt: timestamp("made_public_at"),
//     acceptedAt: timestamp("accepted_at"),
//     paymentIntentId: varchar("payment_intent_id"),
//     checkoutSessionId: varchar("checkout_session_id"),
//     tramonaFee: integer("tramona_fee").notNull().default(0), // in cents
//     checkIn: date("check_in", { mode: "date" }),
//     checkOut: date("check_out", { mode: "date" }),
//   },
//   (t) => ({
//     madePublicAtIndex: index().on(t.madePublicAt),
//     acceptedAtIndex: index().on(t.acceptedAt),
//     requestidIdx: index().on(t.requestId),
//     propertyidIdx: index().on(t.propertyId),
//   }),
// );

// export type Offer = typeof offers.$inferSelect;
// export const offerSelectSchema = createSelectSchema(offers);
// export const offerInsertSchema = createInsertSchema(offers);

// // make everything except id optional
// export const offerUpdateSchema = offerInsertSchema.partial().required({
//   id: true,
// });
