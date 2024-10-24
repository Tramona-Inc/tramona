import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import type { Claim, ClaimItemResolution, ClaimItem } from "@/server/db/schema";
import { format } from "date-fns";
import ClaimResolutionCards from "./ClaimResolutionCards";
import ClaimItemsInClaim from "./ClaimItemsInClaim";
import { Button } from "@/components/ui/button";
import { MessageCircle, XCircleIcon } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
export interface ClaimDetailsProps {
  claim: {
    claim: Claim;
    claimItems: ClaimItem[];
    claimItemResolutions: ClaimItemResolution[];
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

  const { mutateAsync: closeClaim } = api.claims.closeClaim.useMutation();

  const handleCloseClaim = async () => {
    await closeClaim({
      claimId: claim.claim.id,
    }).then(() => {
      toast({
        title: "Claim Closed Successfully",
        description:
          "The claim has been successfully closed and marked as resolved.",
      });
    });
  };

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
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="primary">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Host
              </Button>
              <Button variant="primary" onClick={handleCloseClaim}>
                <XCircleIcon className="mr-2 h-4 w-4" />
                Close Claim
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="items">
          <ClaimItemsInClaim claim={claim} />
        </TabsContent>
        <TabsContent value="resolution">
          <ClaimResolutionCards claim={claim} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
