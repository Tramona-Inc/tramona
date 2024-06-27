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
import ChartComponent from "./ChartComponent";
import { months } from "@/utils/constants";

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

const SummaryChart = ({ becameHostAt }: { becameHostAt: Date | undefined }) => {
  const becameHostYear = becameHostAt
    ? new Date(becameHostAt).getFullYear()
    : new Date().getFullYear();
  const becameHostMonth = becameHostAt
    ? new Date(becameHostAt).getMonth() + 1
    : new Date().getMonth() + 1;

  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(becameHostMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [allTimeData, setAllTimeData] = useState([]);
  const [activeTab, setActiveTab] = useState("month");

  useEffect(() => {
    setMonthlyData(generateMonthlyData(selectedYear, selectedMonth));
    setYearlyData(generateYearlyData(selectedYear));
    setAllTimeData(generateAllTimeData(becameHostYear, currentYear));
  }, [selectedYear, selectedMonth, becameHostYear, currentYear]);

  const handleYearChange = (year: number) => {
    if (year >= becameHostYear && year <= currentYear) {
      setSelectedYear(year);
      if (year === becameHostYear && selectedMonth < becameHostMonth) {
        setSelectedMonth(becameHostMonth);
      }
    }
  };

  return (
    <Tabs defaultValue="month" onValueChange={(value) => setActiveTab(value)}>
      <div className="relative flex w-full flex-col items-center justify-start">
        <div className="mx-5 mt-3 flex w-11/12 flex-row-reverse justify-between text-center">
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="month" className="h-full w-full">
          <div className="flex h-full flex-col md:w-[600px] xl:w-[1100px]">
            <p className="left-2 top-6 text-start text-2xl lg:absolute">
              <strong> $1200.00</strong> this month
            </p>
            <ChartComponent data={monthlyData} dataKey="Earnings" />
          </div>
          <div className="my-3">
            {months.map((month, index) => (
              <Button
                key={month}
                onClick={() => setSelectedMonth(index + 1)}
                size="sm"
                variant="outlineMinimal"
                className={`mr-2 inline-flex rounded-full px-4 py-2 text-white ${
                  selectedMonth === index + 1
                    ? "bg-teal-800 text-white"
                    : "text-black"
                }`}
                disabled={
                  selectedYear === new Date().getFullYear() &&
                  index + 1 > new Date().getMonth() + 1
                }
              >
                {month}
              </Button>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="year" className="h-full w-full">
          <div className="flex flex-col md:w-[600px] xl:w-[1100px]">
            <p className="left-2 top-6 text-start text-2xl lg:absolute">
              <strong>
                $
                {yearlyData
                  .reduce((sum, month) => sum + month.Earnings, 0)
                  .toFixed(2)}
              </strong>{" "}
              this year
            </p>
            <ChartComponent
              data={yearlyData}
              dataKey="Earnings"
              xAxisDataKey="date"
            />
          </div>
          <div className="my-3">
            {Array.from(
              { length: new Date().getFullYear() - becameHostYear + 1 },
              (_, i) => becameHostYear + i,
            ).map((year) => (
              <Button
                key={year}
                onClick={() => handleYearChange(year)}
                size="sm"
                variant="outlineMinimal"
                className={`mr-2 inline-flex rounded-full px-4 py-2 text-white ${
                  selectedYear === year
                    ? "bg-teal-800 text-white"
                    : "text-black"
                }`}
              >
                {year}
              </Button>
            ))}
          </div>
        </TabsContent>
        <TabsContent
          value="allTime"
          className="h-full md:w-[600px] xl:w-[1100px]"
        >
          <div className="flex h-full flex-col">
            <p className="left-2 top-6 text-start text-2xl lg:absolute">
              <strong>
                $
                {allTimeData
                  .reduce((sum, year) => sum + year.Earnings, 0)
                  .toFixed(2)}
              </strong>{" "}
              all time
            </p>
            <ChartComponent
              data={allTimeData}
              dataKey="Earnings"
              xAxisDataKey="date"
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SummaryChart;
