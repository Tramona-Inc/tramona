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
import { InfoIcon, ClockIcon, CheckCircleIcon } from "lucide-react";
import Spinner from "@/components/_common/Spinner";
import Link from "next/link";

function Page() {
  const router = useRouter();
  useSession({ required: true });
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

  const isClaimSubmitted = claimDetails?.claimStatus === "Submitted";
  const isClaimResolved = claimDetails?.claimStatus === "Resolved";

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
            <CardTitle>
              {isClaimSubmitted ? "Submit a Damage Claim" : "Claim Status"}
            </CardTitle>
            <CardDescription>
              {isClaimSubmitted
                ? "Use this form to report and claim compensation for damages caused by a guest to your property."
                : isClaimResolved
                  ? "Your claim has been resolved."
                  : "Your claim is currently under review."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isClaimSubmitted ? (
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
            ) : isClaimResolved ? (
              <Alert className="border-l-4 border-green-400 bg-green-50">
                <div className="flex items-center">
                  <CheckCircleIcon className="mr-2 h-6 w-6 text-green-700" />
                  <AlertTitle className="text-lg font-semibold text-green-900">
                    Claim Resolved
                  </AlertTitle>
                </div>
                <AlertDescription>
                  <p className="mt-2 text-green-900">
                    Your claim has been successfully resolved. Thank you for
                    your patience throughout this process.
                  </p>
                  <p className="mt-4 text-green-800">
                    If you have any questions about the resolution or need
                    further assistance, please don&apos;t hesitate to contact
                    our{" "}
                    <Link href="/help-center" className="font-medium underline">
                      support team
                    </Link>
                    .
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-l-4 border-yellow-400 bg-yellow-50">
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-6 w-6 text-yellow-700" />
                  <AlertTitle className="text-lg font-semibold text-yellow-900">
                    Claim Under Review
                  </AlertTitle>
                </div>
                <AlertDescription>
                  <p className="mt-2 text-yellow-900">
                    Your claim is currently being processed. Please allow{" "}
                    <span className="font-semibold">2-4 business days</span> for
                    our team to review your submission.
                  </p>
                  <p className="mt-4 text-yellow-800">
                    If you have any urgent questions or need to provide
                    additional information, please contact our{" "}
                    <span className="font-medium underline">support team</span>.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {isClaimSubmitted && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Add Claim Items</CardTitle>
              <CardDescription>
                List each damaged item separately. Be as specific as possible in
                your descriptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubmitAllClaimItemsForm
                tripId={claimDetails.tripId}
                claimId={claimId}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Page;
