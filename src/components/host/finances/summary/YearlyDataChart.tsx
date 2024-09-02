import React, { useState, useEffect } from "react";
import {
  format,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { Button } from "@/components/ui/button";
import ChartComponent from "../ChartComponent";
import { api } from "@/utils/api";
import type Stripe from "stripe";
import { formatCurrency } from "@/utils/utils";

// Helper function to generate initial monthly data
const generateInitialMonthlyData = (year: number) => {
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 11, 31)),
  });
  return months.map((month) => ({
    date: format(month, "MMM"),
    Earnings: 0,
  }));
};

const YearlyDataChart = ({
  hostStripeConnectId,
  becameHostYear,
}: {
  hostStripeConnectId: string | null;
  becameHostYear: number;
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [monthlyData, setMonthlyData] = useState<
    { date: string; Earnings: number }[]
  >(generateInitialMonthlyData(currentYear));

  const { data: allPayments } =
    api.stripe.getAllTransactionPaymentsWithinInterval.useQuery(
      {
        stripeAccountId: hostStripeConnectId!,
        startDate: new Date(becameHostYear, 0, 1).getTime() / 1000,
        endDate: new Date(currentYear, 11, 31).getTime() / 1000,
      },
      {
        enabled: !!hostStripeConnectId,
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

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setMonthlyData(generateInitialMonthlyData(year)); // Reset monthly data when the year changes
  };

  const availableYears = Array.from(
    { length: currentYear - becameHostYear + 1 },
    (_, i) => becameHostYear + i,
  );

  return (
    <div className="flex h-full w-full flex-col items-center sm:w-[600px] xl:w-[800px] 2xl:w-[1100px]">
      <div className="flex items-center justify-center">
        <p className="left-14 top-4 mb-1 mt-4 text-start text-2xl lg:absolute">
          <strong>
            {monthlyData.length > 0
              ? formatCurrency(
                  monthlyData.reduce((sum, month) => sum + month.Earnings, 0),
                )
              : "0.00"}
          </strong>{" "}
          this year
        </p>
      </div>

      <ChartComponent
        data={monthlyData}
        dataKey="Earnings"
        xAxisDataKey="date"
      />

      <div className="my-3">
        {availableYears.map((year) => (
          <Button
            key={year}
            onClick={() => handleYearChange(year)}
            size="sm"
            variant="outlineMinimal"
            className={`mr-2 inline-flex rounded-full px-4 py-2 ${
              selectedYear === year ? "bg-teal-800 text-white" : "text-black"
            }`}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default YearlyDataChart;
