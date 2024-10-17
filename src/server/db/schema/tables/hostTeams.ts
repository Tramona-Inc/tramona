import {
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const COHOST_ROLES = ["Strict", "Medium", "Loose"] as const;
export const hostPermissionEnum = pgEnum("coHostRole", COHOST_ROLES);

export const hostTeams = pgTable(
  "host_teams",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    owneridIdx: index().on(t.ownerId),
  }),
);

export type HostTeam = typeof hostTeams.$inferSelect;

export const hostTeamMembers = pgTable(
  "host_team_members",
  {
    hostTeamId: integer("host_team_id")
      .notNull()
      .references(() => hostTeams.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    permission: hostPermissionEnum("permission").default("Strict"),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.hostTeamId, vt.userId] }),
  }),
);

export const hostTeamInvites = pgTable(
  "host_team_invites",
  {
    id: text("id").notNull().primaryKey(),
    hostTeamId: integer("host_team_id")
      .notNull()
      .references(() => hostTeams.id, { onDelete: "cascade" }),
    inviteeEmail: text("invitee_email").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastSentAt: timestamp("last_sent_at", { withTimezone: true }).notNull(),
  },
  (t) => ({
    hostTeamidIdx: index().on(t.hostTeamId),
  }),
);
