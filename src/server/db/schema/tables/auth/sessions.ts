import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users";

export const sessions = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => ({
    userIdIdx: index().on(t.userId),
  }),
);
