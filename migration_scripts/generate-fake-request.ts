import { generateFakeRequest } from "@/server/request-utils";

const city = "Dallas, TX";

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

export default async function makeFakeRequest() {
  const { checkInDate, checkOutDate, numNights } = generateRandomCheckInAndCheckOutDates();
  // const randomPrice = generateRandomPriceBetween100And450(numNights);
  const randomPrice = 50 * 100 * numNights;
  await generateFakeRequest(city, checkInDate, checkOutDate, generateRandomNumGuestsBetween1And4(), randomPrice).then(async () => {
    console.log("Fake request generated");
  });
}

await makeFakeRequest().then(() => {
  console.log("Fake request generated");
  process.exit(0);
});
