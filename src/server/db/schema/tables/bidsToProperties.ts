import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { bids } from "./bids";
import { properties } from "./properties";

export const bidsToProperties = pgTable(
  "bids_to_properties",
  {
    bidId: integer("bid_id")
      .notNull()
      .references(() => bids.id, { onDelete: "cascade" }),
    propertyId: integer("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.bidId, t.propertyId] }),
  }),
);
