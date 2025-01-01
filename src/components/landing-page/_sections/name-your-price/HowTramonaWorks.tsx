import { Button } from "@/components/ui/button";
import { DollarSign, ListChecks, Shield } from "lucide-react";
import React from "react";
import { cn } from "@/utils/utils";

function HowTramonaWorks({ className }: { className: string }) {
  return (
    <div className={cn(className)}>
      <h2 className="mb-12 text-center text-3xl font-semibold text-[#000000]">
        How Tramona Works for Hosts
      </h2>
      <div className="grid gap-12 md:grid-cols-1">
        {/* For Hosts */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h3 className="mb-6 text-2xl font-semibold text-[#004236]">
            The only booking site built to fill your calendar
          </h3>
          <ul className="space-y-6">
            <li className="flex items-start">
              <DollarSign className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">
                  Say Goodbye to Empty Nights
                </h4>
                <p className="text-gray-600">
                  When listing on Tramona, you will always have an option to
                  book a vacant room.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <DollarSign className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">
                  Quick and Effortless Syncing with Airbnb
                </h4>
                <p className="text-gray-600">
                  Our sign up requires you to connect your Airbnb account,
                  eliminating double bookings, pricing issues or any other issue
                  you could think of.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <ListChecks className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">Complete Control, Always</h4>
                <p className="text-gray-600">
                  Always in full control of pricing. Accept, reject, or counter
                  all traveler offers. Choose to put Tramona on autopilot or
                  keep it manual.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Shield className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">Protection & Support</h4>
                <p className="text-gray-600">
                  Enjoy $50K protection per booking and access 24/7 dedicated
                  support.
                </p>
              </div>
            </li>
          </ul>
          <Button
            className="mt-8 w-full bg-[#004236] text-white hover:bg-[#005a4b]"
            onClick={() => (window.location.href = "/why-list")}
          >
            Learn More about Hosting
          </Button>
        </div>

        {/* Traveler text - moved below the host section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-[#000000] lg:text-3xl">
            Travelers, the choice is simple. With Tramona, you can just travel
            more
          </h2>
        </div>
      </div>
    </div>
  );
}

export default HowTramonaWorks;
