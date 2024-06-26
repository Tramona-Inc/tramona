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
  const { data: allPayouts } = api.stripe.listAllStripePayouts.useQuery(
    hostStripeAccountId!,
    {
      enabled: !!hostStripeAccountId,
    },
  );

  //for payment details
  const [visible, setVisible] = useState<boolean>(false);
  const onOpen = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="mx-2 flex flex-col gap-y-4">
      {isStripeConnectInstanceReady ? (
        <div className="mt-4 flex flex-col justify-between gap-x-4 gap-y-3 lg:flex-row">
          <Card className="w-1/2">
            <CardHeader className="text-xl font-bold">
              Transferred funds
            </CardHeader>
            <ConnectPayouts />
          </Card>
          <Card className="w-1/2">
            <CardHeader className="text-xl font-bold">
              Previous Transactions
            </CardHeader>
            <ConnectPayments />
          </Card>

          {visible && (
            <ConnectPaymentDetails
              payment="{{PAYMENT_OR_PAYMENT_INTENT_ID}}" // The ID of the Payment or PaymentIntent to display
              onClose={onClose}
            />
          )}
        </div>
      ) : (
        <div> not ready </div>
      )}
      <Card className="mt-2">
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
      </Card>
    </div>
  );
}

export default PaymentHistory;
