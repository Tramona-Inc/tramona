import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const fakeRequests = pgTable("fake_requests", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  lastSent: timestamp("last_sent", { withTimezone: true }).notNull().defaultNow(),
});

export type FakeRequest = typeof fakeRequests.$inferSelect;
export type NewFakeRequest = typeof fakeRequests.$inferInsert;
