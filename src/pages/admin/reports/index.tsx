import React from "react";
import ClaimsOverview from "@/components/admin/claims/ClaimsOverview";
import AdditionalChargeListAndForm from "@/components/admin/claims/AdditionalChargeListAndForm";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminReportsPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="container">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.back()}
          className="-ml-4 mt-4"
        >
          <ArrowLeftIcon size={20} className="mr-2" />
          Back
        </Button>
        <h1 className="mb-6 text-center text-2xl font-bold">Admin Reports</h1>
        <Tabs defaultValue="claims-overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="claims-overview">Claims Overview</TabsTrigger>
            <TabsTrigger value="additional-charge">
              Create or Charge Claim
            </TabsTrigger>
          </TabsList>
          <TabsContent value="claims-overview">
            <ClaimsOverview />
          </TabsContent>
          <TabsContent value="additional-charge">
            <AdditionalChargeListAndForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
