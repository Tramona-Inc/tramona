/* eslint-disable no-console */
import { createTRPCRouter, roleRestrictedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { env } from "@/env";
import axios from "axios";
import { db } from "@/server/db";
import { properties, users, superhogRequests, trips } from "@/server/db/schema";

import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateTimeStamp } from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
import type { Trip } from "@/server/db/schema/tables/trips";
import { formatDateYearMonthDay } from "@/utils/utils";
import { getCountryISO, getPostcode } from "@/server/google-maps";
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

type ResponseType = {
  data: {
    verification?: {
      verificationId: string;
      status: "Pending" | "Rejected" | "Approved" | "Flagged";
    };
  };
};

// this is the metadata to work with
// metadata: {
//   confirmed_at: '2024-07-23T23:22:44.297Z',
//   total_savings: '-13000',
//   price: '54000',
//   property_id: '25',
//   tramonaServiceFee: '10000',
//   request_id: '123',
//   user_id: '6cf59186-bf24-4609-b978-450ffa9d5ad6',
//   listing_id: '27'
// },
//   //check to see if the reservation has already been created by checking the trips table since this will becalled on everyupdate

export async function createSuperhogReservation({
  listingId,
  propertyId,
  userId,
  trip,
}: {
  listingId: number;
  propertyId: number;
  userId: string;
  trip: Trip;
}) {
  //find the property using its id
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId),
  });

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (property && user) {
    const reservationObject = {
      metadata: {
        timeStamp: generateTimeStamp(),
        echoToken: uuidv4(),
      },
      listing: {
        listingId: listingId.toString(), //this is the offer ID
        listingName: property.name,
        address: {
          addressLine1: property.address,
          addressLine2: "", //can be null
          town: property.city,
          countryIso: await getCountryISO({
            lat: property.latitude,
            lng: property.longitude,
          }),
          postcode: await getPostcode({
            lat: property.latitude,
            lng: property.longitude,
          }),
        },
        petsAllowed: property.petsAllowed ? "true" : "false",
      },
      reservation: {
        reservationId: trip.id.toString(),
        checkIn: formatDateYearMonthDay(trip.checkIn), // 2024-08-24 format
        checkOut: formatDateYearMonthDay(trip.checkOut),
        channel: "Tramona",
        creationDate: formatDateYearMonthDay(new Date()),
      },
      guest: {
        firstName: user.name?.split(" ")[0] ?? " ", //change to first name
        lastName: user.name?.split(" ")[1] ?? " ", //change to last name
        email: user.email,
        telephoneNumber: user.phoneNumber?.toString() ?? "+19496833881",
      },
    };

    console.log("this is the reservation object", reservationObject);

    const { verification } = await axios
      .post<unknown, ResponseType>(
        "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications",
        reservationObject,
        config,
      )
      .then((res) => res.data)
      .catch((error: AxiosError) => {
        throw new Error(error.response.data.detail);
      });

    if (!verification) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    console.log("this is the verification", verification);

    //now we can create the superhog_ request table
    await db.insert(superhogRequests).values({
      echoToken: reservationObject.metadata.echoToken,
      propertyId: propertyId,
      userId: userId,
      superhogStatus: verification.status,
      superhogVerificationId: verification.verificationId,
      superhogReservationId: reservationObject.reservation.reservationId,
    });
  }
}

//TRPC FUNCTIONS

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

      await db.insert(superhogRequests).values({
        echoToken: input.metadata.echoToken,
        superhogStatus: verification.status,
        superhogVerificationId: verification.verificationId,
        superhogReservationId: input.reservation.reservationId,
        userId: "1",
        propertyId: 1,
      });
    }),

  getAllVerifications: roleRestrictedProcedure(["admin"]).query(async () => {
    return await db.query.superhogRequests.findMany();
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
          .delete(superhogRequests)
          .where(
            eq(
              superhogRequests.superhogVerificationId,
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
          .update(trips)
          .set({
            checkIn: new Date(input.reservation.checkIn),
            checkOut: new Date(input.reservation.checkOut),
          })
          .where(
            eq(
              trips.superhogRequestId, // we need another query to acces the actual superhog db
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
