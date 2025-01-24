import { Button } from "@/components/ui/button";
import { DollarSign, ListChecks, Shield, Calendar, UserX } from "lucide-react";
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
            The only booking site built for hosts
          </h3>
          <ul className="space-y-6">
            <li className="flex items-start">
              <DollarSign className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">Book More and Keep More</h4>
                <p className="text-gray-600">
                  Tramona charges a 10% fee on all bookings, 1.5% to hosts and
                  8.% to travelers. This is a 5-10% minimum savings compared to
                  Airbnb, VRBO and Booking.com. When you book on Tramona, you
                  save 5-10% on the fees alone.
                  <br />
                  <br />
                  Whether it&apos;s off season, hard to book week days, or maybe
                  an off weekend, you have complete flexibily on how to fill
                  your calendar.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Calendar className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
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
                  all traveler offers. Set preferences on the host side on what
                  you are interested in seeing. Choose to put Tramona on
                  autopilot or keep it manual.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <Shield className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">Protection & Support</h4>
                <p className="text-gray-600">
                  We offer $50K protection per booking and access to 24/7
                  dedicated support. Our claims team is available to help you
                  with any issues, and we have a quick and easy process to
                  ensure a great hosting experience .
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <UserX className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">
                  0 tolerance for bad guests
                </h4>
                <p className="text-gray-600">
                  Just like other booking sites, we have a zero tolerance policy
                  for bad guests. We ban quick, and make sure you get the best
                  guests.
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
          <h2 className="mx-1 text-2xl font-semibold text-[#000000] lg:text-3xl">
            Travelers, the choice is simple. Better prices, better customer
            service and lower fees
          </h2>
        </div>
      </div>
    </div>
  );
}

export default HowTramonaWorks;
