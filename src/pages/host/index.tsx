import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostOverview from "@/components/dashboard/host/HostOverview";
import Head from "next/head";
import { Skeleton, SkeletonText } from "@/components/skeleton"; // 引入 Skeleton 组件
import { api } from "@/utils/api"; // 假设 API 查询逻辑

export default function Page() {
    const { data: overviewData, isLoading } = api.host.getOverview.useQuery(); // 假设 API 查询

    return (
        <DashboardLayout>
            <Head>
                <title>Host Dashboard | Tramona</title>
            </Head>
            {isLoading ? (
                <div className="space-y-4 p-4">
                    {/* Skeleton 占位符 */}
                    <SkeletonText className="w-1/3" />
                    <SkeletonText className="w-2/3" />
                    <Skeleton className="w-full h-32" />
                    <Skeleton className="w-full h-32" />
                </div>
            ) : (
                <HostOverview overviewData={overviewData} />
            )}
        </DashboardLayout>
    );
}
