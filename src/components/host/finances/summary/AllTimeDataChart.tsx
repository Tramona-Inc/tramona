import React, { useState, useEffect, SetStateAction } from "react";
import {
  eachDayOfInterval,
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  eachYearOfInterval,
} from "date-fns";
import { Button } from "@/components/ui/button";
import ChartComponent from "../ChartComponent";
import { months } from "@/utils/constants";
import { api } from "@/utils/api";
import Stripe from "stripe";
import { formatCurrency } from "@/utils/utils";

const AllTimeDataChart = ({
  hostStripeAccountId,
  becameHostYear,
}: {
  hostStripeAccountId: string | null;
  becameHostYear: number;
}) => {
  const currentYear = new Date().getFullYear();
  const [allTimeData, setAllTimeData] = useState<
    { date: string; Earnings: number }[] | undefined
  >();

  const { data: allPayments } = api.stripe.getAllTransactionPayments.useQuery(
    hostStripeAccountId!,
    {
      enabled: !!hostStripeAccountId,
    },
  );

  useEffect(() => {
    if (allPayments) {
      const transformedData = transformPaymentsToChartData(
        allPayments,
        becameHostYear,
        currentYear,
      );
      setAllTimeData(transformedData);
    }
  }, [allPayments, becameHostYear, currentYear]);

  const transformPaymentsToChartData = (
    payments: Stripe.BalanceTransaction[],
    startYear: number,
    endYear: number,
  ) => {
    const extendedEndYear = endYear + 2;
    const years = eachYearOfInterval({
      start: new Date(startYear, 0, 1),
      end: new Date(extendedEndYear, 11, 31),
    });
    const yearlyData = years.map((year) => {
      const yearString = format(year, "yyyy");
      const totalEarnings = payments
        .filter(
          (payment) =>
            format(new Date(payment.created * 1000), "yyyy") === yearString,
        )
        .reduce((sum, payment) => sum + payment.amount, 0);
      return {
        date: yearString,
        Earnings: totalEarnings,
      };
    });
    return yearlyData;
  };

  return (
    <div className="flex h-full w-full flex-col sm:w-[600px] xl:w-[800px] 2xl:w-[1100px]">
      <p className="top-6 text-start text-2xl lg:absolute xl:left-4">
        <strong>
          {allTimeData && allTimeData.length > 0
            ? formatCurrency(
                allTimeData.reduce((sum, year) => sum + year.Earnings, 0),
              )
            : "0.00"}
        </strong>{" "}
        all time
      </p>
      {allTimeData && (
        <ChartComponent
          data={allTimeData}
          dataKey="Earnings"
          xAxisDataKey="date"
        />
      )}
    </div>
  );
};

export default AllTimeDataChart;
