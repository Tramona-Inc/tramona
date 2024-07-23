import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TripPage from "@/components/my-trips/TripPage";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function TripDetailsPage() {
  const router = useRouter();
  const [tripId, setTripId] = useState<number | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const id = parseInt(router.query.id as string, 10);
      if (isNaN(id)) {
        console.error("Invalid trip ID:", router.query.id);
      } else {
        setTripId(id);
      }
    }
  }, [router.isReady, router.query.id]);

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      {tripId && <TripPage tripId={tripId} />}
    </DashboardLayout>
  );
}
