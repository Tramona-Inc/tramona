import { db } from "@/server/db";
import { offers, properties, reviews } from "@/server/db/schema";
import { scrapeAirbnbListings } from "@/server/external-listings-scraping/airbnb";
import { HOST_MARKUP, TRAVELER__MARKUP } from "@/utils/constants";
import { RequestInput } from "./api/routers/requestsRouter";
import { getNumNights } from "@/utils/utils";

export async function scrapeAirbnbListingsForRequest(
  request: RequestInput,
  { tx = db, requestId }: { tx?: typeof db; requestId: number },
) {
  console.log('hello hello!')
  const airbnbListings = await scrapeAirbnbListings({
    request,
    limit: 10,
  });
  console.log('hello hello')

  // await writeFile(
  //   "./airbnbListings.json",
  //   JSON.stringify(airbnbListings, null, 2),
  // );

  if (airbnbListings.length === 0) return;

  const airbnbPropertyIds = await tx
    .insert(properties)
    .values(airbnbListings.map((l) => l.property))
    .returning({ id: properties.id })
    .then((res) => res.map((r) => r.id));

  // await writeFile(
  //   "./airbnbPropertyIds.json",
  //   JSON.stringify(airbnbPropertyIds, null, 2),
  // );

  const flattenedReviews = airbnbListings
    .map(({ reviews }, i) =>
      reviews.map((r) => ({ ...r, propertyId: airbnbPropertyIds[i]! })),
    )
    .flat();

  // await writeFile(
  //   "./flattenedReviews.json",
  //   JSON.stringify(flattenedReviews, null, 2),
  // );

  if (flattenedReviews.length > 0) {
    await tx.insert(reviews).values(flattenedReviews);
  }
 
  const numNights = getNumNights(request.checkIn, request.checkOut);

  await tx.insert(offers).values(
    airbnbListings.map((l, i) => ({
      requestId,
      totalPrice: Math.round(l.nightlyPrice * numNights),
      travelerOfferedPrice: Math.round(l.nightlyPrice * numNights),
      hostPayout: Math.round(l.nightlyPrice * numNights),
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      propertyId: airbnbPropertyIds[i]!,
    })),
  );
}
