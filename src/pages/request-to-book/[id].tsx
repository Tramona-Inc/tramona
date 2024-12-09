import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import BidConfirmationDialog from "@/components/propertyPages/BidConfirmationDialog";
import RequestToBookPage from "@/components/propertyPages/RequestToBookPage";
import { api } from "@/utils/api";

import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Listings() {
  const router = useRouter();
  const propertyId = useMemo(
    () => parseInt(router.query.id as string),
    [router.query.id],
  );
  const payment_intent = useMemo(
    () => router.query.payment_intent as string,
    [router.query.payment_intent],
  );

  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    {
      enabled: router.isReady,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
  );

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
          {property ? <RequestToBookPage property={property} /> : <Spinner />}
        </div>
        {payment_intent && <BidConfirmationDialog isOpen={true} />}
      </div>
    </DashboardLayout>
  );
}
