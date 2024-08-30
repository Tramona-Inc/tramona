import React, { useState, useEffect, useCallback, useMemo } from "react";
import { format, eachDayOfInterval, subDays, endOfToday } from "date-fns";
import ChartComponent from "../ChartComponent";
import { api } from "@/utils/api";
import type Stripe from "stripe";

// Helper function to generate initial daily data
const generateInitialDailyData = (start: Date, end: Date) => {
  const days = eachDayOfInterval({ start, end });
  return days.map((day) => ({
    date: format(day, "dd MMM"),
    Earnings: 0,
  }));
};

const LastThirtyDaysChart = ({
  hostStripeConnectId,
  setTotalRevenue,
}: {
  hostStripeConnectId: string | null | undefined;
  setTotalRevenue: (totalRevenue: number) => void;
}) => {
  const endDate = useMemo(() => endOfToday(), []);
  const startDate = useMemo(() => subDays(endDate, 29), [endDate]);
  const [monthlyData, setMonthlyData] = useState(
    generateInitialDailyData(startDate, endDate),
  );

  const { data: allPayments } =
    api.stripe.getAllTransactionPaymentsWithinInterval.useQuery(
      {
        stripeAccountId: hostStripeConnectId!,
        startDate: Math.floor(startDate.getTime() / 1000),
        endDate: Math.floor(endDate.getTime() / 1000),
      },
      {
        enabled: !!hostStripeConnectId,
      },
    );

  const transformPaymentsToDailyChartData = useCallback(
    (payments: Stripe.BalanceTransaction[], start: Date, end: Date) => {
      const days = eachDayOfInterval({ start, end });

      return days.map((day) => {
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
    },
    [],
  );

  useEffect(() => {
    if (allPayments) {
      const transformedData = transformPaymentsToDailyChartData(
        allPayments,
        startDate,
        endDate,
      );
      setMonthlyData(transformedData);
      const total = transformedData.reduce((sum, day) => sum + day.Earnings, 0);
      setTotalRevenue(total);
    }
  }, [
    allPayments,
    endDate,
    setTotalRevenue,
    startDate,
    transformPaymentsToDailyChartData,
  ]);

  const emptyData = generateInitialDailyData(startDate, endDate);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <ChartComponent
        data={hostStripeConnectId ? monthlyData : emptyData}
        dataKey="Earnings"
        xAxisDataKey="date"
        hideYAxis={!!emptyData}
      />
    </div>
  );
};

export default LastThirtyDaysChart;
