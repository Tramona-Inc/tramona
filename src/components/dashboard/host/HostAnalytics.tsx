import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BarChartIcon } from "lucide-react";
import { formatCurrency } from "@/utils/utils";
import { useState } from "react";
import LastThirtyDaysChart from "@/components/host/finances/summary/LastThirtyDaysChart";

export default function HostAnalytics({
  className,
  stripeConnectIdNumber,
}: {
  className?: string;
  stripeConnectIdNumber: string | null | undefined;
}) {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <BarChartIcon />
            Analytics
          </div>
        </CardTitle>
        <CardDescription>
          <span className="text-base font-bold text-black">
            {formatCurrency(totalRevenue)}
          </span>{" "}
          Past 30 days
        </CardDescription>
      </CardHeader>
      <div className="relative flex border-t">
        <LastThirtyDaysChart
          hostStripeConnectId={stripeConnectIdNumber}
          setTotalRevenue={setTotalRevenue}
        />
      </div>
    </Card>
  );
}
