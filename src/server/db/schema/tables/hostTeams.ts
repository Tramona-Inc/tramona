import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const hostTeams = pgTable(
  "host_teams",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id),
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
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.hostTeamId, vt.userId] }),
  }),
);

export const hostTeamInvites = pgTable(
  "host_team_invites",
  {
    hostTeamId: integer("host_team_id")
      .notNull()
      .references(() => hostTeams.id, { onDelete: "cascade" }),
    inviteeEmail: text("invitee_email").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.hostTeamId, t.inviteeEmail] }),
    hostTeamidIdx: index().on(t.hostTeamId),
  }),
);
