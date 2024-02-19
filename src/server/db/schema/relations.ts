import { relations } from "drizzle-orm";
import { accounts } from "./tables/auth/accounts";
import { sessions } from "./tables/auth/sessions";
import { conversations, messages } from "./tables/messages";
import { offers } from "./tables/offers";
import { properties } from "./tables/properties";
import { requests } from "./tables/requests";
import { referralCodes, referralEarnings, users } from "./tables/users";

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  referralCode: one(referralCodes), // the one they own, not the one used at signup
  propertiesOwned: many(properties),
  requestsMade: many(requests),
  referralEarnings: many(referralEarnings),
  conversations: many(conversations),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const referralCodesRelations = relations(referralCodes, ({ one }) => ({
  user: one(users, {
    fields: [referralCodes.ownerId],
    references: [users.id],
  }),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  host: one(users, {
    fields: [properties.hostId],
    references: [users.id],
  }),
  offers: many(offers),
}));

export const requestsRelations = relations(requests, ({ one, many }) => ({
  madeByUser: one(users, {
    fields: [requests.userId],
    references: [users.id],
  }),
  offers: many(offers),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  property: one(properties, {
    fields: [offers.propertyId],
    references: [properties.id],
  }),
  request: one(requests, {
    fields: [offers.requestId],
    references: [requests.id],
  }),
}));

export const earningsRelations = relations(referralEarnings, ({ one }) => ({
  refereeId: one(users, {
    fields: [referralEarnings.refereeId],
    references: [users.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));
