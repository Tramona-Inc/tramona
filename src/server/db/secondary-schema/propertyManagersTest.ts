import { pgTable, serial, text, index, geometry } from "drizzle-orm/pg-core";

export const propertyManagerContacts = pgTable(
  "property_manager_contacts",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    email: text("email"),
    phoneNumber: text("phone_number"),
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
