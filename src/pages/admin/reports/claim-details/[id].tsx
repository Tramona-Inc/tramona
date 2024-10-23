import { useRouter } from "next/router";
import { api } from "@/utils/api";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import ClaimDetails from "@/components/admin/claims/ClaimsDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const claimId = router.query.id as string;
  const { data: claim } = api.claims.getClaimWithAllDetailsById.useQuery(
    claimId,
    {
      enabled: !!claimId,
    },
  );
  console.log(claim);
  return (
    <DashboardLayout>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => router.back()}
        className="ml-3 mt-4 self-start"
      >
        <ArrowLeftIcon size={20} />
        Back
      </Button>{" "}
      {claim && <ClaimDetails claim={claim} />}
    </DashboardLayout>
  );
}
