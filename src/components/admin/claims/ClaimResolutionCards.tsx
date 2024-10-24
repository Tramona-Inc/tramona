import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClaimsWDetails } from "./ClaimsOverview";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/utils";
import { CalendarIcon, DollarSign, UserIcon } from "lucide-react";
import { GetBadgeByClaimStatus } from "@/components/_common/BadgeFunctions";

function ClaimResolutionCards({ claim }: { claim: ClaimsWDetails }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Claim Resolutions</span>
          <GetBadgeByClaimStatus claimStatus={claim.claim.claimStatus} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {claim.claimItemResolutions.length > 0 ? (
          <div className="space-y-6">
            {claim.claimItemResolutions.map((resolution, index) => {
              const correspondingClaimItem = claim.claimItems.find(
                (item) => item.id === resolution.claimItemId,
              );
              return (
                <div
                  key={resolution.id}
                  className="rounded-lg border bg-card p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Resolution {index + 1}
                    </h3>
                    <Badge
                      variant={getItemResolutionBadgeVariant(
                        resolution.resolutionResult!,
                      )}
                    >
                      {resolution.resolutionResult}
                    </Badge>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Description
                      </p>
                      <p className="mt-1">{resolution.resolutionDescription}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Amounts
                      </p>
                      <div className="mt-1 space-y-1">
                        <p className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Requested:</span>
                          <span className="ml-2">
                            {formatCurrency(
                              correspondingClaimItem?.requestedAmount ?? 0,
                            )}
                          </span>
                        </p>

                        <p className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Outstanding:</span>
                          <span className="ml-2">
                            {formatCurrency(
                              correspondingClaimItem?.outstandingAmount ?? 0,
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                    {resolution.resolvedByAdminId && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Resolved By
                        </p>
                        <p className="mt-1 flex items-center">
                          <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          Admin ID: {resolution.resolvedByAdminId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No resolutions available for this claim.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function getItemResolutionBadgeVariant(result: string) {
  switch (result) {
    case "Approved":
      return "green";
    case "Partially Approved":
      return "yellow";
    case "Rejected":
      return "red";
    case "Insufficient Evidence":
      return "red";
    default:
      return "secondary";
  }
}

export default ClaimResolutionCards;
