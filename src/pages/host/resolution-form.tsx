import { useEffect, useState } from "react";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Skeleton, SkeletonText } from "@/components/skeleton"; // 引入 Skeleton 组件

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          region: string;
          portalId: string;
          formId: string;
          target?: string;
        }) => void;
      };
    };
  }
}

export default function Page() {
  const [isFormLoading, setIsFormLoading] = useState(true); // 添加加载状态

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hsforms.net/forms/embed/v2.js";
    script.async = true;
    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na1",
          portalId: "6892479",
          formId: "5f8c32ea-58c1-4ff1-9b54-d75270a07740",
          target: "#hubspot-form-container",
        });
        setIsFormLoading(false); // 表单加载完成
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
      <DashboardLayout>
        <div className="mx-auto my-12 flex w-5/6 flex-col justify-center gap-y-10">
          <div className="flex w-full flex-row justify-center text-center text-5xl font-extrabold">
            <div className="w-full"> Resolution Form </div>
          </div>
          <div className="rounded-xl border p-8 shadow-md">
            {isFormLoading ? (
                <div className="space-y-4">
                  {/* Skeleton 占位符 */}
                  <SkeletonText className="w-1/2 mx-auto" />
                  <Skeleton className="w-full h-48" />
                </div>
            ) : (
                <div id="hubspot-form-container"></div>
            )}
          </div>
        </div>
      </DashboardLayout>
  );
}
