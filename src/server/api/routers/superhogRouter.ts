import { createTRPCRouter, roleRestrictedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { env } from "@/env";
import axios from "axios";
import { db } from "@/server/db";
import { reservations } from "../../db/schema/tables/reservations";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export interface ReservationInterface {
  id: number;
  checkIn: string;
  checkOut: string;
  echoToken: string;
  propertyAddress: string;
  propertyTown: string;
  propertyCountryIso: string;
  superhogStatus: string;
  superhogVerificationId: string;
  superhogReservationId: string;
  nameOfVerifiedUser: string;
  userId: string;
  propertyId: string;
}

// interface ResponseType {
//   {
//     metadata: {
//         timeStamp: string,
//         echoToken: string
//     },
//     verification: {
//         verificationId: string,
//         status: string
//     }
// }
// }

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
    .mutation(async ({ input }) => {
      type ResponseType = {
        data: {
          verification?: {
            verificationId: string;
            status: "Pending" | "Rejected" | "Approved" | "Flagged" | "null";
          };
        };
      };

      const { verification } = await axios
        .post<unknown, ResponseType>(
          "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications",
          input,
          config,
        )
        .then((res) => res.data)
        .catch((error: AxiosError) => {
          throw new Error(error.response.data.detail);
        });

      if (!verification) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.insert(reservations).values({
        checkIn: input.reservation.checkIn,
        checkOut: input.reservation.checkOut,
        echoToken: input.metadata.echoToken,
        propertyAddress: input.listing.address.addressLine1,
        propertyTown: input.listing.address.town,
        propertyCountryIso: input.listing.address.countryIso,
        superhogStatus: verification.status,
        superhogVerificationId: verification.verificationId,
        superhogReservationId: input.reservation.reservationId,
        nameOfVerifiedUser: `${input.guest.firstName} ${input.guest.lastName}`,
      });
    }),
  getAllVerifications: roleRestrictedProcedure(["admin"]).query(async () => {
    return await db.query.reservations.findMany();
  }),

  deleteVerification: roleRestrictedProcedure(["admin"])
    .input(
      z.object({
        metadata: z.object({
          echoToken: z.string(),
          timeStamp: z.string(),
        }),
        verification: z.object({
          verificationId: z.string(),
        }),
        reservation: z.object({
          reservationId: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const response = await axios.put(
          "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications/cancel",
          input,
          config,
        );
        console.log(response.data);
        await db
          .delete(reservations)
          .where(
            eq(
              reservations.superhogVerificationId,
              input.verification.verificationId,
            ),
          );
      } catch (error) {
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          throw new Error(axiosError.response.data.detail);
        }
      }
    }),
  updateVerification: roleRestrictedProcedure(["admin"])
    .input(
      z.object({
        metadata: z.object({
          echoToken: z.string(),
          timeStamp: z.string(),
        }),
        verification: z.object({
          verificationId: z.string(),
        }),
        reservation: z.object({
          reservationId: z.string(),
          checkIn: z.string(),
          checkOut: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const response = await axios.put(
          "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications",
          input,
          config,
        );
        console.log(response.data);
        console.log("it worked ");
        await db
          .update(reservations)
          .set({
            checkIn: input.reservation.checkIn,
            checkOut: input.reservation.checkOut,
          })
          .where(
            eq(
              reservations.superhogVerificationId,
              input.verification.verificationId,
            ),
          );
      } catch (error) {
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          throw new Error(axiosError.response.data.detail);
        }
      }
    }),
});
