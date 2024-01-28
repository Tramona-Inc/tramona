import { createTRPCRouter } from "@/server/api/trpc";
import { offersRouter } from "./routers/offersRouter";
import { paymentsRouter } from "./routers/paymentsRouter";
import { propertiesRouter } from "./routers/propertiesRouter";
import { requestsRouter } from "./routers/requestsRouter";
import { usersRouter } from "./routers/usersRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  requests: requestsRouter,
  properties: propertiesRouter,
  offers: offersRouter,
  payments: paymentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
