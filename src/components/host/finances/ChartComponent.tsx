import React from "react";
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
import { formatCurrency } from "@/utils/utils";
import CustomTooltip from "./CustomTooltip"; // Update the import path if needed

interface ChartComponentProps {
  data: { date: string; Earnings: number }[];
  dataKey: string;
  xAxisDataKey?: string;
  hideYAxis?: boolean;
}

const ChartComponent = ({
  data,
  dataKey,
  xAxisDataKey = "date",
  hideYAxis = false,
}: ChartComponentProps) => {
  const currencyFormatter = (value: number) => formatCurrency(value);
  return (
    <div className="relative h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} />
          <YAxis tickFormatter={currencyFormatter} hide={hideYAxis} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey={dataKey} fill="#134E4A" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
