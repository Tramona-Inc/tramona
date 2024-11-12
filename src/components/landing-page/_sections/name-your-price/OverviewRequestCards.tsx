import { Card } from "@/components/ui/card";
import { SearchIcon, CheckCircleIcon, SendIcon, ClockIcon } from "lucide-react";
import React from "react";
import { cn } from "@/utils/utils";

const cardData = [
  {
    icon: SendIcon,
    title: "Send Request",
    description: "Submit an offer to all available hosts",
  },
  {
    icon: ClockIcon,
    title: "Get Offers",
    description: "Receive custom prices just for you",
  },
  {
    icon: SearchIcon,
    title: "Compare Deals",
    description: "Pick your perfect match",
  },
  {
    icon: CheckCircleIcon,
    title: "Book Instantly",
    description: "Secure your stay right away",
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
