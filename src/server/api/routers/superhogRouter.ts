import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  roleRestrictedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { env } from "@/env";
import axios from "axios";
import { db } from "@/server/db";
import { verificationTokens } from "../../db/schema/tables/auth/verificationTokens";
import {
  reservations,
  reservationInsertSchema,
} from "../../db/schema/tables/reservations";

export interface ReservationInterface {
  checkIn: Date;
  checkOut: Date;
  echoToken: string;
  propertyAddress: string;
  propertyTown: string;
  propertyCountryIso: string;
  superhogStatus: string;
  superhogVerificationId: string;
  nameOfVerifiedUser: string;
  userId: string;
  propertyId: string;
}

const config = {
  headers: {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": `${env.OCP_APIM_SUBSCRIPTION_KEY}`,
    "x-environment": `${env.X_ENVIRONMENT}`,
  },
};

interface AxiosError extends Error {
  response: {
    data: {
      detail: string;
    };
  };
}

export const superhogRouter = createTRPCRouter({
  createSuperhogRequest: roleRestrictedProcedure(["admin"])
    //update later this should be updating the schema, not creating it
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
    .mutation(async ({ ctx, input }) => {
      try {
        const { data } = await axios.post(
          "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications",
          input,
          config,
        );
        console.log(data);
        await db.insert(reservations).values({
          checkIn: input.reservation.checkIn,
          checkOut: input.reservation.checkOut,
          echoToken: input.metadata.echoToken,
          propertyAddress: input.listing.address.addressLine1,
          propertyTown: input.listing.address.town,
          propertyCountryIso: input.listing.address.countryIso,
          superhogStatus: data.verification.status,
          superhogVerificationId: data.verification.verificationId,
          nameOfVerifiedUser: `${input.guest.firstName} ${input.guest.lastName}`,
        });
      } catch (error) {
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          throw new Error(axiosError.response.data.detail);
        }
      }
    }),
  getAllVerifications: roleRestrictedProcedure(["admin"]).query(async () => {
    return await db.query.reservations.findMany();
  }),
});
