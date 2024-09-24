import { scrapeDirectListings } from "@/server/direct-sites-scraping";
import { getNumNights, sleep } from "@/utils/utils";
import { db } from "@/server/db";
import { sendScheduledText } from "@/server/server-utils";
import { and, isNull, gt, notInArray } from "drizzle-orm";
import { appendFileSync } from "fs";
import { requests } from "@/server/db/schema";
import { NextApiResponse } from "next";
import { formatDistanceToNow } from "date-fns";

const processedRequestIds = [
  1248, 1249, 1250, 1251, 1291, 1300, 902, 1307, 1308, 903, 1311, 1312, 741,
  755, 756, 747, 797, 748, 764, 738, 732, 734, 742, 785, 779, 736, 737, 739,
  745, 752, 760, 763, 767, 768, 770, 771, 775, 776, 777, 783, 784, 787, 788,
  789, 790, 1317, 746, 1318, 803, 810, 811, 812, 814, 815, 816, 817, 820, 826,
  812, 827, 829, 830, 839, 830, 840, 859, 860, 864, 865, 798, 800, 801, 860,
  802, 804, 805, 823,
];

export function log(str: unknown) {
  appendFileSync(
    "script.log",
    typeof str === "string" ? str : JSON.stringify(str, null, 2),
  );

  appendFileSync("script.log", "\n");
}

export default async function script(_: any, res: NextApiResponse) {
  const requests_ = await db.query.requests
    .findMany({
      where: and(
        isNull(requests.resolvedAt),
        gt(requests.checkIn, new Date()),
        gt(requests.createdAt, new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)),
        notInArray(requests.id, processedRequestIds),
      ),
      with: {
        offers: true,
        madeByGroup: { with: { owner: true } },
      },
    })
    .then((res) =>
      res.filter((r) => r.madeByGroup.owner.email === "bentomlin101@gmail.com"),
    );

  log(
    requests_.map((r) => ({
      id: r.id,
      location: r.location,
      numOffers: r.offers.length,
      requestMadeAt: formatDistanceToNow(r.createdAt),
    })),
  );

  await Promise.all(
    requests_.map(async (request, i) => {
      await sleep(i * 4000);
      if (
        ["+14257657768", "+16124694886"].includes(
          request.madeByGroup.owner.phoneNumber ?? "",
        )
      ) {
        log(
          `Skipping request ${request.id} because it's already been processed`,
        );
        return;
      }

      log(`\nScraping listings for request ${request.id}`);

      await scrapeDirectListings({
        checkIn: request.checkIn,
        checkOut: request.checkOut,
        requestNightlyPrice:
          request.maxTotalPrice /
          getNumNights(request.checkIn, request.checkOut),
        requestId: request.id,
        location: request.location,
        numGuests: request.numGuests,
      })
        .then(async (listings) => {
          if (listings.length === 0) {
            log(`No listings found for request ${request.id}`);
            return;
          }

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
          if (err instanceof Error) {
            log(
              `Error scraping listings for request ${request.id}:\n\n${err.stack}`,
            );
          } else {
            log(`Error scraping listings for request ${request.id}: ${err}`);
          }
        });
    }),
  );

  res.status(200).json({ success: true });
}
