import { getCoordinates } from "@/server/google-maps";
import { emailPMFromCityRequest, emailWarmLeadsFromCityRequest } from "@/utils/outreach-utils";
import { requests } from "@/server/db/schema";
import { and, gte } from "drizzle-orm";
import { db } from "@/server/db";
import { getNumNights } from "@/utils/utils";
export default async function handler() {

  const requestsInLast10Minutes = await db.query.requests.findMany({
    where: and(
      gte(requests.createdAt, new Date(Date.now() - 10 * 60 * 1000)),
    ),
  });

  for (const request of requestsInLast10Minutes) {
    const coordinates = await getCoordinates(request.location);
    let lat = 0;
    let lng = 0;
    if (coordinates.location) {
      lat = coordinates.location.lat;
      lng = coordinates.location.lng;
    }

    const pricePerNight = request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut);
    const totalPrice = request.maxTotalPrice;

    // Send emails to property managers and warm leads
    void emailPMFromCityRequest({
      requestLocation: request.location,
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      numGuests: request.numGuests ?? 1,
      requestedLocationLatLng: {
        lat: lat,
        lng: lng,
      },
      requestId: request.id.toString(),
      pricePerNight: pricePerNight,
      totalPrice: totalPrice,
    });

    void emailWarmLeadsFromCityRequest({
      requestLocation: request.location,
      requestedLocationLatLng: {
        lat: lat,
        lng: lng,
      },
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      numGuests: request.numGuests ?? 1,
      requestId: request.id.toString(),
      pricePerNight: pricePerNight,
      totalPrice: totalPrice,
    });

  }
}
