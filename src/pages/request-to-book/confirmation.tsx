import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import BidConfirmationDialog from "@/components/propertyPages/BidConfirmationDialog";
import RequestToBookPage from "@/components/propertyPages/RequestToBookPage";
import { api } from "@/utils/api";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { RouterOutputs } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import Link from "next/link";

export type requestToBookWProperty =
  RouterOutputs["requestsToBook"]["getRequestToBookByPaymentIntentId"];

export default function Listings() {
  const router = useRouter();

  const { payment_intent, redirect_status } = router.query;
  const paymentIntent =
    (Array.isArray(payment_intent) ? payment_intent[0] : payment_intent) ?? "";

  const redirectStatus =
    (Array.isArray(redirect_status) ? redirect_status[0] : redirect_status) ??
    "requires_payment_method";

  const { data: requestToBookWProperty, refetch } =
    api.requestsToBook.getRequestToBookByPaymentIntentId.useQuery(
      { paymentIntentId: paymentIntent },
      {
        enabled: !!paymentIntent && router.isReady,
      },
    );

  console.log(paymentIntent)
  console.log(requestToBookWProperty)

  useEffect(() => {
    if (paymentIntent) {
      void refetch();
    }
  }, [paymentIntent, refetch]);

  useEffect(() => {
    if (requestToBookWProperty && redirectStatus !== "succeeded") {
      toast({
        title: "Payment Failed",
        description: "Please try again",
      });

      void router.push(`/`);
    }
  }, [requestToBookWProperty, redirectStatus, router]);

  console.log(paymentIntent);
  console.log(requestToBookWProperty);

  if (router.isFallback) {
    return <h2>Loading</h2>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Request To Book | Tramona</title>
      </Head>
      <div className="p-4 pb-64">
        <div className="mx-auto max-w-7xl">
          {requestToBookWProperty ? (
            <RaahimsComponent requestToBookWProperty={requestToBookWProperty} />
          ) : (
            <Spinner />
          )}
        </div>
        {payment_intent && <BidConfirmationDialog isOpen={true} />}
      </div>
    </DashboardLayout>
  );
}

function RaahimsComponent({
  requestToBookWProperty,
}: {
  requestToBookWProperty: requestToBookWProperty;
}) {
  if (!requestToBookWProperty) return;

  // return (
  //   <div>
  //     build stuff here just heads up you should be able to access all of the
  //     data needed with the
  //     <div>{requestToBookWProperty.id} </div>
  //   </div>
  // );

  // Extracting necessary information from requestToBookWProperty
  const { property, checkIn, checkOut, amountAfterTravelerMarkupAndBeforeFees } = requestToBookWProperty;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-green-600">Your Bid Has Been Placed!</h1>
      <p className="mt-2 text-lg text-gray-700">
        Thank you for booking! Your bid has been successfully submitted. The host has 24 hours to respond.
      </p>

      {/* Property Information Section */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold">Booking Confirmation</h2>
        <div className="mt-2">
          {property.imageUrls && property.imageUrls.length > 0 && (
            <Image
              src={property.imageUrls[0]} // Display the first image
              alt={property.name}
              width={400} // Set appropriate width
              height={300} // Set appropriate height
              className="rounded-lg"
            />
          )}
        </div>
        <p className="mt-2 text-gray-600">
          <strong>Property Name:</strong> {property.name}
        </p>
        <p className="mt-1 text-gray-600">
          <strong>Property ID:</strong> {requestToBookWProperty.propertyId}
        </p>
        <p className="mt-1 text-gray-600">
          <strong>Check-in Date:</strong> {new Date(checkIn).toLocaleDateString()}
        </p>
        <p className="mt-1 text-gray-600">
          <strong>Check-out Date:</strong> {new Date(checkOut).toLocaleDateString()}
        </p>
        <p className="mt-1 text-gray-600">
          <strong>Bid Price:</strong> ${amountAfterTravelerMarkupAndBeforeFees / 100} {/* Assuming the price is in cents */}
        </p>
        <p className="mt-1 text-gray-600">
          <strong>Next Steps:</strong>
        </p>
        <ul className="list-disc list-inside mt-1 text-gray-600">
          <li>Place more bids to improve your chances of getting the best price.</li>
          <li>Submit requests to see exclusive prices that hosts are willing to offer.</li>
          <li>If one of your bids is accepted, it will be instantly booked and all other bids will be automatically withdrawn.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <Link href="/my-bids" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          View My Bids
        </Link>
        <Link href="/search" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Search More Properties
        </Link>
      </div>
    </div>
  );
}
