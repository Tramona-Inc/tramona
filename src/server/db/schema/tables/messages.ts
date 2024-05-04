import {
  boolean,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./users";

export const conversations = pgTable("conversations", {
  id: varchar("id", { length: 21 }).primaryKey().$defaultFn(nanoid),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  offerId: varchar("offer_id"),
});

export const messages = pgTable(
  "messages",
  {
    id: varchar("id", { length: 21 }).primaryKey().$defaultFn(nanoid),
    conversationId: varchar("conversation_id")
      .notNull()
      .references(() => conversations.id),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    message: varchar("message", { length: 1500 }).notNull(),
    read: boolean("read").default(false),
    isEdit: boolean("is_edit").default(false),
    createdAt: timestamp("created_at", { mode: "string" })
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
      .references(() => conversations.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
  },
  (tt) => ({
    compoundKey: primaryKey({ columns: [tt.conversationId, tt.userId] }),
  }),
);

export type MessageType = typeof messages.$inferSelect;
