import { relations } from "drizzle-orm";
import { accounts } from "./tables/auth/accounts";
import { sessions } from "./tables/auth/sessions";
import { bids } from "./tables/bids";
import {
  bucketListDestinations,
  bucketListProperties,
} from "./tables/bucketList";
import { counters } from "./tables/counters";
import { groupInvites, groupMembers, groups } from "./tables/groups";
import { hostProfiles } from "./tables/hostProfiles";
import {
  hostTeamInvites,
  hostTeamMembers,
  hostTeams,
} from "./tables/hostTeams";
import {
  conversationParticipants,
  conversations,
  messages,
} from "./tables/messages";
import { emergencyContacts } from "./tables/emergencyContacts";
import { offers } from "./tables/offers";
import { bookedDates, properties } from "./tables/properties";
import { requestGroups, requests } from "./tables/requests";
import { requestsToProperties } from "./tables/requestsToProperties";
import { reservedDates } from "./tables/reservedDates";
import { superhogRequests } from "./tables/superhogRequests";
import { referralCodes, referralEarnings, users } from "./tables/users";
import { trips } from "./tables/trips";
import { reviews } from "./tables/reviews";
import { superhogErrors } from "./tables/superhogErrors";

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  referralCode: one(referralCodes), // the one they own, not the one used at signup
  propertiesOwned: many(properties),
  referralEarnings: many(referralEarnings),
  messages: many(messages),
  conversations: many(conversationParticipants),
  hostProfile: one(hostProfiles),
  groups: many(groupMembers),
  ownedGroups: many(groups),
  requestGroupsCreated: many(requestGroups),
  reservedDates: many(reservedDates),
  hostTeams: many(hostTeamMembers),
  bids: many(bids),
  superhogRequests: many(superhogRequests),
  bucketListDestinations: many(bucketListDestinations),
  bucketListProperties: many(bucketListProperties),
  emergencyContacts: many(emergencyContacts),
  superHogErrors: many(superhogErrors),
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
  owner: one(users, {
    fields: [referralCodes.ownerId],
    references: [users.id],
  }),
}));

export const hostProfilesRelations = relations(hostProfiles, ({ one }) => ({
  hostUser: one(users, {
    fields: [hostProfiles.userId],
    references: [users.id],
  }),
  curTeam: one(hostTeams, {
    fields: [hostProfiles.curTeamId],
    references: [hostTeams.id],
  }),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  host: one(users, {
    fields: [properties.hostId],
    references: [users.id],
  }),
  hostTeam: one(hostTeams, {
    fields: [properties.hostTeamId],
    references: [hostTeams.id],
  }),
  offers: many(offers),
  requestsToProperties: many(requestsToProperties),
  bids: many(bids),
  bookedDates: many(bookedDates),
  superhogRequests: many(superhogRequests),
  reviews: many(reviews),
  superhogErrors: many(superhogErrors),
}));

export const bookedDatesRelations = relations(bookedDates, ({ one }) => ({
  property: one(properties, {
    fields: [bookedDates.propertyId],
    references: [properties.id],
  }),
}));

export const requestsRelations = relations(requests, ({ one, many }) => ({
  madeByGroup: one(groups, {
    fields: [requests.madeByGroupId],
    references: [groups.id],
  }),
  requestGroup: one(requestGroups, {
    fields: [requests.requestGroupId],
    references: [requestGroups.id],
  }),
  offers: many(offers),
  requestsToProperties: many(requestsToProperties),
}));

export const bidsRelations = relations(bids, ({ one, many }) => ({
  madeByGroup: one(groups, {
    fields: [bids.madeByGroupId],
    references: [groups.id],
  }),
  property: one(properties, {
    fields: [bids.propertyId],
    references: [properties.id],
  }),
  counters: many(counters),
}));

export const countersRelations = relations(counters, ({ one }) => ({
  bid: one(bids, {
    fields: [counters.bidId],
    references: [bids.id],
  }),
  property: one(properties, {
    fields: [counters.propertyId],
    references: [properties.id],
  }),
}));

export const requestGroupsRelations = relations(
  requestGroups,
  ({ one, many }) => ({
    requests: many(requests),
    createdByUser: one(users, {
      fields: [requestGroups.createdByUserId],
      references: [users.id],
    }),
  }),
);

export const requestsToPropertiesRelations = relations(
  requestsToProperties,
  ({ one }) => ({
    request: one(requests, {
      fields: [requestsToProperties.requestId],
      references: [requests.id],
    }),
    property: one(properties, {
      fields: [requestsToProperties.propertyId],
      references: [properties.id],
    }),
  }),
);

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
  referee: one(users, {
    fields: [referralEarnings.refereeId],
    references: [users.id],
  }),
  offer: one(offers, {
    fields: [referralEarnings.offerId],
    references: [offers.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
  participants: many(conversationParticipants),
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

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),
  }),
);

export const groupsRelations = relations(groups, ({ one, many }) => ({
  owner: one(users, {
    fields: [groups.ownerId],
    references: [users.id],
  }),
  members: many(groupMembers),
  invites: many(groupInvites),
  requests: many(requests),
  offers: many(offers),
  bids: many(bids),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const groupInviteRelations = relations(groupInvites, ({ one }) => ({
  group: one(groups, {
    fields: [groupInvites.groupId],
    references: [groups.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  property: one(properties, {
    fields: [reviews.propertyId],
    references: [properties.id],
  }),
}));

export const hostTeamsRelations = relations(hostTeams, ({ one, many }) => ({
  owner: one(users, {
    fields: [hostTeams.ownerId],
    references: [users.id],
  }),
  members: many(hostTeamMembers),
  invites: many(hostTeamInvites),
  properties: many(properties),
}));

export const hostTeamMembersRelations = relations(
  hostTeamMembers,
  ({ one }) => ({
    hostTeam: one(hostTeams, {
      fields: [hostTeamMembers.hostTeamId],
      references: [hostTeams.id],
    }),
    user: one(users, {
      fields: [hostTeamMembers.userId],
      references: [users.id],
    }),
  }),
);

export const hostTeamInviteRelations = relations(
  hostTeamInvites,
  ({ one }) => ({
    hostTeam: one(hostTeams, {
      fields: [hostTeamInvites.hostTeamId],
      references: [hostTeams.id],
    }),
  }),
);

export const superhogRequestsRelations = relations(
  superhogRequests,
  ({ one, many }) => ({
    property: one(properties, {
      fields: [superhogRequests.propertyId],
      references: [properties.id],
    }),
    user: one(users, {
      fields: [superhogRequests.userId],
      references: [users.id],
    }),
    trip: many(trips),
  }),
);

export const superhogErrorsRelations = relations(superhogErrors, ({ one }) => ({
  user: one(users, {
    fields: [superhogErrors.userId],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [superhogErrors.tripId],
    references: [trips.id],
  }),
  property: one(properties, {
    fields: [superhogErrors.propertiesId],
    references: [properties.id],
  }),
}));

export const bucketListDestinationsRelations = relations(
  bucketListDestinations,
  ({ one }) => ({
    user: one(users, {
      fields: [bucketListDestinations.userId],
      references: [users.id],
    }),
  }),
);

export const bucketListPropertiesRelations = relations(
  bucketListProperties,
  ({ one }) => ({
    user: one(users, {
      fields: [bucketListProperties.userId],
      references: [users.id],
    }),
    property: one(properties, {
      fields: [bucketListProperties.propertyId],
      references: [properties.id],
    }),
  }),
);

export const tripsRelations = relations(trips, ({ one, many }) => ({
  group: one(groups, {
    fields: [trips.groupId],
    references: [groups.id],
  }),
  property: one(properties, {
    fields: [trips.propertyId],
    references: [properties.id],
  }),
  offer: one(offers, {
    fields: [trips.offerId],
    references: [offers.id],
  }),
  bid: one(bids, {
    fields: [trips.bidId],
    references: [bids.id],
  }),
  superhogRequests: one(superhogRequests, {
    fields: [trips.superhogRequestId],
    references: [superhogRequests.id],
  }),
  superhogErrors: many(superhogErrors),
}));

export const emergencyContactsRelations = relations(
  emergencyContacts,
  ({ one }) => ({
    users: one(users, {
      fields: [emergencyContacts.userId],
      references: [users.id],
    }),
  }),
);
