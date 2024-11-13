import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { requests } from "./requests";
import { hostTeams } from "./hostTeams";

export const rejectedRequests = pgTable(
  "rejected_requests",
  {
    requestId: integer("request_id")
      .notNull()
      .references(() => requests.id, { onDelete: "cascade" }),
    hostTeamId: integer("host_team_id")
      .notNull()
      .references(() => hostTeams.id, { onDelete: "cascade" }),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.requestId, t.hostTeamId] }),
  }),
);
