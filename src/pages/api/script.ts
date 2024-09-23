import { scrapeDirectListings } from "@/server/direct-sites-scraping";
import { getNumNights } from "@/utils/utils";
import { db } from "@/server/db";
import { sendScheduledText } from "@/server/server-utils";
import { offers } from "@/server/db/schema/tables/offers";
import { and, eq, isNull, inArray, gt } from "drizzle-orm";
import { appendFileSync } from "fs";
import { requests } from "@/server/db/schema";
import { NextApiResponse } from "next";
import { AxiosError } from "axios";

export function log(str: unknown) {
  appendFileSync(
    "script.log",
    typeof str === "string" ? str : JSON.stringify(str, null, 2),
  );

  appendFileSync("script.log", "\n");
}

export default async function script(_: any, res: NextApiResponse) {
  const requests_ = await db.query.requests.findMany({
    where: and(isNull(requests.resolvedAt), gt(requests.checkIn, new Date())),
    with: {
      offers: true,
      madeByGroup: { with: { owner: true } },
    },
  });

  // log(
  //   requests_.map((r) => ({
  //     id: r.id,
  //     location: r.location,
  //     numOffers: r.offers.length,
  //     requestMadeAt: formatDistanceToNow(r.createdAt),
  //   })),
  // );

  for (const request of requests_) {
    if (
      ["+14257657768", "+16124694886"].includes(
        request.madeByGroup.owner.phoneNumber ?? "",
      )
    ) {
      log(`Skipping request ${request.id} because it's already been processed`);
      continue;
    }

    log(`\nScraping listings for request ${request.id}`);
    const scrapedOffers = await db.query.offers.findMany({
      where: and(eq(offers.requestId, request.id)),
      with: { property: { columns: { originalListingPlatform: true } } },
    });

    const scrapedOfferIds = scrapedOffers
      .filter((o) => o.property.originalListingPlatform !== null)
      .map((o) => o.id);

    log(`Deleting ${scrapedOfferIds.length} offers for request ${request.id}`);

    await db.delete(offers).where(inArray(offers.id, scrapedOfferIds));

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
        if (listings.length === 0) {
          log(`No listings found for request ${request.id}`);
          return;
        }

        log(`Scraped ${listings.length} listings for request ${request.id}`);

        const travelerPhone = request.madeByGroup.owner.phoneNumber;
        if (!travelerPhone) {
          log(
            `No phone number for request ${request.id} made by user ${request.madeByGroup.owner.email}, skipping texts`,
          );
          return;
        }

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
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          log(
            `Error scraping listings for request ${request.id}: ${err.response?.statusText}\n\n${err.response?.data}`,
          );
        } else if (err instanceof Error) {
          log(
            `Error scraping listings for request ${request.id}: ${err.message}\n\n${err.stack}`,
          );
        }
      });
  }

  res.status(200).json({ success: true });
}
