import React from "react";
import SecurityDepositOverview from "@/components/my-trips/billing/travelerClaims/SecurityDepositOverview";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

function Page() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => router.back()}
        className="mt-4 gap-1 text-black"
      >
        <ArrowLeftIcon size={20} className="text-black" />
        Back
      </Button>
      <SecurityDepositOverview />
    </DashboardLayout>
  );
}

export default Page;
