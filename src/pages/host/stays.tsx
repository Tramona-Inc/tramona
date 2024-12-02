import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostStays from "@/components/host/HostStays";
import { Skeleton, SkeletonText } from "@/components/skeleton"; // 引入 Skeleton 组件
import { api } from "@/utils/api"; // 假设用于数据查询的 API

export default function Page() {
    const { data: stays, isLoading } = api.stays.getHostStays.useQuery(); // 假设有 API Hook 获取 stays 数据

    return (
        <DashboardLayout>
            <div className="mx-auto mt-4 max-w-6xl px-4 md:mt-16">
                {isLoading ? (
                    <div className="space-y-4">
                        {/* Skeleton 占位符 */}
                        <SkeletonText className="w-1/3" />
                        <Skeleton className="w-full h-32" />
                        <Skeleton className="w-full h-32" />
                        <Skeleton className="w-full h-32" />
                    </div>
                ) : (
                    <HostStays stays={stays} />
                )}
            </div>
        </DashboardLayout>
    );
}
