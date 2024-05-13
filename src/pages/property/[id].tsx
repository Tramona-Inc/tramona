import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import PropertyPage from "@/components/property/PropertyPage";
import { api } from "@/utils/api";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Property() {
  const router = useRouter();
  const propertyId = parseInt(router.query.id as string);

  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    {
      enabled: router.isReady,
    },
  );

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>Listing Property | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          {property ? <PropertyPage property={property} /> : <Spinner />}
        </div>
      </div>
    </DashboardLayout>
  );
}
