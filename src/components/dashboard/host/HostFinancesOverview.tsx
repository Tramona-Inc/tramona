import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import BalanceSummary from "@/components/host/finances/BalanceSummary";

export default function HostFinancesOverview({
  className,
  stripeAccountIdNumber,
  isStripeConnectInstanceReady,
}: {
  className?: string;
  stripeAccountIdNumber?: string | null | undefined;
  isStripeConnectInstanceReady: boolean;
}) {
  const { data: accountBalance } =
    api.stripe.checkStripeConnectAccountBalance.useQuery(
      stripeAccountIdNumber!,
      {
        enabled: !!stripeAccountIdNumber,
      },
    );

  const [isClient, setIsClient] = useState(false);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState<number | null>(
    null,
  );

  //getting the real balance
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TagIcon />
          <CardTitle>Finances</CardTitle>
          <div className="flex-1" />
          <Button variant="ghost" asChild>
            <Link href="/host/finances">
              See all
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <BalanceSummary
          balance={totalCurrentBalance}
          isStripeConnectInstanceReady={isStripeConnectInstanceReady}
          stripeAccountIdNumber={stripeAccountIdNumber}
        />
      </CardContent>
    </Card>
  );
}
