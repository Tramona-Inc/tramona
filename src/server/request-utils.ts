import { formatDateRange } from "@/utils/utils";

import { RequestInput } from "./api/routers/requestsRouter";

import { db } from "./db";
import { waitUntil } from "@vercel/functions";
import { formatCurrency, getNumNights, plural } from "@/utils/utils";
import { eq } from "drizzle-orm";
import {
  groupMembers,
  groups,
  properties,
  offers,
  requests,
  users,
} from "./db/schema";
import { getCoordinates } from "./google-maps";
import { sendSlackMessage } from "./slack";
import { Session } from "next-auth";
import { TRPCError } from "@trpc/server";
import {
  haversineDistance,
  createLatLngGISPoint,
  getPropertiesForRequest,
  sendTextToHost,
} from "./server-utils";
import { scrapeDirectListings } from "./direct-sites-scraping";
import { scrapeAirbnbPrice } from "./scrapePrice";
import {
  getTravelerOfferedPrice,
  baseAmountToHostPayout,
} from "@/utils/payment-utils/paymentBreakdown";
import { differenceInDays } from "date-fns";
import { generateFakeUser } from "./server-utils";
import { emailPMFromCityRequest } from "@/utils/outreach-utils";

export async function handleRequestSubmission(
  input: RequestInput,
  { user }: { user: Session["user"] },
) {
  console.log("hit");
  console.log(input.lat, input.location, input);

  // Trigger lambda scraping functions

  await emailPMFromCityRequest({
    requestLocation: input.location,
    requestedLocationLatLng: { lat: input.lat, lng: input.lng },
    radius: input.radius,
  });

  // Begin a transaction
  const transactionResults = await db.transaction(async (tx) => {
    const madeByGroupId = await tx
      .insert(groups)
      .values({ ownerId: user.id })
      .returning()
      .then((res) => res[0]!.id);

    await tx.insert(groupMembers).values({
      userId: user.id,
      groupId: madeByGroupId,
    });

    let lat = input.lat;
    let lng = input.lng;
    let radius = input.radius;
    console.log("here", lat, lng, radius);
    if (lat === undefined || lng === undefined || radius === undefined) {
      const coordinates = await getCoordinates(input.location);
      if (coordinates.location) {
        lat = coordinates.location.lat;
        lng = coordinates.location.lng;
        if (coordinates.bounds) {
          radius =
            haversineDistance(
              coordinates.bounds.northeast.lat,
              coordinates.bounds.northeast.lng,
              coordinates.bounds.southwest.lat,
              coordinates.bounds.southwest.lng,
            ) / 2;
        } else {
          radius = 10;
        }
      }
    }
    let latLngPoint = null;
    if (lat && lng) {
      latLngPoint = createLatLngGISPoint({ lat, lng });
    }

    if (!radius || !latLngPoint) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to get coordinates for the location",
      });
    }

    const request = await tx
      .insert(requests)
      .values({ ...input, madeByGroupId, latLngPoint, radius })
      .returning({ latLngPoint: requests.latLngPoint, id: requests.id })
      .then((res) => res[0]!);

    //TO DO - figure out if i need to get coordinates here or elsewhere

    // if (input.lat === undefined || input.lng === null || input.radius === null) {
    //   const coordinates = await getCoordinates(input.location);
    //   if (coordinates.location) {

    //   }
    // }

    waitUntil(
      scrapeDirectListings({
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        requestNightlyPrice:
          input.maxTotalPrice / getNumNights(input.checkIn, input.checkOut),
        requestId: request.id,
        location: input.location,
        latitude: lat,
        longitude: lng,
        numGuests: input.numGuests,
      }).catch((error) => {
        console.error("Error scraping listings: " + error);
      }),
    );

    const eligibleProperties = await getPropertiesForRequest(
      { ...input, id: request.id, latLngPoint: request.latLngPoint, radius },
      { tx },
    );

    const numNights = getNumNights(input.checkIn, input.checkOut);
    const requestedNightlyPrice = input.maxTotalPrice / numNights;

    const eligiblePropertiesWithAutoOffers = eligibleProperties.filter(
      (property) =>
        property.autoOfferEnabled &&
        property.originalListingId !== "877854804496138577",
    );

    const autoOfferPromises = eligiblePropertiesWithAutoOffers.map(
      async (property) => {
        try {
          const propertyDetails = await tx.query.properties.findFirst({
            where: eq(properties.id, property.id),
          });

          if (
            propertyDetails?.autoOfferEnabled &&
            propertyDetails.originalListingId &&
            propertyDetails.originalListingPlatform === "Airbnb" &&
            propertyDetails.discountTiers
          ) {
            const airbnbTotalPrice = await scrapeAirbnbPrice({
              airbnbListingId: propertyDetails.originalListingId,
              params: {
                checkIn: input.checkIn,
                checkOut: input.checkOut,
                numGuests: input.numGuests,
              },
            });

            if (!airbnbTotalPrice) {
              return;
            }
            const airbnbNightlyPrice = airbnbTotalPrice / numNights;

            const percentOff =
              ((airbnbNightlyPrice - requestedNightlyPrice) /
                airbnbNightlyPrice) *
              100;

            const daysUntilCheckIn = differenceInDays(
              input.checkIn,
              new Date(),
            );

            const applicableDiscount = propertyDetails.discountTiers.find(
              (tier) => daysUntilCheckIn >= tier.days,
            );

            if (
              applicableDiscount &&
              percentOff <= applicableDiscount.percentOff
            ) {
              // create offer
              const calculatedTravelerPrice = getTravelerOfferedPrice({
                totalBasePriceBeforeFees: requestedNightlyPrice * numNights,
              });

              await tx.insert(offers).values({
                requestId: request.id,
                propertyId: property.id,
                totalBasePriceBeforeFees: input.maxTotalPrice,
                hostPayout: baseAmountToHostPayout(
                  requestedNightlyPrice * numNights,
                ),
                calculatedTravelerPrice,
                checkIn: input.checkIn,
                checkOut: input.checkOut,
              });
            }
          }
        } catch (error) {
          console.error(
            `Error processing auto-offer for property ${property.id}:`,
            error,
          );
        }
      },
    );

    // Execute all auto offer promises simultaneously
    const results = await Promise.allSettled(autoOfferPromises);

    // Optional: You can process the results to log the outcome of each promise
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Error with property ${eligiblePropertiesWithAutoOffers[index]?.id}:`,
          result.reason,
        );
      }
    });

    const propertiesWithoutAutoOffers = eligibleProperties.filter(
      (property) => !property.autoOfferEnabled,
    );

    if (!user.isBurner) {
      await sendTextToHost({
        matchingProperties: propertiesWithoutAutoOffers,
        request: input,
        tx,
      });
    }

    return { requestId: request.id, madeByGroupId };
  });

  // Messaging based on user preferences or environment.
  const name = user.name ?? user.email;
  const pricePerNight =
    input.maxTotalPrice / getNumNights(input.checkIn, input.checkOut);
  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(input.checkIn, input.checkOut);
  const fmtdNumGuests = plural(input.numGuests ?? 1, "guest");

  if (user.role !== "admin") {
    await sendSlackMessage({
      isProductionOnly: true,
      channel: "tramona-bot",
      text: [
        `*${name} just made a request: ${input.location}*`,
        `requested ${fmtdPrice}/night · ${fmtdDateRange} · ${fmtdNumGuests}`,
        `<https://tramona.com/admin|Go to admin dashboard>`,
      ].join("\n"),
    });
  }

  return transactionResults;
}

export async function generateFakeRequest(
  location: string,
  checkIn: Date,
  checkOut: Date,
  numGuests: number,
  maxTotalPrice: number,
) {
  const fakeUserId = await generateFakeUser("fake-user@gmail.com");
  const fakeUser = await db.query.users.findFirst({
    where: eq(users.id, fakeUserId),
  });
  if (!fakeUser) {
    throw new Error("Fake user not found");
  }
  const fakeRequest = await handleRequestSubmission(
    {
      location,
      checkIn,
      checkOut,
      numGuests,
      maxTotalPrice,
    },
    { user: fakeUser },
  );
  return fakeRequest;
}
