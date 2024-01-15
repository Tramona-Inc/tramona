import { createTRPCRouter } from "@/server/api/trpc";
import { usersRouter } from "./routers/usersRouter";
import { requestsRouter } from "./routers/requestsRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  requests: requestsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
