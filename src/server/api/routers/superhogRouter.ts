import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { env } from "@/env";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": `${env.OCP_APIM_SUBSCRIPTION_KEY}`,
    "x-environment": `${env.X_ENVIRONMENT}`,
  },
};
export const superhogRouter = createTRPCRouter({
  createSuperhogRequest: protectedProcedure
    .input(
      z.object({
        metadata: z.object({
          timeStamp: z.string(),
          echoToken: z.string(),
        }),
        listing: z.object({
          listingId: z.string(),
          listingName: z.string(),
          address: z.object({
            addressLine1: z.string(),
            addressLine2: z.string(),
            town: z.string(),
            countryIso: z.string(),
            postcode: z.string(),
          }),
          petsAllowed: z.string(),
        }),
        reservation: z.object({
          reservationId: z.string(),
          checkIn: z.string(),
          checkOut: z.string(),
          channel: z.string(),
          creationDate: z.string(),
        }),
        guest: z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
          telephoneNumber: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        console.log(input);

        // const response = await axios.post(
        //   "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications",
        //   input,
        //   config,
        // );
        // console.log(response.data);
        //   return response.data;
      } catch (error) {
        console.error(error);
      }
    }),
});
