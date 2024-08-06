import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TripPage from "@/components/my-trips/TripPage";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import SuccessfulBookingDialog from "@/components/my-trips/SuccessfulBookingDialog";

export default function TripDetailsPage() {
  const [open, setOpen] = useState(true);
  //const [openChange, setOpenChange] = useState();
  const router = useRouter();
  const { payment_intent } = router.query;

  // Ensure payment_intent is a string
  const paymentIntent = Array.isArray(payment_intent)
    ? payment_intent[0]
    : payment_intent;

  const { data: trip, refetch: fetchMyTrip } =
    api.trips.getMyTripsPageDetailsByPaymentIntentId.useQuery(
      {
        paymentIntentId: paymentIntent!,
      },
      {
        enabled: false,
      },
    );

  useEffect(() => {
    if (paymentIntent) {
      void fetchMyTrip();
      console.log(" trip", trip);
    }
  }, [paymentIntent]);

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      {trip ? (
        <div>
          <SuccessfulBookingDialog
            open={open}
            booking={trip}
            setOpen={setOpen}
          />
          <TripPage tripData={trip} isConfirmation={true} />
        </div>
      ) : (
        <Spinner />
      )}
    </DashboardLayout>
  );
}
