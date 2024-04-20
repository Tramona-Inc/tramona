import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { api } from "@/utils/api";

import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Property() {
  useSession({ required: true });
  const router = useRouter();
  const propertyId = parseInt(router.query.id as string);

  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    {
      enabled: router.isReady,
    },
  );

  console.log(property);

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>Listing Property | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          {property?.id}
          {/* {property ? <OfferPage offer={offer} /> : <Spinner />} */}
        </div>
      </div>
    </DashboardLayout>
  );
}
