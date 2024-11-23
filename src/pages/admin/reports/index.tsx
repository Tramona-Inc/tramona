import React from "react";
import ClaimsOverview from "@/components/admin/claims/ClaimsOverview";
import AdditionalChargeListAndForm from "@/components/admin/claims/AdditionalChargeListAndForm";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/components/_common/BackButton";

export default function AdminReportsPage() {
  return (
    <DashboardLayout>
      <div className="container flex flex-col items-center">
        <BackButton href="/admin" />
        <h1 className="mb-6 text-center text-2xl font-bold">Admin Reports</h1>
        <Tabs defaultValue="claims-overview" className="mx-auto w-full">
          <TabsList className="mx-auto max-w-screen-2xl">
            <TabsTrigger value="claims-overview">Claims Overview</TabsTrigger>
            <TabsTrigger value="additional-charge">
              Create or Charge Claim
            </TabsTrigger>
            <TabsTrigger value="misconduct-overview">
              Misconduct Overview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="claims-overview">
            <ClaimsOverview />
          </TabsContent>
          <TabsContent value="additional-charge">
            <AdditionalChargeListAndForm />
          </TabsContent>
          <TabsContent value="misconduct-overview">
            This component does not exist yet
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
