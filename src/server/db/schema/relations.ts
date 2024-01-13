import { relations } from "drizzle-orm";
import {
  accounts,
  referralCodes,
  sessions,
  users,
  requests,
  offers,
  properties,
} from "./tables";

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  propertiesOwned: many(properties),
  requestsMade: many(requests),
  referralCode: one(referralCodes), // the one they own, not the one used at signup
}));

export const requestsRelations = relations(requests, ({ one, many }) => ({
  madeByUser: one(users),
  offers: many(offers),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  property: one(properties),
}));

export const propertiesRelations = relations(properties, ({ one }) => ({
  host: one(users),
}));
