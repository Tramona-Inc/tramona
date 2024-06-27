import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TripPage from "@/components/my-trips/TripPage";
import { useRouter } from "next/router";

export default function TripDetailsPage() {
  const router = useRouter();
  const tripId = parseInt(router.query.id as string);

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      <TripPage tripId={tripId} />
    </DashboardLayout>
  );
}
