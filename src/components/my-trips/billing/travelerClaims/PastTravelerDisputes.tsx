import React from "react";
import { api } from "@/utils/api";
import ClaimsTable from "@/components/my-trips/billing/travelerClaims/ClaimsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function ClaimsPage() {
  const {
    data: allCurrentClaims,
    isLoading,
    error,
  } = api.claims.getCurrentAllClaimsAgainstTraveler.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-3xl font-bold">Your Claims</h1>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="mt-4 h-12 w-full" />
            <Skeleton className="mt-4 h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-3xl font-bold">Your Claims</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              An error occurred while fetching your claims. Please try again
              later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Claims</h1>
      {allCurrentClaims.length > 0 ? (
        <ClaimsTable claims={allCurrentClaims} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Claims Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">
              You have no current claims
            </p>
            <p className="text-muted-foreground">
              When claims are filed against you, they will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
