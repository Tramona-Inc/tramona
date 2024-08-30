import { ConnectPayments, ConnectPayouts } from "@stripe/react-connect-js";

import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import { Card, CardHeader } from "@/components/ui/card";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();

  return (
    <>
      <Head>
        <title>Cashback Payout | Tramona</title>
      </Head>
      <DashboardLayout>
        <div className="mx-20 my-10 flex flex-col gap-y-4">
          <Link href="/account/balance" className="flex flex-row gap-x-3">
            {" "}
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon /> Go back{" "}
            </Button>
          </Link>
          <div className="flex flex-col justify-between gap-x-4 gap-y-3 lg:flex-row">
            <Card className="lg:w-1/2">
              <CardHeader className="text-xl font-bold">
                Transferred funds
              </CardHeader>
              {isStripeConnectInstanceReady && <ConnectPayouts />}
            </Card>
            <Card className="lg:w-1/2">
              <CardHeader className="text-xl font-bold">
                Previous Transactions
              </CardHeader>
              {isStripeConnectInstanceReady && <ConnectPayments />}
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
