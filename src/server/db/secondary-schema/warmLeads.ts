import {
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const warmLeads = pgTable(
  "warm_leads",
  {
    id: serial("id").primaryKey(),
    email: text("email"), // Changed to array of text
    lastEmailSentAt: timestamp("last_email_sent_at", { withTimezone: true }),
  },
);

export type WarmLead = typeof warmLeads.$inferSelect;

export type WarmLeadInsert = typeof warmLeads.$inferInsert;

