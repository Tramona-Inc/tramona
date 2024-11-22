import React from "react";
import SecurityDepositOverview from "@/components/my-trips/billing/travelerClaims/SecurityDepositOverview";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useRouter } from "next/router";

function Page() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <SecurityDepositOverview />
    </DashboardLayout>
  );
}

export default Page;
