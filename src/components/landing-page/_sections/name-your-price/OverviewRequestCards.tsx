import { Card } from "@/components/ui/card";
import { SearchIcon, CheckCircleIcon, SendIcon, ClockIcon } from "lucide-react";
import React from "react";
import { cn } from "@/utils/utils";

const cardData = [
  {
    icon: SendIcon,
    title: "Send a request",
    description:
      "Enter where you want to go, your dates, price and people you are traveling with, and send that request to every host in the area with a vacancy",
  },
  {
    icon: ClockIcon,
    title: "Book it now",
    description:
      "Find a property you like, and book it now. Just like you're used to",
  },
  {
    icon: SearchIcon,
    title: "Place a bid",
    description:
      "See an empty night? Place a bid to see to see if you can make a deal",
  },
  {
    icon: CheckCircleIcon,
    title: "Try it before you book",
    description:
      "Already set on traveling? Try Tramona and see what hosts will offer you",
  },
];

function OverviewRequestCards({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mx-4 lg:grid-cols-4",
        className,
      )}
    >
      {cardData.map((card, index) => (
        <Card
          key={index}
          className="justify-center border shadow-none sm:justify-start"
        >
          <div className="flex gap-3">
            <div>
              <div className="rounded-lg bg-[#E6F2EF] p-2">
                <card.icon className="text-[#004236]" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold">{card.title}</p>
              <p className="text-muted-foreground">{card.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default OverviewRequestCards;
