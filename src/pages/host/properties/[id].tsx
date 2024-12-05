import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostPropertyInfo from "@/components/dashboard/host/HostPropertyInfo";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function Page() {
  useSession({ required: true });
  const router = useRouter();
  const propertyId = parseInt(router.query.id as string);

  const { data: property, isLoading } = api.properties.getById.useQuery(
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
      {isLoading ? (
        <div className="space-y-4 p-4">
          <SkeletonText className="w-1/2" />
          <SkeletonText className="w-3/4" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        property && <HostPropertyInfo property={property} />
      )}
    </HostDashboardLayout>
  );
}
