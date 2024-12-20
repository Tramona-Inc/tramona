import { db } from "@/server/db";
import {
  fillerRequests,
  fillerOffers,
  fillerBookings,
} from "@/server/db/schema";
import {
  createCreationTime,
  createRandomDate,
  createUserNameAndPic,
  randomizeLocationAndPrice,
} from "@/components/activity-feed/admin/generationHelper";
import { getNumNights } from "@/utils/utils";
import { sample } from "lodash";

export default async function handler() {
  const NUM_OF_REQUESTS = 10; //10
  const NUM_OF_OFFERS = 25; //25
  const NUM_OF_BOOKINGS = 5; //5
  let counter = 0;
  // generate filler requests
  const locationAndPricePromise = await db.query.requests.findMany({
    columns: {
      location: true,
      maxTotalPrice: true,
      checkIn: true,
      checkOut: true,
    },
    limit: 100,
    orderBy: (requests, { desc }) => [desc(requests.createdAt)],
  });
  const userDataPromise = createUserNameAndPic(100);
  const [userData, locationAndPrices] = await Promise.all([
    userDataPromise,
    locationAndPricePromise,
  ]);
  for (let i = 0; i < NUM_OF_REQUESTS; i++) {
    counter++;
    let username = "";
    let picture = "";
    if (userData[i] && i < userData.length) {
      username = userData[i]?.name ?? "";
      picture = userData[i]?.picture ?? "";
    }
    const randomDate = createRandomDate();
    const creationTime = createCreationTime();
    const random = randomizeLocationAndPrice(locationAndPrices);
    let numNights = 0;
    if (randomDate.checkIn && randomDate.checkOut) {
      numNights = getNumNights(randomDate.checkIn, randomDate.checkOut);
    }
    if (random?.location && randomDate.checkIn && randomDate.checkOut) {
      const fillerRequest = {
        userName: username,
        userProfilePicUrl: picture,
        maxTotalPrice: random.nightlyPrice * numNights,
        location: random.location,
        checkIn: new Date(randomDate.checkIn),
        checkOut: new Date(randomDate.checkOut),
        entryCreationTime: new Date(creationTime),
      };
      await db.insert(fillerRequests).values(fillerRequest);
    }
  }

  // generate filler offers
  const realOffers = await db.query.offers.findMany({
    columns: {
      totalBasePriceBeforeFees: true,
      checkIn: true,
      checkOut: true,
    },
    with: {
      property: {
        columns: {
          id: true,
          originalNightlyPrice: true,
        },
      },
    },
    limit: 100,
    orderBy: (properties, { desc }) => [desc(properties.createdAt)],
    // need to set up limits once we have more properties
  });
  const generatedOffers = realOffers
    .filter((offer) => offer.property.originalNightlyPrice !== null)
    .map((offer) => {
      const { totalBasePriceBeforeFees, checkIn, checkOut, property } = offer;
      const { originalNightlyPrice } = property;
      const nights = getNumNights(checkIn, checkOut);
      if (!originalNightlyPrice)
        throw new Error("originalNightlyPrice is undefined");

      const actualNightlyPrice = totalBasePriceBeforeFees / nights;
      let generatedNightlyPrice: number;

      if (
        actualNightlyPrice < 0.3 * originalNightlyPrice ||
        actualNightlyPrice >= originalNightlyPrice
      ) {
        const minPrice = 0.5 * originalNightlyPrice;
        const maxPrice = 0.9 * originalNightlyPrice;
        generatedNightlyPrice =
          minPrice + Math.random() * (maxPrice - minPrice);
      } else {
        const minPrice = 0.8 * actualNightlyPrice;
        const maxPrice = Math.min(
          1.2 * actualNightlyPrice,
          originalNightlyPrice,
        );
        generatedNightlyPrice =
          minPrice + Math.random() * (maxPrice - minPrice);
      }

      generatedNightlyPrice = Math.round(generatedNightlyPrice / 100) * 100;
      return {
        ...offer,
        generatedNightlyPrice,
      };
    });

  for (let i = 0; i < NUM_OF_OFFERS; i++) {
    counter++;
    let username = "";
    let picture = "";
    if (userData[counter] && counter < userData.length) {
      username = userData[counter]?.name ?? "";
      picture = userData[counter]?.picture ?? "";
    }
    const randomDate = createRandomDate();
    const creationTime = createCreationTime();
    const offer = sample(generatedOffers);
    let numNights = 0;
    if (randomDate.checkIn && randomDate.checkOut) {
      numNights = getNumNights(randomDate.checkIn, randomDate.checkOut);
    }
    if (
      offer &&
      randomDate.checkIn &&
      randomDate.checkOut &&
      offer.property.originalNightlyPrice
    ) {
      await db.insert(fillerOffers).values({
        userName: username,
        userProfilePicUrl: picture,
        propertyId: offer.property.id,
        originalNightlyPrice: offer.property.originalNightlyPrice,
        maxTotalPrice: offer.generatedNightlyPrice * numNights,
        checkIn: new Date(randomDate.checkIn),
        checkOut: new Date(randomDate.checkOut),
        entryCreationTime: new Date(creationTime),
      });
    }
  }

  // generate filler bookings
  for (let i = 0; i < NUM_OF_BOOKINGS; i++) {
    counter++;
    let username = "";
    let picture = "";
    if (userData[counter] && counter < userData.length) {
      username = userData[counter]?.name ?? "";
      picture = userData[counter]?.picture ?? "";
    }
    const randomDate = createRandomDate();
    const creationTime = createCreationTime();
    const booking = sample(generatedOffers);
    let numNights = 0;
    if (randomDate.checkIn && randomDate.checkOut) {
      numNights = getNumNights(randomDate.checkIn, randomDate.checkOut);
    }
    if (
      booking &&
      randomDate.checkIn &&
      randomDate.checkOut &&
      booking.property.originalNightlyPrice
    ) {
      await db.insert(fillerBookings).values({
        userName: username,
        userProfilePicUrl: picture,
        propertyId: booking.property.id,
        originalNightlyPrice: booking.property.originalNightlyPrice,
        maxTotalPrice: booking.generatedNightlyPrice * numNights,
        checkIn: new Date(randomDate.checkIn),
        checkOut: new Date(randomDate.checkOut),
        entryCreationTime: new Date(creationTime),
      });
    }
  }
}
