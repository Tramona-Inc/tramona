import {
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { properties } from "./properties";
import { nanoid } from "nanoid";
import { offers } from "./offers";
import { requestsToBook } from "./requestsToBook";
import { trips } from "./trips";

export const propertyConversations = pgTable(
  "property_conversations",
  {
    id: varchar("id", { length: 21 }).primaryKey().$defaultFn(nanoid),
    travelerId: text("traveler_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),

    // optional because the conversation may not have been created from an offer, request, or trip,
    // they let us display relevant information in the conversation sidebar
    offerId: integer("offer_id").references(() => offers.id, {
      onDelete: "set null",
    }),
    requestToBookId: integer("request_to_book_id").references(
      () => requestsToBook.id,
      { onDelete: "set null" },
    ),
    tripId: integer("trip_id").references(() => trips.id, {
      onDelete: "set null",
    }),

    // and if they havent gotten an offer or anything yet, they can still express that theyre
    // interested in some dates and have some number of guests
    plannedCheckIn: date("planned_check_in", { mode: "date" }),
    plannedCheckOut: date("planned_check_out", { mode: "date" }),
    plannedNumGuests: integer("planned_num_guests"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    conversationIdIdx: uniqueIndex().on(t.travelerId, t.propertyId),
    propertyIdIdx: index().on(t.propertyId),
  }),
);

export const propertyMessages = pgTable(
  "property_messages",
  {
    id: varchar("id", { length: 21 }).primaryKey().$defaultFn(nanoid),
    conversationId: varchar("conversation_id", { length: 21 })
      .notNull()
      .references(() => propertyConversations.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    editedAt: timestamp("edited_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    authorIdIdx: index().on(t.authorId),
    createdAtIdx: index().on(t.createdAt),
  }),
);
