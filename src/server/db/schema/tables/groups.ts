import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// we cant tie groups to requests directly,
// because we will have request-less offers soon

// so to create a request, you first need to create a group,
// then make the request "created by" that group

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
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
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.groupId, t.userId] }),
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
