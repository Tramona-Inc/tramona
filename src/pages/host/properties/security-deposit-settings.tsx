import React from "react";
import SecurityDepositOverview from "@/components/host/securityDeposit/SecurityDepositOverview";
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
        className="mt-4"
      >
        <ArrowLeftIcon size={20} className="text-black" />
        Back
      </Button>

      <SecurityDepositOverview />
    </DashboardLayout>
  );
}

export default Page;
