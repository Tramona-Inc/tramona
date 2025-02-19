import {
  pgTable,
  serial,
  text,
  index,
  geometry,
  integer,
} from "drizzle-orm/pg-core";
import { warmLeads } from "./warmLeads";
export const cities = pgTable(
  "cities",
  {
    id: serial("id").primaryKey(),
    name: text("name"),
    stateCode: text("state_code"),
    country: text("country"),
    latLngPoint: geometry("lat_lng_point", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }),
    warmLeadId: integer("warm_lead_id").references(() => warmLeads.id),
  },
  (table) => {
    return {
      cityIdx: index("cities_city_idx").on(table.name),
    };
  },
);

export type City = typeof cities.$inferSelect;

export type CityInsert = typeof cities.$inferInsert;

