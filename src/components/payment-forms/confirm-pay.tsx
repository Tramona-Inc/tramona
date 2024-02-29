import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/utils";

import Circle from "./progress-bar";

type Tabs = {
  id: number;
  path: string;
};

function confirmpayments() {
  const [isDialog, setIsDialog] = useState(false);
  const [tab, setTab] = useState<number>(1);

  return (
    <>
      <Dialog
        open={isDialog}
        onOpenChange={setIsDialog}
        onClose={() => setIsDialog(false)}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Open Booking Instructions</Button>
        </DialogTrigger>
        <DialogContent className="w-screen p-10 md:w-[750px] ">
          <h1 className="mt-8 text-4xl font-bold">Confirm and Pay</h1>

          <div className="mt-10 space-y-10 pr-5 md:mt-0">
            {/* <h1 className="mt-10 text-4xl font-bold">Confirm and Pay</h1> */}
            <div className="space-y-5">
              {/* Step 1 */}
              <div
                className={cn(
                  "flex h-full flex-row space-x-6 transition duration-1000 ",
                  1 <= tab ? "opacity-100" : "opacity-50",
                )}
              >
                <Circle step={tab} currenttab={1} />
                <div className="w-full space-y-5">
                  <div>
                    <h4 className="text-xs ">Step 1</h4>
                    <h5 className="text-xl font-semibold">
                      Pay the Tramona fee
                    </h5>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>Non Tramona Price: $1000</p>
                    <p>Tramona Price: $900</p>
                    <p>Total savings with Tramona: $100</p>
                    <p>
                      Tramona Fee: $20 (we charge a 20% fee of your total
                      savings).
                    </p>
                  </div>

                  <div className="py-2">
                    <div className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-4  text-xs">
                      <span className="italic">*Notes:</span> Paying the Tramona
                      fee does not guarantee a successful booking. If you fail,
                      we will refund you.
                    </div>
                  </div>

                  <div className="mt-2 flex w-full flex-col gap-y-3">
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
              </div>

              {/* Step 2 */}
              <div
                className={cn(
                  "flex h-full flex-row space-x-6 transition duration-1000 ",
                  2 <= tab ? "opacity-100" : "opacity-50",
                )}
              >
                <Circle step={tab} currenttab={2} />

                <div className="w-full space-y-5">
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
              </div>

              {/* Step 3 */}
              <div
                className={cn(
                  "flex h-full flex-row space-x-6 transition duration-1000 ",
                  3 <= tab ? "opacity-100" : "opacity-50",
                )}
              >
                <Circle step={tab} currenttab={3} />

                <div className="w-full space-y-5">
                  <div>
                    <h4 className="text-xs ">Step 3</h4>
                    <h5 className="text-xl font-semibold">
                      Contact the host through the chat feature on Airbnb by
                      copy and pasting our premade message
                    </h5>
                  </div>

                  <div className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-4  text-xs italic">
                    “Hi, I was offered your property on Tramona for $100 total
                    for Feb 20-25 and I’d like to book it at that price.”
                  </div>
                  <div className="flex flex-col space-y-2 md:flex-row md:space-x-8 md:space-y-0">
                    <Button className="border border-black bg-white text-black">
                      Copy message
                    </Button>
                    <Button>Contact host</Button>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div
                className={cn(
                  "flex h-full flex-row space-x-6 transition duration-1000 ",
                  4 <= tab ? "opacity-100" : "opacity-50",
                )}
              >
                <Circle step={tab} currenttab={4} />

                <div className="w-full space-y-5">
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
              </div>

              {/* Step 5 */}
              <div
                className={cn(
                  "flex h-full flex-row space-x-6 transition-opacity duration-1000 ",
                  5 === tab ? "opacity-100" : "opacity-50",
                )}
              >
                {tab === 5 ? (
                  <div className="mt-6 h-4 w-4 items-center justify-center rounded-full bg-black" />
                ) : (
                  <div className="mt-6 h-4 w-4 items-center justify-center rounded-full border-[3px] border-black opacity-50 " />
                )}

                <div className="w-full space-y-5">
                  <div>
                    <h4 className="text-xs ">Step 5</h4>
                    <h5 className="text-xl font-semibold">You're done!</h5>
                    {/* <Button
                      onClick={() => {
                        setTab(tab + 1);
                      }}
                    >
                      COUNT
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default confirmpayments;
