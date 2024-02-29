import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
function bookinginstructions() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Booking Instructions</Button>
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <div className="space-y-10">
          <h1 className="mt-10 text-4xl font-bold">Confirm and Pay</h1>
          {/* Step 1 */}
          <div className="space-y-3 ">
            <div>
              <h4 className="text-xs ">Step 1</h4>
              <h5 className="text-xl font-semibold">Pay the Tramona fee</h5>
            </div>

            <div className="space-y-2 text-sm">
              <p>Non Tramona Price: $1000</p>
              <p>Tramona Price: $900</p>
              <p>Total savings with Tramona: $100</p>
              <p>
                Tramona Fee: $20 (we charge a 20% fee of your total savings).
              </p>
            </div>

            <div className="py-2">
              <div className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-4  text-xs">
                <span className="italic">*Notes:</span> Paying the Tramona fee
                does not guarantee a successful booking. If you fail, we will
                refund you.
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

          {/* Step 2 */}

          <div className="space-y-3">
            <div>
              <h4 className="text-xs ">Step 2</h4>
              <h5 className="text-xl font-semibold">
                Airbnb link gets unlocked
              </h5>
            </div>
            <Input
              placeholder="https://www.airbnb.com/rooms/xxxxxxxx"
              className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-7  text-xs italic"
            />
            <Button className="border border-black bg-white text-black ">
              Copy link
            </Button>
          </div>
          {/* Step 3 */}
          <div className="space-y-5">
            <div>
              <h4 className="text-xs ">Step 3</h4>
              <h5 className="text-xl font-semibold">
                Contact the host through the chat feature on Airbnb by copy and
                pasting our premade message
              </h5>
            </div>

            <div className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-4  text-xs italic">
              “Hi, I was offered your property on Tramona for $100 total for Feb
              20-25 and I’d like to book it at that price.”
            </div>
            <div className="space-x-3">
              <Button className="border border-black bg-white text-black">
                Copy message
              </Button>
              <Button>Contact host</Button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-5">
            <div>
              <h4 className="text-xs ">Step 4</h4>
              <h5 className="text-xl font-semibold">
                Receive exclusive offer from the host
              </h5>
              <p className="text-sm">
                This will happen on Airbnb, through the chat
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="space-y-5">
            <div>
              <h4 className="text-xs ">Step 5</h4>
              <h5 className="text-xl font-semibold">Book Stay</h5>
            </div>
          </div>

          {/* Step 5 */}
          <div className="space-y-5">
            <div>
              <h4 className="text-xs ">Step 6</h4>
              <h5 className="text-xl font-semibold">You're done!</h5>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default bookinginstructions;
