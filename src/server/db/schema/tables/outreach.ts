import { pgTable, serial, text, index, geometry } from "drizzle-orm/pg-core";

export const propertyManagerContacts = pgTable(
  "property_manager_contacts",
  {
    id: serial("id").primaryKey(),
    email: text("email"),
    city: text("city"),
    state: text("state"),
    url: text("url"),
    propertyManagerName: text("property_manager_name"),
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
