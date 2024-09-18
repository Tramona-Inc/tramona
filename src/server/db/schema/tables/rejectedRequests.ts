import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { requests } from "./requests";
import { users } from "./users";

export const rejectedRequests = pgTable(
  "rejected_requests",
  {
    requestId: integer("request_id")
      .notNull()
      .references(() => requests.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.requestId, t.userId] }),
  }),
);
