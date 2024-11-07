import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import RequestToBookPage from "@/components/propertyPages/RequestToBookPage";
import { api } from "@/utils/api";

import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Listings() {
  useSession({ required: true });
  const router = useRouter();
  const { query } = useRouter();
  const propertyId = parseInt(router.query.id as string);
  const checkIn = query.checkIn
    ? new Date(query.checkIn as string)
    : new Date();
  const checkOut = query.checkOut
    ? new Date(query.checkOut as string)
    : new Date();
  const numGuests = query.numGuests ? parseInt(query.numGuests as string) : 2;
  const requestToBook = {
    checkIn,
    checkOut,
    numGuests,
  };
  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    { enabled: router.isReady },
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
          {property ? (
            <RequestToBookPage
              property={property}
              requestToBook={requestToBook}
            />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
