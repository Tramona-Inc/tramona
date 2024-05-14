import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { requests } from "./requests";
import { properties } from "./properties";

export const requestsToProperties = pgTable(
  "requests_to_properties",
  {
    requestId: integer("request_id")
      .notNull()
      .references(() => requests.id, { onDelete: "cascade" }),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.requestId, t.propertyId] }),
  }),
);
