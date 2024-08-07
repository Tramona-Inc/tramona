import {
  integer,
  pgTable,
  primaryKey,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { superhogRequests } from "./superhogRequests";
import { trips } from "./trips";
import { superhogErrorAction } from "./superhogErrors";

export const superhogActionOnTrips = pgTable(
  "superhog_action_on_trips",
  {
    id: integer("id").primaryKey(),
    tripId: integer("trip_id").references(() => trips.id),
    createdAt: timestamp("created_at", { withTimezone: true }),
    action: superhogErrorAction("action").default("create").notNull(),
    superhogRequestId: integer("superhog_request_id").references(
      () => superhogRequests.id,
    ),
  },
  (t) => ({
    tripIdIdx: index().on(t.tripId),
    superhogRequestIdIdx: index().on(t.superhogRequestId),
  }),
);
