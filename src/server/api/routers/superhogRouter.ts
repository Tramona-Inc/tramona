import { createTRPCRouter, roleRestrictedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { env } from "@/env";
import axios from "axios";
import { db } from "@/server/db";
import {
  properties,
  users,
  superhogRequests,
  trips,
  superhogErrors,
  superhogActionOnTrips,
} from "@/server/db/schema";

import { eq, isNotNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateTimeStamp } from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
import type { Trip } from "@/server/db/schema/tables/trips";
import { formatDateYearMonthDay } from "@/utils/utils";
import { getCountryISO, getPostcode } from "@/server/google-maps";
import { sendSlackMessage } from "@/server/slack";

import { stripe } from "@/server/api/routers/stripeRouter";

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
  paymentIntentId,
  propertyId,
  userId,
  trip,
}: {
  paymentIntentId: string;
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
        listingId: propertyId.toString(), //this is the offer ID
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
        firstName: user.firstName ?? user.name?.split(" ")[0],
        lastName: user.lastName ?? user.name?.split(" ")[1],
        email: user.email,
        telephoneNumber: user.phoneNumber?.toString() ?? "+19496833881",
      },
    };

    const { verification } = await axios
      .post<unknown, ResponseType>(
        "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications",
        reservationObject,
        config,
      )
      .then((res) => res.data)
      .catch(async (error: AxiosError) => {
        console.log(
          `SUPERHOG REQUEST ERROR: axios error... ${error.response.data.detail}`,
        );
        sendSlackMessage(
          [
            `SUPERHOG REQUEST ERROR: axios error... ${error.response.data.detail}`,
          ].join("\n"),
        );
        await db.insert(superhogErrors).values({
          echoToken: reservationObject.metadata.echoToken,
          error: error.response.data.detail,
          userId: userId,
          tripId: trip.id,
          propertiesId: propertyId,
          action: "create",
        });
        throw new Error(error.response.data.detail);
      });

    if (!verification) {
      console.log("There was no verification");
      sendSlackMessage(
        [
          `SUPERHOG REQUEST ERROR: The verification was not created because it was not found`,
        ].join("\n"),
      );
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    console.log(" Here is the verification", verification);
    console.log(
      "If nothihng shows up its the current superhog insert that is the issue ",
    );
    //now we can create the superhog_ request table
    const currentSuperHogRequestId = await db
      .insert(superhogRequests)
      .values({
        echoToken: reservationObject.metadata.echoToken,
        propertyId: propertyId,
        userId: userId,
        superhogStatus: verification.status,
        superhogVerificationId: verification.verificationId,
        superhogReservationId: reservationObject.reservation.reservationId, //this is the trip id but not connected it doesnt matter what the value is tbh
      })
      .returning({ id: superhogRequests.id });

    console.log("currentSuperHogRequestId ", currentSuperHogRequestId);
    //update the trip with the superhog request id
    const currentTripId = await db
      .update(trips)
      .set({
        superhogRequestId: currentSuperHogRequestId[0]!.id,
      })
      .where(eq(trips.id, trip.id))
      .returning({ id: trips.id });
    console.log("currentTripId", currentTripId);
    //record the action in the superhog action table
    await db.insert(superhogActionOnTrips).values({
      action: "create",
      tripId: currentTripId[0]!.id,
      superhogRequestId: currentSuperHogRequestId[0]!.id,
    });

    if (
      verification.status === "Rejected" ||
      verification.status === "Flagged"
    ) {
      sendSlackMessage(
        [
          `*SUPERHOG REQUEST*: The verification was created successfully but was denied with status of ${verification.status} for tripID ${trip.id} for ${user.name}`,
        ].join("\n"),
      );
    } else {
      console.log("Superhog was approved and just need to capture the payment");
      //approved we can take the payment
      const intent = await stripe.paymentIntents.capture(paymentIntentId); //will capture the authorized amount by default
      // Update trips table
      await db
        .update(trips)
        .set({ paymentCaptured: true })
        .where(eq(trips.id, trip.id));
      return intent;
    }
  }
  //top level if statement
  else {
    sendSlackMessage(
      [
        `*SUPERHOG REQUEST ERROR*: The property with id ${propertyId} or the user with id ${userId} does not exist in the database`,
      ].join("\n"),
    );
  }
}

//TRPC FUNCTIONS

export const superhogRouter = createTRPCRouter({
  //this is for manuel upload and testing
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
      const { verification } = await axios
        .post<unknown, ResponseType>(
          "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications",
          input,
          config,
        )
        .then((res) => res.data)
        .catch(async (error: AxiosError) => {
          //there were errors
          await db.insert(superhogErrors).values({
            echoToken: input.metadata.echoToken,
            error: error.response.data.detail,
            propertiesId: parseInt(input.listing.listingId), //only for testing
            userId: null, //only for testing
            tripId: parseInt(input.reservation.reservationId),
            action: "create",
          });
          sendSlackMessage(
            [
              `SUPERHOG REQUEST ERROR: axios error... ${error.response.data.detail}`,
            ].join("\n"),
          );
          throw new Error(error.response.data.detail);
        });

      if (!verification) {
        sendSlackMessage(
          [
            `SUPERHOG REQUEST ERROR: there was no verification for ${input.metadata.echoToken}`,
          ].join("\n"),
        );
        throw new Error("There was no verification");
      }

      const superhogRequestId = await db
        .insert(superhogRequests)
        .values({
          echoToken: input.metadata.echoToken,
          superhogStatus: verification.status,
          superhogVerificationId: verification.verificationId,
          superhogReservationId: input.reservation.reservationId, //this is actually the trip id
          userId: ctx.user.id, //since we dont have access to the user id
          propertyId: parseInt(input.listing.listingId), //since we dont have access to the property id THIS FUNCTION IS JUST SO WE CAN GET CERTIFIED
        })
        .returning({ id: superhogRequests.id });
      //update the trip with the superhog request id
      //check if trip even exists if it doesnt return an error
      const tripExists = await db.query.trips.findFirst({
        where: eq(trips.id, parseInt(input.reservation.reservationId)),
      });

      if (tripExists) {
        await db
          .update(trips)
          .set({
            superhogRequestId: superhogRequestId[0]!.id,
          })
          .where(eq(trips.id, parseInt(input.reservation.reservationId)));

        await db.insert(superhogActionOnTrips).values({
          action: "create",
          tripId: tripExists.id,
          superhogRequestId: superhogRequestId[0]!.id,
        });
        //super temp for testing
        sendSlackMessage(
          [
            `SUPERHOG REQUEST SUCCESS: TRIP ID  ${input.reservation.reservationId} was created successfully for property ${input.listing.listingName}`,
          ].join("\n"),
        );
      } else {
        await db.insert(superhogErrors).values({
          echoToken: input.metadata.echoToken,
          error: "The trip does not exist",
          propertiesId: parseInt(input.listing.listingId), //only for testing
          userId: null, //only for testing
          tripId: null,
          action: "create",
        });
        sendSlackMessage(
          [
            `SUPERHOG REQUEST ERROR: TRIP ID  ${input.reservation.reservationId} does not exist for ${input.listing.listingName}`,
          ].join("\n"),
        );
        throw new Error("The trip does not exist");
      }
    }),

  getAllVerifications: roleRestrictedProcedure(["admin"]).query(async () => {
    const allSuperhogRequestWithTrips = await db.query.trips.findMany({
      where: isNotNull(trips.superhogRequestId),
      with: {
        superhogRequests: {
          with: {
            property: {
              columns: {
                address: true,
                city: true,
                latitude: true,
                longitude: true,
              },
            },
            user: {
              columns: { name: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    const allReservations = await Promise.all(
      allSuperhogRequestWithTrips.map(async (reservation) => {
        const countryISO = await getCountryISO({
          lat: reservation.superhogRequests!.property.latitude,
          lng: reservation.superhogRequests!.property.longitude,
        });
        return {
          id: reservation.id,
          checkIn: formatDateYearMonthDay(reservation.checkIn).toString(),
          checkOut: formatDateYearMonthDay(reservation.checkOut).toString(),
          echoToken: reservation.superhogRequests!.echoToken,
          propertyAddress: reservation.superhogRequests!.property.address,
          propertyTown: reservation.superhogRequests!.property.city,
          propertyCountryIso: countryISO,
          superhogStatus: reservation.superhogRequests!.superhogStatus,
          superhogVerificationId:
            reservation.superhogRequests!.superhogVerificationId,
          superhogReservationId:
            reservation.superhogRequests!.superhogReservationId,
          nameOfVerifiedUser: reservation.superhogRequests!.user.name,
          userId: reservation.superhogRequests!.userId,
          propertyId: reservation.superhogRequests!.propertyId.toString(),
        };
      }),
    );

    return allReservations as ReservationInterface[];
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
        const currentSuperhogRequestId =
          await db.query.superhogRequests.findFirst({
            where: eq(
              superhogRequests.superhogVerificationId,
              input.verification.verificationId,
            ),
          });
        //record the acition in the superhog action table
        await db.insert(superhogActionOnTrips).values({
          action: "delete",
          tripId: parseInt(currentSuperhogRequestId!.superhogReservationId),
          superhogRequestId: currentSuperhogRequestId?.id,
        });
        //delet from the trips table
        await db
          .update(trips)
          .set({ superhogRequestId: null })
          .where(eq(trips.superhogRequestId, currentSuperhogRequestId!.id));
        //delete from the superhog request table
        await db
          .delete(superhogRequests)
          .where(
            eq(
              superhogRequests.superhogVerificationId,
              input.verification.verificationId,
            ),
          )
          .then();
        const response = await axios.put(
          "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications/cancel",
          input,
          config,
        );
      } catch (error) {
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          await db.insert(superhogErrors).values({
            echoToken: input.metadata.echoToken,
            error: axiosError.message,
            propertiesId: null,
            userId: null,
            tripId: null,
            action: "delete",
          });
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
        await axios.put(
          "https://superhog-apim.azure-api.net/e-deposit-sandbox/verifications",
          input,
          config,
        );

        //find the id of the superhog request
        const superhogRequestId = await db.query.superhogRequests.findFirst({
          where: eq(
            superhogRequests.superhogVerificationId,
            input.verification.verificationId,
          ),
        });

        //keep track of the action in the actions table
        //record the acition in the superhog action table
        await db.insert(superhogActionOnTrips).values({
          action: "update",
          tripId: parseInt(superhogRequestId!.superhogReservationId),
          superhogRequestId: superhogRequestId!.id,
        });

        await db
          .update(trips)
          .set({
            checkIn: new Date(input.reservation.checkIn),
            checkOut: new Date(input.reservation.checkOut),
          })
          .where(
            eq(
              trips.superhogRequestId, // we need another query to acces the actual superhog db
              superhogRequestId!.id,
            ),
          );

        //update the superhog request update time
        await db
          .update(superhogRequests)
          .set({
            updatedAt: new Date(),
          })
          .where(eq(superhogRequests.id, superhogRequestId!.id));
      } catch (error) {
        if (error instanceof Error) {
          const axiosError = error as AxiosError;
          sendSlackMessage(
            [
              `SUPERHOG REQUEST ERROR: axios error... ${axiosError.response.data.detail}`,
            ].join("\n"),
          );
          await db.insert(superhogErrors).values({
            echoToken: input.metadata.echoToken,
            error: axiosError.message,
            propertiesId: null,
            userId: null,
            tripId: null,
            action: "update",
          });
          throw new Error(axiosError.response.data.detail);
        }
      }
    }),
});
