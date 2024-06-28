import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import {
  ConnectPayments,
  ConnectPaymentDetails,
  ConnectPayouts,
} from "@stripe/react-connect-js";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PayoutCard from "./PayoutCard";

function PaymentHistory({
  hostStripeAccountId,
  isStripeConnectInstanceReady,
}: {
  hostStripeAccountId: string | null;
  isStripeConnectInstanceReady: boolean;
}) {
  // const { data: allPayouts } = api.stripe.listAllStripePayouts.useQuery(
  //   hostStripeAccountId!,
  //   {
  //     enabled: !!hostStripeAccountId,
  //   },
  // );

  return (
    <div className="mx-2 flex flex-col gap-y-4">
      <div className="mt-4 flex flex-col justify-between gap-x-4 gap-y-3 lg:flex-row">
        <Card className="lg:w-1/2">
          <CardHeader className="text-xl font-bold">
            Transferred funds
          </CardHeader>
          {isStripeConnectInstanceReady ? (
            <ConnectPayouts />
          ) : (
            <div>Loading</div>
          )}
        </Card>
        <Card className="lg:w-1/2">
          <CardHeader className="text-xl font-bold">
            Previous Transactions
          </CardHeader>
          {isStripeConnectInstanceReady ? (
            <ConnectPayments />
          ) : (
            <div>Loading</div>
          )}
        </Card>
      </div>
      {/* <Card className="mt-2">
        <CardHeader>
          <h2 className="text-2xl font-bold">Previous Payouts</h2>
        </CardHeader>
        <CardContent>
          {allPayouts && allPayouts.length > 0 ? (
            allPayouts.map((payout) => (
              <PayoutCard key={payout.id} payout={payout} />
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No previous payouts
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}

export default PaymentHistory;
