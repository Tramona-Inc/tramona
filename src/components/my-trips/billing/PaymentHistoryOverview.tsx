import React from "react";
import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner"; // Assume you have a Spinner component for loading state
import { format } from "date-fns"; // Optional: to format dates nicely
import { formatCurrency } from "@/utils/utils";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

function PaymentHistoryOverview() {
  const {
    data: paymentHistory,
    isLoading,
    error,
  } = api.trips.getMyTripsPaymentHistory.useQuery();
  const router = useRouter();

  return (
    <div className="w-full">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => router.back()}
        className="-ml-4 mt-4"
      >
        <ArrowLeftIcon size={20} className="text-black" />
        Back
      </Button>

      <h2 className="mb-7 w-full text-center text-xl font-semibold">
        {" "}
        Payment History{" "}
      </h2>
      {isLoading ? (
        <Spinner />
      ) : !paymentHistory ? (
        <p> No Payments</p>
      ) : (
        paymentHistory.map((trip, index) => (
          <div
            className="flex w-full flex-row justify-between border-b py-2"
            key={index}
          >
            <div className="font-bold"> {trip.property.name} </div>
            <div> {trip.property.city} </div>
            <div> {formatCurrency(trip.tripCheckout!.totalTripAmount)} </div>
            <div>
              {`${format(new Date(trip.checkIn), "MMM dd, yyyy")} - ${format(
                new Date(trip.checkOut),
                "MMM dd, yyyy",
              )}`}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PaymentHistoryOverview;
