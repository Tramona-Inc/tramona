import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/utils"; // Assuming you have this utility function
import type Stripe from "stripe";

const PayoutCard = ({ payout }: { payout: Stripe.Payout }) => (
  <Card className="mb-4 transition-shadow hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {payout.currency === "usd"
              ? formatCurrency(payout.amount)
              : `${payout.amount} ${payout.currency.toUpperCase()}`}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(payout.arrival_date).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={payout.status === "paid" ? "green" : "red"}>
          {payout.status}
        </Badge>
      </div>
      {payout.failure_message && (
        <p className="mt-2 text-sm text-red-500">{payout.failure_message}</p>
      )}
    </CardContent>
  </Card>
);

export default PayoutCard;
