import { db } from "@/server/db";
import { eq, isNull, or } from "drizzle-orm";
import { requests } from "@/server/db/schema/tables/requests";
import { getCoordinates } from "@/server/google-maps";
import { haversineDistance } from "@/components/landing-page/SearchBars/useCityRequestForm";

const script = async() => {
  const allRequests = await db.query.requests.findMany({
    where:
      or(isNull(requests.lat), isNull(requests.lng), isNull(requests.radius)),
  });
  for (const req of allRequests) {
    const coordinates = await getCoordinates(req.location);
    if (coordinates.location) {
      let radius;
      if (coordinates.bounds) {
        radius = haversineDistance(coordinates.bounds.northeast.lat, coordinates.bounds.northeast.lng, coordinates.bounds.southwest.lat, coordinates.bounds.southwest.lng) / 2;
      } else {
        radius = 10;
      }
      await db.update(requests)
        .set(
          {
            lat: coordinates.location.lat,
            lng: coordinates.location.lng,
            radius,
          },
        ).
        where(eq(requests.id, req.id));
    }
  }

};

await script();