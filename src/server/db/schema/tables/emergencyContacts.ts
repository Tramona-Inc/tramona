import { index, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const emergencyContacts = pgTable(
  "emergency_contacts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    emergencyEmail: varchar("email").notNull(),
    emergencyPhone: varchar("phone").notNull(),
  },
  (table) => {
    return {
      userIndex: index("emergency_contacts_user_id_idx").on(table.userId),
    };
  },
);

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
