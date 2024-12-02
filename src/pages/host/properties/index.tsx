import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostPropertiesLayout from "@/components/dashboard/host/HostPropertiesLayout";
import Head from "next/head";
import { Skeleton, SkeletonText } from "@/components/skeleton"; // 引入 Skeleton 组件
import { useQuery } from "@/utils/api"; // 假设 HostPropertiesLayout 有数据查询逻辑

export default function Page() {
    const { data: properties, isLoading } = useQuery("host.getProperties"); // 假设有这个 API Hook

    return (
        <DashboardLayout>
            <Head>
                <title>Properties | Tramona</title>
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
                <HostPropertiesLayout properties={properties} />
            )}
        </DashboardLayout>
    );
}
