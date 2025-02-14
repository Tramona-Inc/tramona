import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  email: text("email"),
  city: text("city"),
  state: text("state"),
  url: text("url"),
  propertyManagerName: text("property_manager_name"),
});
