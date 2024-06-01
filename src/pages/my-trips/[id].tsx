import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import TripPage from "@/components/my-trips/TripPage";
import { type RouterOutputs, api } from "@/utils/api";
import { z } from "zod";

type RequestTrip = RouterOutputs["offers"]["getByIdWithDetails"];
type BidsTrip = RouterOutputs["myTrips"]["getBidByIdWithDetails"];

export default function TripDetailsPage() {
  useSession({ required: true });
  const router = useRouter();
  const tripId = parseInt(router.query.id as string);
  const tripType = z
    .enum(["request", "bid"])
    .catch("bid")
    .parse(router.query.type);

  const { data: trip } =
    tripType === "request"
      ? api.offers.getByIdWithDetails.useQuery(
          { id: tripId },
          { enabled: router.isReady },
        )
      : api.myTrips.getBidByIdWithDetails.useQuery(
          { id: tripId },
          { enabled: router.isReady },
        );

  function isRequestTrip(
    trip: RequestTrip | BidsTrip,
    tripType: string,
  ): trip is RequestTrip {
    return tripType === "request";
  }

  function isBidsTrip(
    trip: RequestTrip | BidsTrip,
    tripType: string,
  ): trip is BidsTrip {
    return tripType === "bid";
  }

  const normalizeTripData = (
    trip: RequestTrip | BidsTrip,
    tripType: string,
  ) => {
    if (isRequestTrip(trip, tripType)) {
      return {
        createdAt: trip.createdAt,
        totalPrice: trip.totalPrice,
        acceptedAt: trip.acceptedAt,
        id: trip.id,
        tramonaFee: trip.tramonaFee,
        checkIn: trip.request.checkIn,
        checkOut: trip.request.checkOut,
        numGuests: trip.request.numGuests,
        location: trip.request.location,
        madeByGroup: trip.request.madeByGroup,
        property: trip.property,
      };
    } else if (isBidsTrip(trip, tripType)) {
      return {
        createdAt: trip.createdAt,
        totalPrice: trip.amount, // Assuming amount is equivalent to totalPrice
        acceptedAt: trip.acceptedAt,
        id: trip.id,
        tramonaFee: null, // Assuming tramonaFee is not available for bids
        checkIn: trip.checkIn,
        checkOut: trip.checkOut,
        numGuests: trip.numGuests,
        location: null, // Assuming location is not available for bids
        madeByGroup: trip.madeByGroup,
        property: trip.property,
      };
    }
    return null;
  };
  let normalizedTrip;
  if (trip) {
    normalizedTrip = normalizeTripData({ trip, tripType });
  }

  if (router.isFallback) {
    return <h2>Loading</h2>;
  }

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>

      {normalizedTrip ? <TripPage trip={normalizedTrip} /> : <Spinner />}
    </DashboardLayout>
  );
}
