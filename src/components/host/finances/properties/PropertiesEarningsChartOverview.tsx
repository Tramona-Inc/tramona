import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/green-button-tab";
import { Button } from "@/components/ui/button";
import ChartComponent from "@/components/host/finances/ChartComponent";

// Define the types for the properties
interface EarningsData {
  date: string;
  Earnings: number;
}

interface SelectedProperty {
  earnings: number;
  data: EarningsData[];
}

export default function PropertiesEarningsChartOverview({
  selectedProperty,
}: {
  selectedProperty: SelectedProperty | undefined; // Use the defined type here
}) {
  const dummyData: EarningsData[] = Array.from({ length: 5 }, (_, i) => ({
    date: `Week ${i + 1}`,
    Earnings: Math.floor(Math.random() * 100), // Random earnings value
  }));

  const [timePeriod, setTimePeriod] = useState("month");

  useEffect(() => {
    if (!selectedProperty) {
      // Handle case when no property is selected
    }
  }, [selectedProperty]);

  return (
    <div className="font-sans flex bg-gray-50 p-6">
      <div className="w-full pr-3">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="earnings" className="w-full">
              <div className="mb-6 flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>
                <div className="flex space-x-4 text-sm">
                  {["month", "year", "all time"].map((period) => (
                    <Button
                      key={period}
                      variant={timePeriod === period ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setTimePeriod(period)}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <TabsContent value="earnings">
                <h2 className="mb-8 text-3xl font-bold">
                  ${selectedProperty?.earnings} this month
                </h2>

                <div className="2xl:w-[1100px]flex flex h-full w-full flex-col gap-y-5 sm:w-[600px] md:-mt-[50px] xl:w-[800px] 2xl:w-[1100px]">
                  <ChartComponent
                    data={selectedProperty?.data ?? dummyData}
                    dataKey="Earnings"
                    xAxisDataKey="date"
                  />
                </div>
              </TabsContent>

              <TabsContent value="bookings">
                <p>Bookings content here</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
