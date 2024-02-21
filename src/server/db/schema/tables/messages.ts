import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversations.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    message: varchar("message", { length: 1500 }).notNull(),
    read: boolean("read").default(false),
    isEdit: boolean("is_edit").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    conversationIndex: index("conversationIndex").on(t.conversationId),
    userIndex: index("userIndex").on(t.userId),
  }),
);

export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversations.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.conversationId, vt.userId] }),
  }),
);
