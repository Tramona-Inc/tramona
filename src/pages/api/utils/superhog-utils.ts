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

import { eq } from "drizzle-orm";
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

export const CancelSuperhogReservationSchema = z.object({
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
});

type CancelSuperhogReservationInput = z.infer<
  typeof CancelSuperhogReservationSchema
>;

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
    function sanitizeName(name: string | null | undefined) {
      if (!name) return null;

      return name.replace(/[^a-zA-Z\s]/g, "");
    }
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
        firstName:
          sanitizeName(user.firstName) ??
          sanitizeName(user.name?.split(" ")[0]),
        lastName:
          sanitizeName(user.lastName) ?? sanitizeName(user.name?.split(" ")[1]),
        email: user.email,
        telephoneNumber: user.phoneNumber?.toString() ?? "+19496833881",
      },
    };

    const { verification } = await axios
      .post<unknown, ResponseType>(
        "https://superhog-apim.azure-api.net/e-deposit/verifications",
        reservationObject,
        config,
      )
      .then((res) => res.data)
      .catch(async (error: AxiosError) => {
        await sendSlackMessage({
          channel: "superhog-bot",
          text: [
            `SUPERHOG REQUEST ERROR: axios error... ${error.response.data.detail}`,
          ].join("\n"),
        });

        await db.insert(superhogErrors).values({
          echoToken: reservationObject.metadata.echoToken,
          error: error.response.data.detail,
          userId: userId,
          tripId: trip.id,
          propertiesId: propertyId,
          action: "create",
        });
        await db
          .update(trips)
          .set({ tripsStatus: "Needs attention" })
          .where(eq(trips.id, trip.id));
        throw new Error(error.response.data.detail);
      });

    if (!verification) {
      console.log("There was no verification");
      await db.insert(superhogErrors).values({
        echoToken: reservationObject.metadata.echoToken,
        error: "NO RESPONSE FROM SUPERHOG",
        userId: userId,
        tripId: trip.id,
        propertiesId: propertyId,
        action: "create",
      });
      await sendSlackMessage({
        channel: "superhog-bot",
        text: [
          `SUPERHOG REQUEST ERROR: The verification was not created because it was not found`,
        ].join("\n"),
      });
      throw new Error("Not found");
    }
    console.log(" Here is the verification", verification);

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
      await db
        .update(trips)
        .set({ tripsStatus: "Needs attention" })
        .where(eq(trips.id, trip.id));
      await sendSlackMessage({
        channel: "superhog-bot",
        text: [
          `*SUPERHOG REQUEST*: The verification was created successfully but was denied with status of ${verification.status} for tripID ${trip.id} for ${user.name}`,
        ].join("\n"),
      });
    } else {
      console.log("Superhog was approved and just need to capture the payment");
      //approved we can take the payment
      const intent = await stripe.paymentIntents.capture(paymentIntentId); //will capture the authorized amount by default
      // Update trips table
      await db
        .update(trips)
        .set({ paymentCaptured: new Date() })
        .where(eq(trips.id, trip.id));
      return intent;
    }
  }
  //top level if statement
  else {
    await db.insert(superhogErrors).values({
      echoToken: uuidv4(),
      error: `The property with id ${propertyId} or the user with id ${userId} does not exist in the database`,
      userId: userId,
      tripId: trip.id,
      propertiesId: propertyId,
      action: "create",
    });
    await sendSlackMessage({
      channel: "superhog-bot",
      text: [
        `*SUPERHOG REQUEST ERROR*: The property with id ${propertyId} or the user with id ${userId} does not exist in the database`,
      ].join("\n"),
    });
  }
}

export async function cancelSuperhogReservation({
  verificationId,
  reservationId,
}: {
  verificationId: string;
  reservationId: string;
}) {
  try {
    const reqObject: CancelSuperhogReservationInput = {
      verification: {
        verificationId,
      },
      metadata: {
        echoToken: uuidv4(),
        timeStamp: generateTimeStamp(),
      },
      reservation: {
        reservationId,
      },
    };
    await axios.put(
      "https://superhog-apim.azure-api.net/e-deposit/verifications/cancel",
      reqObject,
      config,
    );
    const currentSuperhogRequestId = await db.query.superhogRequests.findFirst({
      where: eq(superhogRequests.superhogVerificationId, verificationId),
    });
    if (!currentSuperhogRequestId) {
      await sendSlackMessage({
        channel: "superhog-bot",
        text: [
          `*SUPERHOG Delete ERROR*: The verification id ${verificationId} does not exist in the database`,
          `Please manuelly delete the superhog request in the admin dashboard`,
        ].join("\n"),
      });
      return;
    }
    //record the acition in the superhog action table
    await db.insert(superhogActionOnTrips).values({
      action: "delete",
      tripId: parseInt(currentSuperhogRequestId.superhogReservationId),
      superhogRequestId: currentSuperhogRequestId.id,
    });
    //delete from the trips table
    await db
      .update(trips)
      .set({ superhogRequestId: null })
      .where(eq(trips.superhogRequestId, currentSuperhogRequestId.id));
    //delete from the superhog request table
    await db
      .update(superhogRequests)
      .set({ isCancelled: true })
      .where(eq(superhogRequests.superhogVerificationId, verificationId));
    await sendSlackMessage({
      channel: "superhog-bot",
      text: [
        `*SUPERHOG Delete*: The verification id ${verificationId} was successfully deleted`,
      ].join("\n"),
    });
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      await db.insert(superhogErrors).values({
        echoToken: uuidv4(),
        error: axiosError.message,
        propertiesId: null,
        userId: null,
        tripId: null,
        action: "delete",
      });
      throw new Error(axiosError.response.data.detail);
    }
  }
}
