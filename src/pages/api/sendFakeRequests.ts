import { fakeRequests, properties } from "@/server/db/schema";
import { eq, ne } from "drizzle-orm";
import { db } from "@/server/db";
import { cities } from "@/server/db/secondary-schema/cities";
import { secondaryDb } from "@/server/db";
import { generateFakeRequest } from "@/server/request-utils";

function generateDateTimeInBetweenLast24HoursAndLast4Days() {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last4Days = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  return new Date(last24Hours.getTime() + Math.random() * (last4Days.getTime() - last24Hours.getTime()));
}

function generateRandomPriceBetween100And450(numNights: number) {
  return (Math.floor(Math.random() * 350) + 100) * 100 * numNights;
}

function generateRandomCheckInAndCheckOutDates() {
  const now = new Date();
  const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Pick a random check-in date within the next 30 days
  const checkInDate = new Date(now.getTime() + Math.random() * (next30Days.getTime() - now.getTime()));

  // Generate a weighted number of nights
  let numNights;
  const randomValue = Math.random();

  if (randomValue < 0.6) {
    numNights = Math.floor(Math.random() * 5) + 3; // 60% chance of 3-7 nights
  } else if (randomValue < 0.9) {
    numNights = Math.floor(Math.random() * 4) + 8; // 30% chance of 8-11 nights
  } else {
    numNights = Math.floor(Math.random() * 6) + 12; // 10% chance of 12-17 nights
  }

  // Calculate check-out date based on numNights
  const checkOutDate = new Date(checkInDate.getTime() + numNights * 24 * 60 * 60 * 1000);

  return { checkInDate, checkOutDate, numNights };
}

function generateRandomNumGuestsBetween1And4() {
  return Math.floor(Math.random() * 3) + 1;
}


export default async function handler() {
  const hostLocations = await db.query.properties.findMany({
    columns: {
      id: true,
      city: true,
      stateCode: true,
      country: true,
    },
    where: ne(properties.hostTeamId, 37),
  });

  const warmLeadsLocations = await secondaryDb.select({
    city: cities.name,
    stateCode: cities.stateCode,
    country: cities.country,
  }).from(cities);

  if (!hostLocations) {
    console.log("No host locations found");
    return;
  }

  const uniqueCities = new Set(hostLocations.map((location) => location.city + ", " + location.stateCode + ", " + location.country));
  const uniqueWarmLeadsCities = new Set(warmLeadsLocations.map((location) => location.city + ", " + location.stateCode + ", " + location.country));
  const uniqueCitiesToGenerateRequestsFor = new Set([...uniqueCities, ...uniqueWarmLeadsCities]);
  for (const city of uniqueCitiesToGenerateRequestsFor) {

    const cityLastSent = await db.query.fakeRequests.findFirst({
      columns: {
        lastSent: true,
      },
      where: eq(fakeRequests.city, city),
    }).then((res) => res?.lastSent);

    if (cityLastSent && cityLastSent > generateDateTimeInBetweenLast24HoursAndLast4Days()) {
      continue;
    } else if (!cityLastSent) {
      const { checkInDate, checkOutDate, numNights } = generateRandomCheckInAndCheckOutDates();
      const randomPrice = generateRandomPriceBetween100And450(numNights);

      await generateFakeRequest(city, checkInDate, checkOutDate, generateRandomNumGuestsBetween1And4(), randomPrice).then(async () => {
        await db
          .insert(fakeRequests)
          .values({
            city,
          })
      });
    } else {
      const { checkInDate, checkOutDate, numNights } = generateRandomCheckInAndCheckOutDates();
      const randomPrice = generateRandomPriceBetween100And450(numNights);
      await generateFakeRequest(city, checkInDate, checkOutDate, generateRandomNumGuestsBetween1And4(), randomPrice).then(async () => {
        await db
          .update(fakeRequests)
          .set({
            lastSent: new Date(),
          })
          .where(eq(fakeRequests.city, city));
      });
    }
  }
}
