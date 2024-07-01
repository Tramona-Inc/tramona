import React, { useState, useEffect } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import ChartComponent from "../ChartComponent";
import { months } from "@/utils/constants";
import { api } from "@/utils/api";
import type Stripe from "stripe";
import { formatCurrency } from "@/utils/utils";

const MonthlyDataChart = ({
  hostStripeAccountId,
}: {
  hostStripeAccountId: string | null;
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [monthlyData, setMonthlyData] = useState<
    { date: string; Earnings: number }[]
  >([]);

  const { data: allPayments } =
    api.stripe.getAllTransactionPaymentsWithinInterval.useQuery(
      {
        stripeAccountId: hostStripeAccountId!,
        startDate: new Date(currentYear, selectedMonth - 1, 1).getTime() / 1000,
        endDate: new Date(currentYear, selectedMonth, 0).getTime() / 1000,
      },
      {
        enabled: !!hostStripeAccountId,
      },
    );

  useEffect(() => {
    if (allPayments && selectedMonth) {
      const transformedData = transformPaymentsToDailyChartData(
        allPayments,
        currentYear,
        selectedMonth,
      );
      setMonthlyData(transformedData);
    }
  }, [allPayments, selectedMonth, currentYear]);

  const transformPaymentsToDailyChartData = (
    payments: Stripe.BalanceTransaction[],
    year: number,
    month: number,
  ) => {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));
    const days = eachDayOfInterval({ start, end });

    const dailyData = days.map((day) => {
      const dayString = format(day, "dd MMM");
      const totalEarnings = payments
        .filter((payment) => {
          const paymentDate = format(
            new Date(payment.created * 1000),
            "yyyy-MM-dd",
          );
          const currentDate = format(day, "yyyy-MM-dd");
          return paymentDate === currentDate;
        })
        .reduce((sum, payment) => sum + payment.amount, 0);
      return {
        date: dayString,
        Earnings: totalEarnings,
      };
    });

    return dailyData;
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  return (
    <div className="flex h-full w-full flex-col sm:w-[600px] xl:w-[800px] 2xl:w-[1100px]">
      <div className="flex items-center justify-center">
        <p className="left-14 top-4 mb-1 mt-4 text-start text-2xl lg:absolute">
          <strong>
            {monthlyData.length > 0
              ? formatCurrency(
                  monthlyData.reduce((sum, day) => sum + day.Earnings, 0),
                )
              : "0.00"}
          </strong>{" "}
          this month
        </p>
      </div>
      <ChartComponent
        data={monthlyData}
        dataKey="Earnings"
        xAxisDataKey="date"
      />
      <div className="my-3">
        {months.map((month, index) => (
          <Button
            key={month}
            onClick={() => handleMonthChange(index + 1)}
            size="sm"
            variant="outlineMinimal"
            className={`mr-2 inline-flex rounded-full px-4 py-2 ${
              selectedMonth === index + 1
                ? "bg-teal-800 text-white"
                : "text-black"
            }`}
            disabled={
              currentYear === new Date().getFullYear() &&
              index + 1 > new Date().getMonth() + 1
            }
          >
            {month}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MonthlyDataChart;
