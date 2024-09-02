import { api } from "@/utils/api";
import SummaryChart from "@/components/host/finances/summary/SummaryChart";
import BalanceSummary from "@/components/host/finances/BalanceSummary";
import AccountBalanceCard from "@/components/host/finances/summary/AccountBalanceCard";
import { useEffect, useState } from "react";

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
      const accountPendingTotal = accountBalance.pending.reduce(
        (acc, item) => item.amount + acc,
        0,
      );
      const accountAvailableTotal = accountBalance.available.reduce(
        (acc, item) => item.amount + acc,
        0,
      );
      setTotalCurrentBalance(accountPendingTotal + accountAvailableTotal);
      console.log("this is the total balance");
      console.log(totalCurrentBalance);
    }
  }, [accountBalance, totalCurrentBalance]);

  return (
    <div className="mt-2 flex w-full flex-col justify-around gap-y-3">
      <div className="flex flex-col-reverse gap-x-5 lg:flex-row">
        <SummaryChart
          becameHostAt={becameHostAt}
          hostStripeConnectId={hostStripeConnectId}
        />
        <div className="flex w-full flex-col gap-y-3">
          <BalanceSummary
            balance={totalCurrentBalance}
            isStripeConnectInstanceReady={isStripeConnectInstanceReady}
            stripeConnectIdNumber={hostStripeConnectId}
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
