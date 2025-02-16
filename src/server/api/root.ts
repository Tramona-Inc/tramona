import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/authRouter";
import { biddingRouter } from "./routers/biddingRouter";
import { emailRouter } from "./routers/emailRouter";
import { filesRouter } from "./routers/filesRouter";
import { groupsRouter } from "./routers/groupsRouter";
import { messagesRouter } from "./routers/messagesRouter";
import { miscRouter } from "./routers/miscRouter";
import { tripsRouter } from "./routers/tripsRouter";
import { offersRouter } from "./routers/offersRouter";
import { propertiesRouter } from "./routers/propertiesRouter";
import { referralCodesRouter } from "./routers/referralCodesRouter";
import { requestsRouter } from "./routers/requestsRouter";
import { stripeRouter } from "./routers/stripeRouter";
import { twilioRouter } from "./routers/twilioRouter";
import { usersRouter } from "./routers/usersRouter";
import { hostsRouter } from "./routers/hostsRouter";
import { hostTeamsRouter } from "./routers/hostTeamsRouter";
import { profileRouter } from "./routers/profileRouter";
import { superhogRouter } from "./routers/superhogRouter";
import { pmsRouter } from "./routers/pmsRouter";
import { reviewsRouter } from "./routers/reviewsRouter";
import { feedRouter } from "./routers/feedRouter";
import { calendarRouter } from "./routers/calendarRouter";
import { requestsToBookRouter } from "./routers/requestsToBookRouter";
import { claimsRouter } from "./routers/claimsRouter";
import { propertyMessagesRouter } from "./routers/propertyMessagesRouter";
import { outreachRouter } from "./routers/outreachRouter";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  biddings: biddingRouter,
  calendar: calendarRouter,
  claims: claimsRouter,
  emails: emailRouter,
  feed: feedRouter,
  files: filesRouter,
  groups: groupsRouter,
  hostTeams: hostTeamsRouter,
  hosts: hostsRouter,
  messages: messagesRouter,
  misc: miscRouter,
  offers: offersRouter,
  outreach: outreachRouter,
  pms: pmsRouter,
  profile: profileRouter,
  properties: propertiesRouter,
  propertyMessages: propertyMessagesRouter,
  referralCodes: referralCodesRouter,
  requests: requestsRouter,
  requestsToBook: requestsToBookRouter,
  reviews: reviewsRouter,
  stripe: stripeRouter,
  superhog: superhogRouter,
  trips: tripsRouter,
  twilio: twilioRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
