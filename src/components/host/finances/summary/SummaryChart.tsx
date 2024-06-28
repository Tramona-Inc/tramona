import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartComponent from "../ChartComponent";
import { months } from "@/utils/constants";
import { api } from "@utils/api";
import MonthlyDataChart from "./MonthlyDataChart";
import AllTimeDataChart from "./AllTimeDataChart";
import YearlyDataChart from "./YearlyDataChart";

const generateMonthlyData = (year, month) => {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => ({
    date: format(day, "dd MMM"),
    Earnings: Math.floor(Math.random() * 100), // Example earnings data
  }));
};

const generateYearlyData = (year) => {
  const start = startOfYear(new Date(year, 0));
  const end = endOfYear(new Date(year, 0));
  const months = eachMonthOfInterval({ start, end });

  return months.map((month) => ({
    date: format(month, "MMM"),
    Earnings: Math.floor(Math.random() * 1000 + 500), // Example yearly earnings data
  }));
};

const generateAllTimeData = (startYear, endYear) => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const years = eachYearOfInterval({ start, end });

  return years.map((year) => ({
    date: format(year, "yyyy"),
    Earnings: Math.floor(Math.random() * 10000 + 5000), // Example yearly earnings data
  }));
};

const SummaryChart = ({
  becameHostAt,
  hostStripeAccountId,
}: {
  becameHostAt: Date | undefined;
  hostStripeAccountId: string | null;
}) => {
  const becameHostYear = becameHostAt
    ? new Date(becameHostAt).getFullYear()
    : new Date().getFullYear();
  const becameHostMonth = becameHostAt
    ? new Date(becameHostAt).getMonth() + 1
    : new Date().getMonth() + 1;

  return (
    <Tabs defaultValue="month">
      <div className="relative flex w-full flex-col items-center justify-start">
        <div className="mx-5 mt-3 flex w-11/12 flex-row-reverse justify-between text-center">
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="month" className="h-full w-full">
          {hostStripeAccountId && (
            <MonthlyDataChart
              hostStripeAccountId={hostStripeAccountId}
              becameHostMonth={becameHostMonth}
              becameHostYear={becameHostYear}
            />
          )}
        </TabsContent>
        <TabsContent value="year" className="h-full w-full">
          <YearlyDataChart
            hostStripeAccountId={hostStripeAccountId}
            becameHostYear={becameHostYear}
          />
        </TabsContent>
        <TabsContent value="allTime" className="h-full w-full flex-col">
          <AllTimeDataChart
            hostStripeAccountId={hostStripeAccountId}
            becameHostYear={becameHostYear}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SummaryChart;
