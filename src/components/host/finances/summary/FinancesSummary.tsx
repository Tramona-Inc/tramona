import { api } from "@/utils/api";
import SummaryChart from "@/components/host/finances/summary/SummaryChart";
import BalanceSummary from "@/components/host/finances/BalanceSummary";
import AccountBalanceCard from "@/components/host/finances/summary/AccountBalanceCard";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
export default function FinanceSummary({
  hostStripeAccountId,
  isStripeConnectInstanceReady,
  becameHostAt,
}: {
  hostStripeAccountId: string | null;
  isStripeConnectInstanceReady: boolean;
  becameHostAt: Date | undefined;
}) {
  const { data: accountBalance } =
    api.stripe.checkStripeConnectAccountBalance.useQuery(hostStripeAccountId!, {
      enabled: !!hostStripeAccountId,
    });

  const { data: externalBanks } = api.stripe.getConnectedExternalBank.useQuery(
    hostStripeAccountId!,
    {
      enabled: !!hostStripeAccountId,
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
      <div className="flex flex-col-reverse gap-x-5 gap-y-3 lg:flex-row">
        <SummaryChart
          becameHostAt={becameHostAt}
          hostStripeAccountId={hostStripeAccountId}
        />
        <Separator className="h-[2px] lg:hidden" />
        <div className="flex w-full flex-col gap-y-3">
          <BalanceSummary
            balance={totalCurrentBalance}
            isStripeConnectInstanceReady={isStripeConnectInstanceReady}
          />

          <AccountBalanceCard
            accountBalance={accountBalance}
            externalBanks={externalBanks}
          />
        </div>
      </div>
    </div>
  );
}
