import { scrapeDirectListings } from "@/server/direct-sites-scraping";
import { getNumNights } from "@/utils/utils";
import { db } from "@/server/db";
import { sendScheduledText } from "@/server/server-utils";

const requests_ = await db.query.requests
  .findMany({
    with: {
      offers: { with: { property: true } },
      madeByGroup: { with: { owner: true } },
    },
  })
  .then((res) =>
    res.filter((r) =>
      r.offers.some(
        (o) =>
          o.property.originalListingPlatform !== null &&
          o.property.originalListingPlatform !== "Airbnb",
      ),
    ),
  );

console.log(requests_);

for (const request of requests_) {
  console.log(`Scraping listings for request ${request.id}`);

  await scrapeDirectListings({
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    requestNightlyPrice:
      request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut),
    requestId: request.id,
    location: request.location,
    numGuests: request.numGuests,
  })
    .then(async (listings) => {
      if (listings.length > 0) {
        const travelerPhone = request.madeByGroup.owner.phoneNumber;
        if (travelerPhone) {
          const currentTime = new Date();
          const twentyFiveMinutesFromNow = new Date(
            currentTime.getTime() + 25 * 60000,
          );
          const fiftyFiveMinutesFromNow = new Date(
            currentTime.getTime() + 55 * 60000,
          );
          const numOfMatches = listings.length;
          void sendScheduledText({
            to: travelerPhone,
            content: `Tramona: You have ${numOfMatches <= 10 ? numOfMatches : "more than 10"} matches for your request in ${request.location}! Check them out at tramona.com/requests`,
            sendAt:
              numOfMatches <= 5
                ? twentyFiveMinutesFromNow
                : fiftyFiveMinutesFromNow,
          });
        }
      }
    })
    .then((listings) => {
      console.log(listings);
    })
    .catch((err) => {
      console.log(`Error scraping listings for request ${request.id}: ${err}`);
    });
}

process.exit(0);
