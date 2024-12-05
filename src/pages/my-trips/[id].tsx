import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TripPage from "@/components/my-trips/TripPage";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";

export default function TripDetailsPage() {
  const router = useRouter();
  const tripId = parseInt(router.query.id as string);

  const { data: trip } = api.trips.getMyTripsPageDetails.useQuery(
    { tripId: tripId },
    { enabled: router.isReady },
  );

  return (
    <DashboardLayout>
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      {trip ? <TripPage tripData={trip} /> : <Spinner />}
    </DashboardLayout>
  );
}
