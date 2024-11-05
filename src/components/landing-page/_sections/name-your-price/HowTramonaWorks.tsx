import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  DollarSign,
  ListChecks,
  MessageCircle,
  RefreshCcw,
  Shield,
} from "lucide-react";
import React from "react";
import { cn } from "@/utils/utils";

function HowTramonaWorks({ className }: { className: string }) {
  return (
    <div className={cn(className)}>
      <h2 className="mb-12 text-center text-3xl font-bold text-[#004236]">
        How Tramona Works
      </h2>
      <div className="grid gap-12 md:grid-cols-2">
        {/* For Travelers */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h3 className="mb-6 text-2xl font-semibold text-[#004236]">
            For Travelers
          </h3>
          <ul className="space-y-6">
            <li className="flex items-start">
              <CalendarIcon className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">Find Great Deals</h4>
                <p className="text-gray-600">
                  Access one-of-a-kind deals on rentals you can&apos;t find
                  anywhere else.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <MessageCircle className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">Send Requests</h4>
                <p className="text-gray-600">
                  Choose an individual property to book or send a request to
                  every host in that area.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <RefreshCcw className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">Flexible Booking Options</h4>
                <p className="text-gray-600">
                  Hosts can accept, reject, or counter your offer to help you
                  secure the best deal.
                </p>
              </div>
            </li>
          </ul>
          <Button className="mt-8 w-full bg-[#004236] text-white hover:bg-[#005a4b]">
            Learn More
          </Button>
        </div>

        {/* For Hosts */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h3 className="mb-6 text-2xl font-semibold text-[#004236]">
            For Hosts
          </h3>
          <ul className="space-y-6">
            <li className="flex items-start">
              <DollarSign className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">Maximize Your Earnings</h4>
                <p className="text-gray-600">
                  List at full price or offer a discount. You always maintain
                  control over pricing.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <ListChecks className="mr-4 mt-1 h-6 w-6 flex-shrink-0 text-[#004236]" />
              <div>
                <h4 className="mb-2 font-semibold">Flexible Management</h4>
                <p className="text-gray-600">
                  Accept, reject, or counter traveler offers. Sync calendars to
                  prevent double bookings.
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
          <Button className="mt-8 w-full bg-[#004236] text-white hover:bg-[#005a4b]">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HowTramonaWorks;
