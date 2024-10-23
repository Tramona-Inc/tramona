import React from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import SubmitAllClaimItemsForm from "@/components/host/report/SubmitAllClaimItemsForm";
import ClaimDetailsCard from "@/components/host/report/ClaimDetailsCard";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Spinner from "@/components/_common/Spinner";

function Page() {
  const router = useRouter();
  const { data: session } = useSession({ required: true });
  const claimId = router.query.id as string;

  const { data: claimDetails, isLoading } =
    api.claims.getClaimDetailsWPropertyById.useQuery(
      { claimId: claimId },
      {
        enabled: !!claimId, // Only run query when claimId is available and valid
      },
    );

  if (!claimId) {
    return (
      <DashboardLayout>
        <div className="mx-5 mt-10 max-w-7xl lg:mx-auto">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Invalid claim ID. Please ensure you&apos;ve accessed this page
              correctly.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-5 mt-10 max-w-7xl lg:mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p>Loading claim details...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-5 my-8 max-w-7xl lg:mx-auto">
        {claimDetails ? (
          <ClaimDetailsCard claimDetails={claimDetails} />
        ) : (
          <Spinner />
        )}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Submit a Damage Claim</CardTitle>
            <CardDescription>
              Use this form to report and claim compensation for damages caused
              by a guest to your property.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Important Information</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  <li>
                    Provide clear, detailed descriptions of each damaged item.
                  </li>
                  <li>
                    Include clear photos of the damage for each item claimed.
                  </li>
                  <li>Be accurate with the requested compensation amount.</li>
                  <li>
                    Submit your claim within 14 days of the guest&apos;s
                    checkout.
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Add Claim Items</CardTitle>
            <CardDescription>
              List each damaged item separately. Be as specific as possible in
              your descriptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {claimDetails && (
              <SubmitAllClaimItemsForm
                tripId={claimDetails.tripId}
                claimId={claimId}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Page;
