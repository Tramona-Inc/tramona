import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const conversationTypeEnum = pgEnum("conversation_type", [
  "single",
  "group",
]);

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  conversationType: conversationTypeEnum("conversation_type"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("offers", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversations.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: varchar("message", { length: 1500 }).notNull(),
  isEdit: boolean("is_edit").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
