import { Button } from "@/components/ui/button";
import React from "react";

export default function step1() {
  return (
    <div className="space-y-3 ">
      <div>
        <h4 className="text-xs ">Step 1</h4>
        <h5 className="text-xl font-semibold">Pay the Tramona fee</h5>
      </div>

      <div className="space-y-2 text-sm">
        <p>Non Tramona Price: $1000</p>
        <p>Tramona Price: $900</p>
        <p>Total savings with Tramona: $100</p>
        <p>Tramona Fee: $20 (we charge a 20% fee of your total savings).</p>
      </div>

      <div className="py-2">
        <div className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-4  text-xs">
          <span className="italic">*Notes:</span> Paying the Tramona fee does
          not guarantee a successful booking. If you fail, we will refund you.
        </div>
      </div>

      <div className="mt-2 flex w-full flex-col gap-y-2">
        <h1 className="font-semibold">Price details</h1>
        <div className="flex w-1/2 flex-row justify-between">
          <p>Tramona Fee</p>
          <p>$20</p>
        </div>
        <div className="flex w-1/2 flex-row justify-between font-bold">
          <p>Total</p>
          <p>$20</p>
        </div>
      </div>
      <Button className="w-2/5">Pay now</Button>
    </div>
  );
}
