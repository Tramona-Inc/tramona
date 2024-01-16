import { pgTable, text, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { REFERRAL_CODE_LENGTH } from "./referralCodes";

export const ALL_ROLES = ["guest", "host", "admin"] as const;

export const roleEnum = pgEnum("role", ALL_ROLES);

export const users = pgTable("user", {
  // nextauth fields
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  // custom fields
  referralCodeUsed: varchar("referral_code_used", {
    length: REFERRAL_CODE_LENGTH,
  }),
  role: roleEnum("role").notNull().default("guest"),
});
