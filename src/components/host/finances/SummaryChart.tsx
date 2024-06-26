import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { eachDayOfInterval, format, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const generateMonthlyData = (year, month) => {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => ({
    date: format(day, "dd MMM"),
    Earnings: Math.floor(Math.random() * 100), // Example earnings data
  }));
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border border-gray-200 bg-white p-2 shadow">
        <p className="label">{`${label}`}</p>
        <p className="intro">{`Earnings: $${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const Chart = ({ becameHostAt }: { becameHostAt: Date | undefined }) => {
  const becameHostYear = becameHostAt
    ? new Date(becameHostAt).getFullYear()
    : new Date().getFullYear();
  const becameHostMonth = becameHostAt
    ? new Date(becameHostAt).getMonth() + 1
    : new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState(becameHostMonth); // Set to host start month initially
  const [year, setYear] = useState(becameHostYear);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateMonthlyData(year, selectedMonth));
  }, [year, selectedMonth]);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = Number(e.target.value);
    if (newYear >= becameHostYear && newYear <= new Date().getFullYear()) {
      setYear(newYear);
      // Reset month to becameHostMonth if the selected year is the host start year
      if (newYear === becameHostYear && selectedMonth < becameHostMonth) {
        setSelectedMonth(becameHostMonth);
      }
    }
  };

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
          <div className="flex h-full w-full flex-col">
            <p className="left-2 top-6 text-start text-2xl lg:absolute">
              <strong> $1200.00</strong> this month
            </p>
            <div className="relative h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Earnings" fill="#134E4A" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
                  //we can add this back after demo
                  // year === becameHostYear && index + 1 < becameHostMonth
                  //  ||
                  year === new Date().getFullYear() &&
                  index + 1 > new Date().getMonth() + 1
                }
              >
                {month}
              </Button>
            ))}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default Chart;
