import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import MonthlyDataChart from "./MonthlyDataChart";
import AllTimeDataChart from "./AllTimeDataChart";
import YearlyDataChart from "./YearlyDataChart";

const SummaryChart = ({
  becameHostAt,
  hostStripeConnectId,
}: {
  becameHostAt: Date | undefined;
  hostStripeConnectId: string | null;
}) => {
  const becameHostYear = becameHostAt
    ? new Date(becameHostAt).getFullYear()
    : new Date().getFullYear();

  return (
    <Tabs
      defaultValue="month"
      className="rounded-2xl bg-white px-4 py-8 shadow-sm"
    >
      <div className="relative flex w-full flex-col items-center justify-start md:items-end">
        <div className="z-20 mx-5 mt-4 flex flex-row-reverse justify-between text-center md:mt-3">
          <TabsList className="flex items-center">
            <TabsTrigger
              value="month"
              className="custom-tabs-trigger hover:bg-white data-[state=active]:border-[#2F5BF6] data-[state=active]:text-[#2F5BF6]"
            >
              Month
            </TabsTrigger>
            <Separator orientation="vertical" className="mx-1 h-1/2" />
            <TabsTrigger
              value="year"
              className="custom-tabs-trigger hover:bg-white data-[state=active]:border-[#2F5BF6] data-[state=active]:text-[#2F5BF6]"
            >
              Year
            </TabsTrigger>
            <Separator orientation="vertical" className="mx-1 h-1/2" />
            <TabsTrigger
              value="allTime"
              className="custom-tabs-trigger hover:bg-white data-[state=active]:border-[#2F5BF6] data-[state=active]:text-[#2F5BF6]"
            >
              All Time
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="month" className="h-full w-full">
          <MonthlyDataChart hostStripeConnectId={hostStripeConnectId} />
        </TabsContent>
        <TabsContent value="year" className="h-full w-full">
          <YearlyDataChart
            hostStripeConnectId={hostStripeConnectId}
            becameHostYear={becameHostYear}
          />
        </TabsContent>
        <TabsContent value="allTime" className="h-full w-full flex-col">
          <AllTimeDataChart
            hostStripeConnectId={hostStripeConnectId}
            becameHostYear={becameHostYear}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SummaryChart;
