import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TripPage from "@/components/my-trips/TripPage";
import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";

export default function TripDetailsPage() {
  useSession({ required: true });
  const router = useRouter();
  const tripId = parseInt(router.query.id as string);

  const { data: trip } = api.offers.getByIdWithDetails.useQuery(
    { id: tripId },
    { enabled: router.isReady },
  );

  if (router.isFallback) {
    return <h2>Loading</h2>;
  }

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>

      {trip ? <TripPage trip={trip} /> : <Spinner />}
    </DashboardLayout>
  );
}
