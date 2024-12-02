import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostPropertiesLayout from "@/components/dashboard/host/HostPropertiesLayout";
import HostPropertyInfo from "@/components/dashboard/host/HostPropertyInfo";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Skeleton, SkeletonText } from "@/components/skeleton"; // 引入 Skeleton 组件

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
        <DashboardLayout>
            <Head>
                <title>Properties | Tramona</title>
            </Head>
            <div className="hidden xl:block">
                <HostPropertiesLayout>
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            {/* Skeleton 占位符 */}
                            <SkeletonText className="w-1/3" />
                            <SkeletonText className="w-1/2" />
                            <Skeleton className="w-full h-48" />
                        </div>
                    ) : (
                        property && <HostPropertyInfo property={property} />
                    )}
                </HostPropertiesLayout>
            </div>
            <div className="xl:hidden">
                <div className="mb-6">
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            {/* Skeleton 占位符 */}
                            <SkeletonText className="w-1/2" />
                            <SkeletonText className="w-3/4" />
                            <Skeleton className="w-full h-48" />
                        </div>
                    ) : (
                        property && <HostPropertyInfo property={property} />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
