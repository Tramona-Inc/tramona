import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostPropertiesLayout from "@/components/dashboard/host/HostPropertiesLayout";
import HostPropertyInfo from "@/components/dashboard/host/HostPropertyInfo";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  useSession({ required: true });
  const router = useRouter();
  const propertyId = parseInt(router.query.id as string);

  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    {
      enabled: router.isReady,
    },
  );

  return (
    <HostDashboardLayout>
      <Head>
        <title>Properties | Tramona</title>
      </Head>
      {property && <HostPropertyInfo property={property} />}
    </HostDashboardLayout>
  );
}
