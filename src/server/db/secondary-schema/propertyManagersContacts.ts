import {
  pgTable,
  serial,
  text,
  index,
  geometry,
  timestamp,
} from "drizzle-orm/pg-core";

export const propertyManagerContacts = pgTable(
  "property_manager_contacts",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    email: text("email").array(), // Changed to array of text
    phoneNumber: text("phone_number").array(), // Changed to array of text
    city: text("city"),
    state: text("state"),
    url: text("url"),
    link: text("link"),
    thoughts: text("thoughts"),
    latLngPoint: geometry("lat_lng_point", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }),
    lastEmailSentAt: timestamp("last_email_sent_at", { withTimezone: true }),
  },
  (table) => {
    return {
      cityIdx: index("property_manager_contacts_city_idx").on(table.city),
    };
  },
);

export type PropertyManagerContact =
  typeof propertyManagerContacts.$inferSelect;

export type PropertyManagerContactInsert =
  typeof propertyManagerContacts.$inferInsert;
