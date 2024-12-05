import React from "react";
import { type RouterOutputs } from "@/utils/api";
import ClaimsTable from "@/components/my-trips/billing/travelerClaims/ClaimsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

type Claims = RouterOutputs["claims"]["getCurrentAllClaimsAgainstTraveler"];

interface ClaimsPageProps {
  claims: Claims | undefined;
  isLoading: boolean;
  error: unknown;
}

export default function ClaimsPage({
  claims,
  isLoading,
  error,
}: ClaimsPageProps) {
  return (
    <div className="container mx-auto py-2">
      <Header title="Your Claims" />
      {isLoading && <LoadingSkeleton />}
      {error instanceof Error && <ErrorCard />}
      {!isLoading && !error && (
        <>
          {claims?.length ? <ClaimsTable claims={claims} /> : <NoClaimsCard />}
        </>
      )}
    </div>
  );
}

const Header = ({ title }: { title: string }) => (
  <h1 className="mb-6 text-3xl font-bold">{title}</h1>
);

const LoadingSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      {[...Array<number>(3)].map((_, index) => (
        <Skeleton
          key={index}
          className={`h-12 w-full ${index > 0 ? "mt-4" : ""}`}
        />
      ))}
    </CardContent>
  </Card>
);

const ErrorCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-red-500">Error</CardTitle>
    </CardHeader>
    <CardContent>
      <p>
        An error occurred while fetching your claims. Please try again later.
      </p>
    </CardContent>
  </Card>
);

const NoClaimsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>No Claims Found</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-4 text-lg font-semibold">You have no current claims</p>
      <p className="text-muted-foreground">
        When claims are filed against you, they will appear here.
      </p>
    </CardContent>
  </Card>
);
