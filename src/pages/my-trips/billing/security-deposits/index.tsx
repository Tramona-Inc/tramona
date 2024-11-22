import React from "react";
import SecurityDepositOverview from "@/components/my-trips/billing/travelerClaims/SecurityDepositOverview";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";

function Page() {
  return (
    <DashboardLayout>
      <SecurityDepositOverview />
    </DashboardLayout>
  );
}

export default Page;
