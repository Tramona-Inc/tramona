import { pgTable, text, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const phoneNumberOTPs = pgTable("phone_number_otps", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull(),
  verificationSid: text("verification_sid").notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
