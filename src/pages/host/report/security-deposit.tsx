import React from "react";
import HostSecurityDepositSettings from "@/components/host/report/HostSecurityDepositSettings";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "lucide-react";

function Page() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => router.back()}
        className="mx-2 mt-4"
      >
        <ArrowLeftIcon size={20} className="text-black" />
        Back
      </Button>
      <HostSecurityDepositSettings />
    </DashboardLayout>
  );
}

export default Page;
