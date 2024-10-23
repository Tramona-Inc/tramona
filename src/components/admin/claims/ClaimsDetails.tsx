import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import type { Claim, ClaimResolution, ClaimItem } from "@/server/db/schema";
import { format } from "date-fns";
import ClaimResolutionForm from "./ClaimResolutionForm";
import ClaimItemsInClaim from "./ClaimItemsInClaim";

export interface ClaimDetailsProps {
  claim: {
    claim: Claim;
    claimItems: ClaimItem[];
    claimResolutions: ClaimResolution[];
  };
}

export default function ClaimDetails({ claim }: ClaimDetailsProps) {
  function calculateProgress(
    claimStatus: "Submitted" | "In Review" | "Resolved",
  ) {
    if (claimStatus === "Submitted") return 33;
    if (claimStatus === "In Review") return 66;
    return 100;
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Claim Details</h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Claim Items</TabsTrigger>
          <TabsTrigger value="resolution">Resolution</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Claim Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Claim ID</p>
                  <p className="text-sm">{claim.claim.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Trip ID</p>
                  <p className="text-sm">{claim.claim.tripId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Filed By Host ID</p>
                  <p className="text-sm">{claim.claim.filedByHostId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge>{claim.claim.claimStatus}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm">
                    {format(claim.claim.createdAt!, "MM/dd/yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Superhog Request ID</p>
                  <p className="text-sm">{claim.claim.superhogRequestId}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Claim Progress</p>
                <Progress
                  value={calculateProgress(claim.claim.claimStatus!)}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="items">
          <ClaimItemsInClaim claim={claim} />
        </TabsContent>
        <TabsContent value="resolution">
          <ClaimResolutionForm claim={claim} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
