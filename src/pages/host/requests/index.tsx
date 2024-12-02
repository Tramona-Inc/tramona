import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequestsLayout from "@/components/dashboard/host/HostRequestsLayout";
import Head from "next/head";
import { Skeleton, SkeletonText } from "@/components/skeleton"; // 引入 Skeleton 组件
import { api } from "@/utils/api"; // 假设用于获取数据的 API

export default function Page() {
    const { data: requests, isLoading } = api.requests.getHostRequests.useQuery(); // 假设用于获取请求数据

    return (
        <DashboardLayout>
            <Head>
                <title>Offers & Requests | Tramona</title>
            </Head>
            {isLoading ? (
                <div className="space-y-4 p-4">
                    {/* Skeleton 占位符 */}
                    <SkeletonText className="w-1/3" />
                    <SkeletonText className="w-2/3" />
                    <Skeleton className="w-full h-48" />
                    <Skeleton className="w-full h-48" />
                </div>
            ) : (
                <HostRequestsLayout requests={requests} />
            )}
        </DashboardLayout>
    );
}
