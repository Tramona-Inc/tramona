import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

import CurrentTravelerDisputes from "./CurrentTravelerDisputes";
import PastTravelerDisputes from "./PastTravelerDisputes";

function SecurityDepositOverview() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Traveler Dashboard: Deposit Status
      </h1>
      <Tabs
        defaultValue="disputes"
        className="space-y-4"
        orientation="vertical"
      >
        <TabsList>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="claim-history">Claim History</TabsTrigger>
        </TabsList>
        <TabsContent value="disputes">
          <CurrentTravelerDisputes />
        </TabsContent>
        <TabsContent value="claim-history">
          <PastTravelerDisputes />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SecurityDepositOverview;
