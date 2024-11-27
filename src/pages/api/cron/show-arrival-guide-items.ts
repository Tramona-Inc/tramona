import { db } from "@/server/db";
import { trips } from "@/server/db/schema";
import { and, gte, lte } from "drizzle-orm";

export default async function showArrivalGuideItems() {
  const upcomingTrips = await findTripsWithin48HoursOfCheckIn();
  if (upcomingTrips.length > 0) {
    for (const trip of upcomingTrips) {
      await db.update(trips).set({ ...trip, isLessThan24Hours: true });
    }
  }
}

async function findTripsWithin48HoursOfCheckIn() {
  // now: current date and time
  const now = new Date();
  // targetDate: 48 hours from now
  const targetDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const upcomingTrips = await db.query.trips.findMany({
    where: and(gte(trips.checkIn, now), lte(trips.checkIn, targetDate)),
  });

  console.log(upcomingTrips);
  return upcomingTrips;
}
