import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TripPage from "@/components/my-trips/TripPage";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import SuccessfulBookingDialog from "@/components/my-trips/SuccessfulBookingDialog";
import { toast } from "@/components/ui/use-toast";

export default function TripDetailsPage() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const { payment_intent, redirect_status } = router.query;
  const paymentIntent =
    (Array.isArray(payment_intent) ? payment_intent[0] : payment_intent) ?? "";
  const redirectStatus =
    (Array.isArray(redirect_status) ? redirect_status[0] : redirect_status) ??
    "requires_payment_method";

  const validRedirectStatuses = [
    "succeeded",
    "processing",
    "requires_payment_method",
  ];

  const { data: trip, refetch: fetchMyTrip } =
    api.trips.getMyTripsPageDetailsByPaymentIntentId.useQuery(
      {
        paymentIntentId: paymentIntent,
      },
      {
        enabled: false,
      },
    );

  useEffect(() => {
    if (paymentIntent) {
      void fetchMyTrip();
    }
  }, [paymentIntent, fetchMyTrip]);

  useEffect(() => {
    if (trip && redirectStatus !== "succeeded") {
      toast({
        title: "Payment Failed",
        description: "Please try again",
      });

      void router.push(`/offer-checkout/${trip.trip.offerId}`);
    }
  }, [trip, redirectStatus, router]);

  return (
    <DashboardLayout>
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      {trip && validRedirectStatuses.includes(redirectStatus) ? (
        <div>
          {redirectStatus !== "succeeded" ? (
            <div>We need to redo your payment</div>
          ) : (
            <SuccessfulBookingDialog
              open={open}
              booking={trip}
              setOpen={setOpen}
            />
          )}
          <TripPage tripData={trip} isConfirmation={true} />
        </div>
      ) : (
        <Spinner />
      )}
    </DashboardLayout>
  );
}
