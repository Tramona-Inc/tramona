import { Button } from "@/components/ui/button";
import React from "react";

export default function step3() {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs ">Step 3</h4>
        <h5 className="text-xl font-semibold">
          Contact the host through the chat feature on Airbnb by copy and
          pasting our premade message
        </h5>
      </div>

      <div className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-4  text-xs italic">
        “Hi, I was offered your property on Tramona for $100 total for Feb 20-25
        and I’d like to book it at that price.”
      </div>
      <div className="space-x-3">
        <Button className="border border-black bg-white text-black">
          Copy message
        </Button>
        <Button>Contact host</Button>
      </div>
    </div>
  );
}
