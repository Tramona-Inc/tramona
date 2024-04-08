import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const hostTeams = pgTable("host_teams", {
  id: serial("id").primaryKey(),
  name: text("name"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

export const hostTeamMembers = pgTable(
  "host_team_members",
  {
    hostTeamId: integer("host_team_id")
      .notNull()
      .references(() => hostTeams.id),
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
      .references(() => hostTeams.id),
    inviteeEmail: text("invitee_email").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.hostTeamId, vt.inviteeEmail] }),
  }),
);
