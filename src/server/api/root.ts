import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { authRouter } from "./routers/authRouter";
import { offersRouter } from "./routers/offersRouter";
import { propertiesRouter } from "./routers/propertiesRouter";
import { requestsRouter } from "./routers/requestsRouter";
import { stripeRouter } from "./routers/stripeRouter";
import { usersRouter } from "./routers/usersRouter";
import { myTripsRouter } from "./routers/myTripsRouter";
import { referralCodesRouter } from "./routers/referralCodesRouter";
import { z } from "zod";

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
  printDate: publicProcedure.input(z.date()).mutation(({ input }) => {
    console.log(input.toString());
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
