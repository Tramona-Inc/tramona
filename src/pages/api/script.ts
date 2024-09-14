import { db } from "@/server/db";
import { eq, like, sql } from "drizzle-orm";
import { requests } from "@/server/db/schema/tables/requests";
import { getCoordinates } from "@/server/google-maps";
import { properties } from "@/server/db/schema";

const script = async () => {
  try {
    const allRequests = await db.query.requests.findMany();

    for (const req of allRequests) {
      const { location } = await getCoordinates(req.location);

      if (!location) {
        console.log(`Couldn't find coordinates for ${req.location}`);
        continue;
      }

      await db.update(requests).set({
        latLngPoint: sql`ST_SetSRID(ST_MakePoint(${location.lng}, ${location.lat}), 4326)`,
      }).where(
        eq(requests.id, req.id)
      );
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

const getRequests = async () => {
  try {
    const allRequests = await db.query.requests.findMany({
      where: like(requests.location, '%WA%'),
    });

    for (const prop of allRequests) {
      console.log(prop);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

await script();
