import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Spinner from "@/components/_common/Spinner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/utils";
import {
  ConnectAccountManagement,
  ConnectPayouts,
} from "@stripe/react-connect-js";
import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import NoStripeAccount from "@/components/host/finances/NoStripeAccount";
import BalanceSummary from "@/components/host/finances/BalanceSummary";

export default function HostFinancesOverview({
  className,
  stripeAccountIdNumber,
  isStripeConnectInstanceReady,
  userRole,
}: {
  className?: string;
  stripeAccountIdNumber?: string | null | undefined;
  isStripeConnectInstanceReady: boolean;
  userRole: string;
}) {
  const { data: accountBalance } =
    api.stripe.checkStripeConnectAccountBalance.useQuery(
      stripeAccountIdNumber!,
      {
        enabled: !!stripeAccountIdNumber,
      },
    );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
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
      console.log("this is the total balance");
      console.log(totalCurrentBalance);
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
