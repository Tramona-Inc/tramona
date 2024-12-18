import { Card } from "@/components/ui/card";
import { SearchIcon, CheckCircleIcon, SendIcon, ClockIcon } from "lucide-react";
import React from "react";
import { cn } from "@/utils/utils";

const cardData = [
  {
    icon: SendIcon,
    title: "Send a request",
    description: "Enter where you want to go, your dates, price and people you are traveling with, and send that request to everyhost in the area with a vacancy",
  },
  {
    icon: ClockIcon,
    title: "Book it now",
    description: "Find a property you like, and book it now. Just like you're used to",
  },
  {
    icon: SearchIcon,
    title: "Place a bid",
    description: "See an empty night? Place a bid to see to see if you can make a deal",
  },
  {
    icon: CheckCircleIcon,
    title: "Try it before you book",
    description: "Already set on traveling? Try Tramona and see what hosts will offer you",
  },
];

function OverviewRequestCards({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "xs:gap-3 grid grid-cols-2 gap-2 sm:gap-4 md:gap-5",
        className,
      )}
    >
      {cardData.map((card, index) => (
        <Card key={index} className="border shadow-none">
          <div className="xs:p-1 flex items-start gap-2 p-2 sm:p-4 md:p-5">
            <div className="xs:p-1.5 rounded-lg bg-[#E6F2EF] p-1 sm:p-2 md:p-2.5">
              <card.icon className="text-[#004236] sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h4 className="text-sm font-medium sm:mb-1 sm:text-base md:text-lg">
                {card.title}
              </h4>
              <p className="text-xs text-gray-600 sm:text-xs md:text-base">
                {card.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default OverviewRequestCards;
