import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./users";
import { hostTeams } from "./hostTeams";
import { properties } from "./properties";
import { requests } from "./requests";

export const conversations = pgTable("conversations", {
  id: varchar("id", { length: 21 }).primaryKey().$defaultFn(nanoid),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  offerId: varchar("offer_id"),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "cascade" }),
  requestId: integer("request_id").references(() => requests.id, { onDelete: "cascade" }),
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
    hostTeamId: integer("host_team_id")
      .references(() => hostTeams.id, { onDelete: "cascade" }),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.conversationId, t.userId] }),
  }),
);

export type MessageType = typeof messages.$inferSelect;
