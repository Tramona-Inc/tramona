import { db } from "@/server/db";
import { and, isNull, gt, notInArray } from "drizzle-orm";
import { appendFileSync } from "fs";
import { requests } from "@/server/db/schema";
import { NextApiResponse } from "next";
import { addHours, formatDistanceToNow } from "date-fns";

const processedRequestIds = [
  1248, 1249, 1250, 1251, 1291, 1300, 902, 1307, 1308, 903, 1311, 1312, 741,
  755, 756, 747, 797, 748, 764, 738, 732, 734, 742, 785, 779, 736, 737, 739,
  745, 752, 760, 763, 767, 768, 770, 771, 775, 776, 777, 783, 784, 787, 788,
  789, 790, 1317, 746, 1318, 803, 810, 811, 812, 814, 815, 816, 817, 820, 826,
  812, 827, 829, 830, 839, 830, 840, 859, 860, 864, 865, 798, 800, 801, 860,
  802, 804, 805, 823, 415, 416, 610, 1325,
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
      res.filter(
        (r) =>
          r.madeByGroup.owner.email === "bentomlin101@gmail.com" &&
          r.offers.every((o) => o.createdAt < addHours(new Date(), -24)),
      ),
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
    requests_.map(async (request) =>
      fetch("/api/scrape", {
        method: "POST",
        body: JSON.stringify({ requestId: request.id }),
      }),
    ),
  );

  res.status(200).json({ success: true });
}
