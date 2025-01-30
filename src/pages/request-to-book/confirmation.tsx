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

  return (
    <div>
      build stuff here just heads up you should be able to access all of the
      data needed with the
      <div>{requestToBookWProperty.id} </div>
    </div>
  );
}
