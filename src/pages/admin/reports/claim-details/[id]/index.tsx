import { useRouter } from "next/router";
import { api } from "@/utils/api";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import ClaimDetails from "@/components/admin/claims/ClaimsDetails";
import BackButton from "@/components/_common/BackButton";

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
      <BackButton href="/admin/reports" />
      {claim && <ClaimDetails claim={claim} />}
    </DashboardLayout>
  );
}
