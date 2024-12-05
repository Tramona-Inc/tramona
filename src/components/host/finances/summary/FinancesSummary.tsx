import SummaryChart from "@/components/host/finances/summary/SummaryChart";
import { Separator } from "@/components/ui/separator";
import YearToDateSummaryCard from "@/components/host/finances/YearToDateSummaryCard";
export default function FinanceSummary({
  hostStripeConnectId,
  becameHostAt,
}: {
  hostStripeConnectId: string | null;
  becameHostAt: Date | undefined;
}) {
  return (
    <div className="flex w-full flex-col gap-x-5 gap-y-3 lg:flex-row">
      <SummaryChart
        becameHostAt={becameHostAt}
        hostStripeConnectId={hostStripeConnectId}
      />
      <Separator className="h-[2px] lg:hidden" />
      <YearToDateSummaryCard />
    </div>
  );
}
