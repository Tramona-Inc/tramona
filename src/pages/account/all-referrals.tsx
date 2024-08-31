import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { referralStatuses } from "@/components/account/cashback/data";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateMonthDayYear } from "@/utils/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { api } from "@/utils/api";

export default function AllReferrals() {
  const { data: fetchedRefEarnings } =
    api.referralCodes.getAllEarningsByReferralCode.useQuery();

  function badgeColor(status: string) {
    const referralStatus = referralStatuses.find(
      (badge) => badge.value === status,
    );

    if (!referralStatus) {
      return null;
    }

    return <Badge variant={referralStatus.color}>{referralStatus.label}</Badge>;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto space-y-2 p-4">
        <Link href="/account/balance">
          <ChevronLeft />
        </Link>
        <h1 className="text-center text-2xl font-bold">
          Cash Back on Referral
        </h1>
        <div className="divide-y">
          {fetchedRefEarnings?.length ? (
            fetchedRefEarnings.map((row) => (
              <div key={row.id} className="grid grid-cols-2 py-2">
                <div>
                  <div>{badgeColor(row.earningStatus!)}</div>
                  <h3 className="text-muted-foreground">
                    {formatDateMonthDayYear(row.createdAt)}
                  </h3>
                  <p className="font-semibold">{row.referee.name}</p>
                </div>
                <div className="text-end text-xl font-bold">
                  {formatCurrency(row.cashbackEarned)}
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-24 items-center justify-center">
              <p>No referrals yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
