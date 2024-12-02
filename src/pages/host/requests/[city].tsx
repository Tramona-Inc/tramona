import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequests from "@/components/dashboard/host/HostRequests";
import HostRequestsLayout from "@/components/dashboard/host/HostRequestsLayout";
import Head from "next/head";
import { Skeleton, SkeletonText } from "@/components/skeleton"; // 引入 Skeleton 组件
import { api } from "@/utils/api"; // 假设用于查询数据

export default function Page() {
    const { data: requests, isLoading } = api.requests.getHostRequests.useQuery(); // 假设有这个 API

    return (
        <DashboardLayout>
            <Head>
                <title>Offers & Requests | Tramona</title>
            </Head>
            <div className="hidden xl:block">
                <HostRequestsLayout>
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            {/* Skeleton 占位符 */}
                            <SkeletonText className="w-1/2" />
                            <SkeletonText className="w-1/3" />
                            <Skeleton className="w-full h-48" />
                            <Skeleton className="w-full h-48" />
                        </div>
                    ) : (
                        <HostRequests requests={requests} />
                    )}
                </HostRequestsLayout>
            </div>
            <div className="xl:hidden">
                <div className="mb-16">
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            {/* Skeleton 占位符 */}
                            <SkeletonText className="w-3/4" />
                            <SkeletonText className="w-full" />
                            <Skeleton className="w-full h-48" />
                        </div>
                    ) : (
                        <HostRequests requests={requests} />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
