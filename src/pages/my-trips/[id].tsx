import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TripPage from "@/components/my-trips/TripPage";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import { getNumNights } from "@/utils/utils";

export default function TripDetailsPage() {
  const router = useRouter();
  const tripId = parseInt(router.query.id as string);

  const { data: trips } = api.trips.getMyTripsPageDetails.useQuery(
    {
      tripId: tripId,
    },
    {
      enabled: router.isReady,
    },
  );

  

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      {trips ? <TripPage tripData={trips} /> : <Spinner />}
    </DashboardLayout>
  );
}
