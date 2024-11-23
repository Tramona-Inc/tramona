import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

import TravelerDisputes from "./TravelerDisputes";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "lucide-react";
import InnerTravelerLayout from "@/components/_common/Layout/DashboardLayout/InnerTravelerLayout";
import { Button } from "@/components/ui/button";

function SecurityDepositOverview() {
  const router = useRouter();
  const {
    data: claims,
    isLoading,
    error,
  } = api.claims.getCurrentAllClaimsAgainstTraveler.useQuery();

  const currentClaims = claims?.filter(
    (claim) => claim.claim.claimStatus !== "Resolved",
  );
  const previousClaims = claims?.filter(
    (claim) => claim.claim.claimStatus === "Resolved",
  );

  return (
    <InnerTravelerLayout title=" Traveler Dashboard: Deposit Status">
      <Tabs
        defaultValue="disputes"
        className="space-y-1"
        orientation="vertical"
      >
        <TabsList className="">
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="claim-history">Claim History</TabsTrigger>
        </TabsList>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.back()}
          className="gap-1 text-black"
        >
          <ArrowLeftIcon size={20} className="text-black" />
          Back
        </Button>
        <TabsContent value="disputes">
          <TravelerDisputes
            claims={currentClaims}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="claim-history">
          <TravelerDisputes
            claims={previousClaims}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>
    </InnerTravelerLayout>
  );
}

export default SecurityDepositOverview;
