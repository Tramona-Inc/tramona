import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClaimsWDetails } from "./ClaimsOverview";
import { Badge } from "@/components/ui/badge";

function ClaimResolutionForm({ claim }: { claim: ClaimsWDetails }) {
  console.log(claim);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Resolutions</CardTitle>
      </CardHeader>
      <CardContent>
        {claim.claimResolutions.length > 0 ? (
          claim.claimResolutions.map((resolution) => (
            <div key={resolution.id} className="mb-4 rounded-lg border p-4">
              <p className="font-medium">
                Resolution Result: <Badge>{resolution.resolutionResult}</Badge>
              </p>
              <p className="mt-2">
                <span className="font-medium">Description:</span>{" "}
                {resolution.resolutionDescription}
              </p>
              {resolution.resolvedByAdminId && (
                <p className="mt-2">
                  <span className="font-medium">Resolved By Admin ID:</span>{" "}
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
  );
}

export default ClaimResolutionForm;
