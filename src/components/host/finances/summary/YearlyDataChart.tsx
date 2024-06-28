import React, { useState, useEffect } from "react";
import {
  format,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { Button } from "@/components/ui/button";
import ChartComponent from "../ChartComponent";
import { api } from "@/utils/api";
import type Stripe from "stripe";
import { formatCurrency } from "@/utils/utils";

const YearlyDataChart = ({
  hostStripeAccountId,
  becameHostYear,
}: {
  hostStripeAccountId: string | null;
  becameHostYear: number;
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [monthlyData, setMonthlyData] = useState<
    { date: string; Earnings: number }[] | undefined
  >();

  const { data: allPayments } =
    api.stripe.getAllTransactionPaymentsWithinInterval.useQuery(
      {
        stripeAccountId: hostStripeAccountId!,
        startDate: new Date(becameHostYear, 0, 1).getTime() / 1000,
        endDate: new Date(currentYear, 11, 31).getTime() / 1000,
      },
      {
        enabled: !!hostStripeAccountId,
      },
    );

  useEffect(() => {
    if (allPayments && selectedYear) {
      const transformedData = transformPaymentsToMonthlyChartData(
        allPayments,
        selectedYear,
      );
      setMonthlyData(transformedData);
    }
  }, [allPayments, selectedYear]);

  const transformPaymentsToMonthlyChartData = (
    payments: Stripe.BalanceTransaction[],
    year: number,
  ) => {
    const months = eachMonthOfInterval({
      start: startOfMonth(new Date(year, 0, 1)),
      end: endOfMonth(new Date(year, 11, 31)),
    });
    const monthlyData = months.map((month) => {
      const monthString = format(month, "MMM");
      const totalEarnings = payments
        .filter(
          (payment) =>
            format(new Date(payment.created * 1000), "yyyy-MM") ===
            format(month, "yyyy-MM"),
        )
        .reduce((sum, payment) => sum + payment.amount, 0);
      return {
        date: monthString,
        Earnings: totalEarnings,
      };
    });
    return monthlyData;
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  const availableYears = Array.from(
    { length: currentYear - becameHostYear + 1 },
    (_, i) => becameHostYear + i,
  );

  return (
    <div className="flex h-full w-full flex-col sm:w-[600px] xl:w-[800px] 2xl:w-[1100px]">
      <div className="flex items-center justify-between">
        <p className="left-2 top-6 text-start text-2xl lg:absolute">
          <strong>
            {monthlyData && monthlyData.length > 0
              ? formatCurrency(
                  monthlyData.reduce((sum, month) => sum + month.Earnings, 0),
                )
              : "0.00"}
          </strong>{" "}
          this year
        </p>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="rounded border p-2"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {monthlyData && (
        <ChartComponent
          data={monthlyData}
          dataKey="Earnings"
          xAxisDataKey="date"
        />
      )}
    </div>
  );
};

export default YearlyDataChart;
