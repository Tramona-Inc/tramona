import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TripPage from "@/components/my-trips/TripPage";
import Spinner from "@/components/_common/Spinner";
import { type RouterOutputs, api } from "@/utils/api";
import { z } from "zod";

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

  type RequestTrip = RouterOutputs["offers"]["getByIdWithDetails"];
  type BidsTrip = RouterOutputs["myTrips"]["getBidByIdWithDetails"];

  function normalizeTripData({
    trip,
    tripType,
  }:
    | {
        trip: RequestTrip;
        tripType: "request";
      }
    | {
        trip: BidsTrip;
        tripType: "bid";
      }) {
    if (tripType === "request") {
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
    } else {
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
  }

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
