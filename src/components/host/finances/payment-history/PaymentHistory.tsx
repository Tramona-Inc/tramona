import { ConnectPayments, ConnectPayouts } from "@stripe/react-connect-js";
import { Card, CardHeader } from "@/components/ui/card";

function PaymentHistory() {
  return (
    <div className="mx-2 flex flex-col gap-y-4">
      <div className="flex flex-col justify-between gap-x-4 gap-y-3 lg:flex-row">
        <Card className="lg:w-1/2">
          <CardHeader className="text-xl font-bold">
            Transferred funds
          </CardHeader>
          <ConnectPayouts />
        </Card>
        <Card className="lg:w-1/2">
          <CardHeader className="text-xl font-bold">
            Previous Transactions
          </CardHeader>
          <ConnectPayments />
        </Card>
      </div>
    </div>
  );
}

export default PaymentHistory;
