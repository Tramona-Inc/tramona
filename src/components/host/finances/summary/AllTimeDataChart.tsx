import React, { useState, useEffect } from "react";
import { format, eachYearOfInterval } from "date-fns";
import ChartComponent from "../ChartComponent";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import type Stripe from "stripe";

// Helper function to generate initial yearly data
const generateInitialYearlyData = (startYear: number, endYear: number) => {
  const extendedEndYear = endYear + 2;
  const years = eachYearOfInterval({
    start: new Date(startYear, 0, 1),
    end: new Date(extendedEndYear, 11, 31),
  });
  return years.map((year) => ({
    date: format(year, "yyyy"),
    Earnings: 0,
  }));
};

const AllTimeDataChart = ({
  hostStripeConnectId,
  becameHostYear,
}: {
  hostStripeConnectId: string | null;
  becameHostYear: number;
}) => {
  const currentYear = new Date().getFullYear();
  const [allTimeData, setAllTimeData] = useState<
    { date: string; Earnings: number }[]
  >(generateInitialYearlyData(becameHostYear, currentYear));

  const { data: allPayments } = api.stripe.getAllTransactionPayments.useQuery(
    hostStripeConnectId!,
    {
      enabled: !!hostStripeConnectId,
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
      <div className="flex items-center justify-center">
        <p className="left-14 top-4 mb-1 mt-4 text-start text-2xl lg:absolute">
          <strong>
            {allTimeData.length > 0
              ? formatCurrency(
                  allTimeData.reduce((sum, year) => sum + year.Earnings, 0),
                )
              : "0.00"}
          </strong>{" "}
          all time
        </p>
      </div>

      <ChartComponent
        data={allTimeData}
        dataKey="Earnings"
        xAxisDataKey="date"
      />
    </div>
  );
};

export default AllTimeDataChart;
