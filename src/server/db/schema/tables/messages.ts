import {
  boolean,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
  real,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./users";

export const conversations = pgTable("conversations", {
  id: varchar("id", { length: 21 }).primaryKey().$defaultFn(nanoid),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  offerId: varchar("offer_id"),
});

export const messages = pgTable(
  "messages",
  {
    id: varchar("id", { length: 21 }).primaryKey().$defaultFn(nanoid),
    conversationId: varchar("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    message: varchar("message", { length: 1500 }).notNull(),
    read: boolean("read").default(false),
    isEdit: boolean("is_edit").default(false),
    createdAt: timestamp(
      "created_at",
      { withTimezone: true, mode: "string" },
    )
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    conversationidIdx: index().on(t.conversationId),
    useridIdx: index().on(t.userId),
  }),
);

export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    conversationId: varchar("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.conversationId, t.userId] }),
  }),
);

// added for flagged messages
export const flaggedMessages = pgTable(
  "flagged_messages",
  {
    id: varchar("id", { length: 21 }).primaryKey().$defaultFn(nanoid),
    conversationId: varchar("conversation_id", { length: 21 })
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    confidence: real("confidence").notNull(), // Change from decimal to float
    violationType: varchar("violation_type", {
      enum: ["OFF_PLATFORM_BOOKING", "CONTACT_INFO", "INAPPROPRIATE", "UNKNOWN"], // Ensure UNKNOWN is included
    }).notNull(),
    message: varchar("message", { length: 1500 }).notNull(),
    reason: text("reason"),
    // possibly later add for admin message check
    //  status: varchar("status", {
    //    enum: ["PENDING", "REVIEWED", "DISMISSED"],
    //  }).default("PENDING"),
    //  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    // reviewedBy: text("reviewed_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    conversationidIdx: index().on(t.conversationId),
    useridIdx: index().on(t.userId),
  }),
);


export type MessageType = typeof messages.$inferSelect;
export type FlaggedMessageType = typeof flaggedMessages.$inferSelect;
