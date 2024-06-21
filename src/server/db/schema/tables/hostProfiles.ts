import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { hostTeams } from "./hostTeams";

export const ALL_HOST_TYPES = ["airbnb", "direct", "vrbo", "other"] as const;

export const hostTypeEnum = pgEnum("host_type", ALL_HOST_TYPES);

export const hostProfiles = pgTable(
  "host_profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    // type: hostTypeEnum("type").notNull().default("other"),
    // profileUrl: varchar("profile_url", { length: 1000 }),
    becameHostAt: timestamp("became_host_at").notNull().defaultNow(),
    stripeAccountId: varchar("stripeAccountId"),
    chargesEnabled: boolean("charges_enabled").default(false),
    hostawayApiKey: varchar("hostaway_api_key"),
    hostawayAccountId: varchar("hostaway_account_id"),
    hostawayBearerToken: varchar("hostaway_bearer_token"),
    curTeamId: integer("cur_team_id")
      .notNull()
      .references(() => hostTeams.id),
  },
  (t) => ({
    curTeamidIdx: index().on(t.curTeamId),
  }),
);

export type HostProfile = typeof hostProfiles.$inferSelect;
