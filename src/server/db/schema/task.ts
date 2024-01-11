import { relations, sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  index,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `tramona-trpc_${name}`);

export const tasks = pgTable(
  "task",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    task: varchar("task", { length: 256 }),
    isCompleted: boolean("isCompleted").default(false),
    createdById: varchar("createdById", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("timestamp4").default(sql`now()`),
  },
  (example) => ({
    createdByIdIdx: index("task_createdById_idx").on(example.createdById),
    isCompletedIdx: index("task_isCompleted_idx").on(example.isCompleted),
    taskIndex: index("task_task_idx").on(example.task),
  }),
);
