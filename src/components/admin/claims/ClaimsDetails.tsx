import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Claim, ClaimResolution, ClaimItem } from "@/server/db/schema";
import { format } from "date-fns";

interface ClaimDetailsProps {
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
          <Card>
            <CardHeader>
              <CardTitle>Claim Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Requested Amount</TableHead>
                      <TableHead>Outstanding Amount</TableHead>
                      <TableHead>Property ID</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Resolved by Superhog</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claim.claimItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          {formatCurrency(item.requestedAmount)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.outstandingAmount ?? 0)}
                        </TableCell>
                        <TableCell>{item.propertyId}</TableCell>
                        <TableCell>
                          {format(item.createdAt!, "MM/dd/yyyy")}
                        </TableCell>
                        <TableCell>
                          {item.resolvedBySuperhog ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resolution">
          <Card>
            <CardHeader>
              <CardTitle>Claim Resolutions</CardTitle>
            </CardHeader>
            <CardContent>
              {claim.claimResolutions.length > 0 ? (
                claim.claimResolutions.map((resolution) => (
                  <div
                    key={resolution.id}
                    className="mb-4 rounded-lg border p-4"
                  >
                    <p className="font-medium">
                      Resolution Result:{" "}
                      <Badge>{resolution.resolutionResult}</Badge>
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Description:</span>{" "}
                      {resolution.resolutionDescription}
                    </p>
                    {resolution.resolvedByAdminId && (
                      <p className="mt-2">
                        <span className="font-medium">
                          Resolved By Admin ID:
                        </span>{" "}
                        {resolution.resolvedByAdminId}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p>No resolutions available for this claim.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
