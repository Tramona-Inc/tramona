import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { formatDate } from "date-fns";

interface ClaimDetailsDialogProps {
  claim: {
    claim: Claim;
    claimItems: ClaimItem[];
    claimResolutions: ClaimResolution[];
  };
  onClose: () => void;
}

export default function ClaimDetailsDialog({
  claim,
  onClose,
}: ClaimDetailsDialogProps) {
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claim Details</DialogTitle>
        </DialogHeader>
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
                <div className="grid grid-cols-2 gap-4">
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
                      {formatDate(claim.claim.createdAt!, "MM/dd/yyyy")}
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
                          {formatDate(item.createdAt!, "MM/dd/yyyy")}
                        </TableCell>
                        <TableCell>
                          {item.resolvedBySuperhog ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
      </DialogContent>
    </Dialog>
  );
}
