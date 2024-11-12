import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import RequestToBookPage from "@/components/propertyPages/RequestToBookPage";
import { api } from "@/utils/api";

import Head from "next/head";
import { useRouter } from "next/router";

export default function Listings() {
  const router = useRouter();
  const propertyId = parseInt(router.query.id as string);

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
          {property ? <RequestToBookPage property={property} /> : <Spinner />}
        </div>
      </div>
    </DashboardLayout>
  );
}
