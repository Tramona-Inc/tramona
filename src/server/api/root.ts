import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/authRouter";
import { filesRouter } from "./routers/filesRouter";
import { groupsRouter } from "./routers/groupsRouter";
import { messagesRouter } from "./routers/messagesRouter";
import { myTripsRouter } from "./routers/myTripsRouter";
import { offersRouter } from "./routers/offersRouter";
import { propertiesRouter } from "./routers/propertiesRouter";
import { referralCodesRouter } from "./routers/referralCodesRouter";
import { requestsRouter } from "./routers/requestsRouter";
import { stripeRouter } from "./routers/stripeRouter";
import { twilioRouter } from "./routers/twilioRouter";
import { miscRouter } from "./routers/miscRouter";
import { usersRouter } from "./routers/usersRouter";
import { emailRouter } from "./routers/emailRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  referralCodes: referralCodesRouter,
  requests: requestsRouter,
  properties: propertiesRouter,
  offers: offersRouter,
  stripe: stripeRouter,
  auth: authRouter,
  myTrips: myTripsRouter,
  twilio: twilioRouter,
  messages: messagesRouter,
  files: filesRouter,
  misc: miscRouter,
  groups: groupsRouter,
  emails: emailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
