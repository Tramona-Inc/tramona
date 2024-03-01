import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/authRouter";
import { offersRouter } from "./routers/offersRouter";
import { propertiesRouter } from "./routers/propertiesRouter";
import { requestsRouter } from "./routers/requestsRouter";
import { stripeRouter } from "./routers/stripeRouter";
import { usersRouter } from "./routers/usersRouter";
import { myTripsRouter } from "./routers/myTripsRouter";
import { referralCodesRouter } from "./routers/referralCodesRouter";
import { messagesRouter } from "./routers/messagesRouter";
import { groupsRouter } from "./routers/groupsRouter";

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
  messages: messagesRouter,
  groups: groupsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
