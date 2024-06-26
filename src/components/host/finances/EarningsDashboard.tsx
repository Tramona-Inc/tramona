import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const properties = [
  {
    id: 1,
    name: "Beautiful Villa on the B...",
    location: "Orlando, FL, USA",
    earnings: 1875.2,
    data: [20, 45, 30, 80, 65],
  },
  {
    id: 2,
    name: "Cozy Cabin in the Woods",
    location: "Aspen, CO, USA",
    earnings: 2100.5,
    data: [30, 55, 40, 70, 85],
  },
  {
    id: 3,
    name: "Beachfront Paradise",
    location: "Maui, HI, USA",
    earnings: 3200.75,
    data: [50, 75, 60, 90, 100],
  },
  {
    id: 4,
    name: "Downtown Loft",
    location: "New York, NY, USA",
    earnings: 1950.0,
    data: [25, 40, 35, 60, 70],
  },
  {
    id: 5,
    name: "Mountain Retreat",
    location: "Banff, AB, Canada",
    earnings: 1800.25,
    data: [15, 35, 25, 55, 60],
  },
  {
    id: 6,
    name: "Lakeside Cottage",
    location: "Lake Tahoe, CA, USA",
    earnings: 2250.0,
    data: [35, 60, 45, 75, 80],
  },
];

const BarChart = ({ data }) => (
  <div className="flex h-full w-full items-end justify-between">
    {data.map((value, index) => (
      <div
        key={index}
        className="w-1/6 bg-teal-900"
        style={{ height: `${value}%` }}
      ></div>
    ))}
  </div>
);

const EarningsDashboard = () => {
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);
  const [timePeriod, setTimePeriod] = useState("month");

  return (
    <div className="flex bg-gray-50 p-6 font-sans">
      <div className="w-2/3 pr-6">
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
                      variant={timePeriod === period ? "default" : "ghost"}
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
                  ${selectedProperty.earnings.toFixed(2)} this month
                </h2>

                <div className="relative h-64">
                  <BarChart data={selectedProperty.data} />

                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-gray-500">
                    <span>$100</span>
                    <span>$50</span>
                    <span>$0</span>
                  </div>

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                    <span>
                      01
                      <br />
                      Apr
                    </span>
                    <span>08</span>
                    <span>15</span>
                    <span>22</span>
                    <span>29</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bookings">
                <p>Bookings content here</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="w-1/3">
        <Card>
          <CardHeader>
            <CardTitle>Properties ({properties.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 space-y-4 overflow-y-auto">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className={`flex cursor-pointer items-center space-x-4 rounded p-2 hover:bg-gray-50 ${selectedProperty.id === property.id ? "bg-gray-100" : ""}`}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="h-16 w-16 rounded-lg bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-medium">{property.name}</p>
                    <p className="text-xs text-gray-500">{property.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarningsDashboard;
