import React from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { api } from "@/utils/api";
import ResolvedClaimDetails from "@/components/my-trips/billing/travelerClaims/ResolvedClaimDetails";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "@/components/_common/BackButton";
import RespondToClaim from "@/components/my-trips/billing/travelerClaims/RespondToClaim";

function ClaimDetailsPage() {
  const router = useRouter();
  const claimId = router.query.id as string;
  const { data: claimDetails, isLoading } =
    api.claims.getClaimWithAllDetailsById.useQuery(claimId, {
      enabled: !!claimId,
    });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <p>Loading claim details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!claimDetails) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <p>Claim not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex w-full flex-row items-center justify-start">
          <BackButton href="/my-trips/billing/security-deposits" />
          <h1 className="mx-auto text-3xl font-bold">Claim Details</h1>
        </div>
        {claimDetails.claim.claimStatus === "Resolved" ? (
          <ResolvedClaimDetails claimDetails={claimDetails} />
        ) : (
          <RespondToClaim claimDetails={claimDetails} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default ClaimDetailsPage;
