import { api } from "@/utils/api";
import SummaryChart from "@/components/host/finances/summary/SummaryChart";
import BalanceSummary from "@/components/host/finances/BalanceSummary";
import AccountBalanceCard from "@/components/host/finances/summary/AccountBalanceCard";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import YearToDateSummaryCard from "@/pages/host/finances/_components/YearToDateSummaryCard";
export default function FinanceSummary({
  hostStripeConnectId,
  isStripeConnectInstanceReady,
  becameHostAt,
}: {
  hostStripeConnectId: string | null;
  isStripeConnectInstanceReady: boolean;
  becameHostAt: Date | undefined;
}) {
  const { data: accountBalance } =
    api.stripe.checkStripeConnectAccountBalance.useQuery(hostStripeConnectId!, {
      enabled: !!hostStripeConnectId,
    });

  const { data: externalBanks } = api.stripe.getConnectedExternalBank.useQuery(
    hostStripeConnectId!,
    {
      enabled: !!hostStripeConnectId,
    },
  );

  const [totalCurrentBalance, setTotalCurrentBalance] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (accountBalance) {
      const accountPendingTotal = accountBalance.pending.reduce((acc, item) => {
        return item.amount + acc;
      }, 0);
      const accountAvailableTotal = accountBalance.available.reduce(
        (acc, item) => {
          return item.amount + acc;
        },
        0,
      );
      setTotalCurrentBalance(accountPendingTotal + accountAvailableTotal);
    }
  }, [accountBalance]);

  return (
    <div className="flex w-full flex-col justify-around gap-y-3">
      <div className="flex flex-col gap-x-5 gap-y-3 lg:flex-row">
        <SummaryChart
          becameHostAt={becameHostAt}
          hostStripeConnectId={hostStripeConnectId}
        />
        <Separator className="h-[2px] lg:hidden" />
        <div className="flex w-full flex-col gap-y-3">
          <YearToDateSummaryCard />
        </div>
      </div>
    </div>
  );
}
