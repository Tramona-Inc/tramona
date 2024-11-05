import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/utils";

export default function YearToDateSummaryCard() {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of the current year

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const items = [
    { label: "Gross earnings", amount: 0 },
    { label: "Adjustments", amount: 0 },
    { label: "Service fee", amount: 0 },
    { label: "Tax withheld", amount: 0 },
  ];

  return (
    <Card className="mx-auto h-full w-full max-w-md p-6 shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold">
          Year-to-date summary
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDate(startDate)} - {formatDate(currentDate)}
        </p>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <dt className="font-normal">{item.label}</dt>
              <dd className="font-medium">{formatCurrency(item.amount)}</dd>
            </div>
          ))}
          <div className="mt-4 flex justify-between border-t pt-4">
            <dt className="font-bold">Total (USD)</dt>
            <dd className="font-bold">{formatCurrency(0)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
