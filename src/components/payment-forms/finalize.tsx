import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
function TripFinalizationCard() {
  return (
    <div className="mx-auto max-w-sm bg-white">
      <h1 className="bg-black py-3 text-center text-xl text-white">
        Finalize your Trip
      </h1>
      <div className="space-y-4 p-6">
        <Card className="text-md rounded-sm">
          <CardContent className="flex flex-row items-center  justify-between">
            <div>
              <div>Thursday,</div>
              <div>April 04, 2024</div>
              <div className="text-muted-foreground">Check in</div>
            </div>
            <div className="flex h-fit w-12  border-b border-gray-500"></div>
            <div>
              <div>Sunday,</div>
              <div>April 07, 2024</div>
              <div className="text-muted-foreground">Check out</div>
            </div>
          </CardContent>
        </Card>
        <div className="border-gray-250 flex h-fit w-full border-b" />
        <div className="text-md">
          <p>You are going to (Name of place).</p>
          <p>Entire home/apt hosted by (Host name).</p>
        </div>
        <h1 className="text-2xl  font-extrabold">Price Details</h1>
        <div>
          <div className="flex flex-row">
            <div>Non Tramona Price</div>
            <div className="text-right">$120/Night</div>
          </div>
          <div>
            <div>Tramona Price</div>
            <div className="text-right">$100/Night</div>
          </div>
        </div>
        <div className="border-gray-250 flex h-fit  w-full border-b"></div>
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold">Final Price details</h2>
          <div className="flex flex-row justify-between">
            <div className="underline underline-offset-4">
              3 Nights @ $100/night
            </div>
            <div className="text-right">$360 $300</div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="underline underline-offset-4">Tramona Fee</div>
            <div className="text-right">$20</div>
          </div>
          <div className="border-gray-250 flex h-fit  w-full border-b"></div>
          <div className="flex flex-row justify-between">
            <div className="font-semibold">Total (USD)</div>
            <div className="text-right font-semibold">$320</div>
          </div>
        </div>
        <Button className="w-full">Pay Now</Button>
      </div>
    </div>
  );
}
export default TripFinalizationCard;
// render(<TripFinalizationCard />, document.getElementById("root"));
