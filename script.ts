// only run this script when on intermediate schemas

import { db } from "@/server/db";
import { offers } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const allOffers = await db.query.offers.findMany({
  with: { request: true },
});

for (const offer of allOffers) {
  if (offer.request === null) continue;
  await db
    .update(offers)
    .set({
      checkIn: offer.request.checkIn,
      checkOut: offer.request.checkOut,
      groupId: offer.request.madeByGroupId,
    })
    .where(eq(offers.id, offer.id));

  console.log(`Updated offer ${offer.id}`);
}

process.exit(0);
