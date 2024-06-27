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

const ChartComponent = ({ data, dataKey, xAxisDataKey = "date" }) => (
  <div className="relative h-96 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisDataKey} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey={dataKey} fill="#134E4A" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartComponent;
