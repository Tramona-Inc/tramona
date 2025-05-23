import {
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { sql } from "drizzle-orm";

export const COHOST_ROLES = [
  "Match Manager",
  "Listing Manager",
  "Co-Host",
  "Admin Access",
] as const;

export const cohostRoleEnum = pgEnum("cohost_role", COHOST_ROLES);
export type CoHostRole = (typeof COHOST_ROLES)[number];

export const hostTeams = pgTable(
  "host_teams",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    hasOfferPercentage: boolean("has_offer_percentage").notNull().default(false),
  },
  (t) => ({
    owneridIdx: index().on(t.ownerId),
    nameIdx: index("host_teams_name_idx").on(t.name),
    createdAtIdx: index("host_teams_created_at_idx").on(t.createdAt), // Consider adding
  }),
);

export type HostTeam = typeof hostTeams.$inferSelect;

export const hostTeamMembers = pgTable(
  //this will double, as keeping track of the members within a team, and all of the teams a member belongs to.
  "host_team_members",
  {
    hostTeamId: integer("host_team_id")
      .notNull()
      .references(() => hostTeams.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: cohostRoleEnum("role").notNull().default("Admin Access"),
    addedAt: timestamp("added_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.hostTeamId, vt.userId] }),
    teamRoleIdx: index("host_team_members_team_role_idx").on(
      vt.hostTeamId,
      vt.role,
    ),
    userIdIdx: index("host_team_member_user_id_idx").on(vt.userId),
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
    role: cohostRoleEnum("role").notNull().default("Admin Access"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastSentAt: timestamp("last_sent_at", { withTimezone: true }).notNull(),
  },
  (t) => ({
    hostTeamidIdx: index().on(t.hostTeamId),
    inviteeEmailIdx: index("host_team_invites_email_idx").on(t.inviteeEmail),
    expiresAtIdx: index("host_team_invites_expires_at_idx").on(t.expiresAt),
    activeInvitesExpiresAtIdx: index("host_team_invites_active_expires_at_idx") // Partial index
      .on(t.expiresAt)
      .where(sql`${t.expiresAt} > NOW()`), // Condition for active invites
  }),
);
