import React from "react";
import type { TooltipProps } from "recharts"; // Importing the TooltipProps from recharts
import { formatCurrency } from "@/utils/utils";

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (
    active &&
    payload &&
    payload.length > 0 &&
    payload[0]?.value !== undefined
  ) {
    return (
      <div className="rounded border border-gray-200 bg-white p-2 shadow">
        <p className="label">{`${label}`}</p>
        <p className="intro">{`Earnings: ${formatCurrency(payload[0]?.value ?? 0)}`}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
