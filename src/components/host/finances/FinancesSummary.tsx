import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";

import type Stripe from "stripe";
import SummaryChart from "@/components/host/finances/SummaryChart";
import BalanceSummary from "@/components/host/finances/BalanceSummary";
import AccountBalanceCard from "@/components/host/finances/summary/AccountBalanceCard";
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
    api.stripe.checkStripeConnectAcountBalance.useQuery(hostStripeAccountId!, {
      enabled: !!hostStripeAccountId,
    });

  const { data: externalBanks } = api.stripe.getConnectedExternalBank.useQuery(
    hostStripeAccountId!,
    {
      enabled: !!hostStripeAccountId,
    },
  );

  return (
    <div className="mt-2 flex w-full flex-col justify-around gap-y-3">
      <div className="flex flex-row gap-x-5">
        <SummaryChart becameHostAt={becameHostAt} />
        <div className="flex flex-col gap-y-3">
          <BalanceSummary balance={1000} />
          <AccountBalanceCard
            accountBalance={accountBalance}
            externalBanks={externalBanks}
          />
        </div>
      </div>
    </div>
  );
}
