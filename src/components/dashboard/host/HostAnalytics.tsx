import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BarChartIcon } from "lucide-react";
import { nightsBooked, revenue } from "./fake-host-data";
import { cn, formatCurrency } from "@/utils/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { sumBy } from "lodash";

export default function HostAnalytics({ className }: { className?: string }) {
  const totalRevenue = sumBy(revenue, (day) => day.total);
  const totalNightsBooked = sumBy(nightsBooked, (day) => day.total);

  const charts = [
    {
      name: "Revenue",
      summary: formatCurrency(totalRevenue),
      data: revenue,
      tickFormatter: formatCurrency,
    },
    {
      name: "Nights booked",
      summary: `${totalNightsBooked} nights`,
      data: nightsBooked,
      tickFormatter: (n: number) => `${n}`,
    },
  ] as const;

  type ChartName = (typeof charts)[number]["name"];

  const [curChartName, setCurChartName] = useState<ChartName>("Revenue");
  const curChart = charts.find((chart) => chart.name === curChartName)!;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <BarChartIcon />
            Analytics
          </div>
        </CardTitle>
        <CardDescription>Past 30 days</CardDescription>
      </CardHeader>
      <div className="flex border-t">
        {charts.map(({ name, summary }) => {
          const isSelected = name === curChartName;
          return (
            <button
              key={name}
              onClick={() => setCurChartName(name)}
              className="relative flex flex-col py-2 pr-6"
            >
              {isSelected && (
                <motion.div
                  layoutId="chart-indicator"
                  transition={{ duration: 0.1 }}
                  className="absolute left-0 right-6 top-0 h-[3px] bg-black"
                />
              )}
              <p
                className={cn(
                  "text-sm",
                  isSelected ? "text-black" : "text-muted-foreground",
                )}
              >
                {name}
              </p>
              <p
                className={cn(
                  "text-xl font-medium",
                  isSelected ? "text-primary" : "text-muted-foreground",
                )}
              >
                {summary}
              </p>
            </button>
          );
        })}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={curChart.data}>
            <Tooltip
              cursor={{ fill: "#eee" }}
              content={({ active, payload, label }) => {
                if (!active) return null;
                const total = payload?.[0]?.value ?? 0;

                return (
                  <div className="flex gap-4 rounded-md border bg-popover p-2 shadow">
                    <div className="-space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Date
                      </p>
                      <p className="text-lg font-bold">{label}</p>
                    </div>
                    <div className="-space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {curChart.name}
                      </p>
                      <p className="text-lg font-bold">
                        {curChart.tickFormatter(+total)}
                      </p>
                    </div>
                  </div>
                );
              }}
            />
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#999"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#999"
              fontSize={12}
              tickFormatter={curChart.tickFormatter}
              allowDecimals={false}
            />
            <Bar
              dataKey="total"
              radius={[2, 2, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
