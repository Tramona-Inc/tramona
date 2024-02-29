import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function step2() {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-xs ">Step 2</h4>
        <h5 className="text-xl font-semibold">Airbnb link gets unlocked</h5>
      </div>
      <Input
        placeholder="https://www.airbnb.com/rooms/xxxxxxxx"
        className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-7  text-xs italic"
      />
      <Button className="border border-black bg-white text-black ">
        Copy link
      </Button>
    </div>
  );
}
