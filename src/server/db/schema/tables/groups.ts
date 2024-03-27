import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// might add names to groups later, but for now, id is all we need

// i know it seems weird, but we cant tie groups to requests directly,
// because we will have request-less offers soon

// so right now every request will create a group, and offers for that
// request will be tied to that group

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").references(() => users.id),
});

export const groupMembers = pgTable(
  "group_members",
  {
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isOwner: boolean("is_owner").notNull().default(false),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.groupId, vt.userId] }),
  }),
);

export const groupInvites = pgTable(
  "group_invites",
  {
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id),
    inviteeEmail: text("invitee_email").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.groupId, vt.inviteeEmail] }),
  }),
);
