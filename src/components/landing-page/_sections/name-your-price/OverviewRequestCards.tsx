import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, CalendarCheck, DollarSign, Eye } from "lucide-react";
import { cn } from "@/utils/utils";
import { useRouter } from "next/router";

/**
 * This completely replaces the old "OverviewRequestCards"
 * with the new four-card layout you wanted.
 */
function OverviewRequestCards({ className }: { className?: string }) {
  const router = useRouter();

  const handleNameYourPriceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const scrollOffset = 440; // Adjust this value to control how far below the top to scroll
    void router.push("/?tab=name-price", undefined, { scroll: false });
    setTimeout(() => {
      window.scrollTo({
        top: scrollOffset,
        behavior: "smooth",
      });
    }, 200);
  };

  const handleSearchPropertiesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const scrollOffset = 0;
    void router.push("/?tab=search", undefined, {
      scroll: true,
      shallow: true,
    });
    setTimeout(() => {
      window.scrollTo({
        top: scrollOffset,
        behavior: "smooth",
      });
    }, 200);
  };

  return (
    <div
      className={cn(
        "mx-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mx-4 lg:grid-cols-4",
        className,
      )}
    >
      {/* 1) Send a Request */}
      <BookingCard
        icon={<Mail size={20} />}
        title="Send a Request"
        shortDescription="Send a request to every host with an empty night in the location you want to visit"
        moreInfo="With one click, you can send a request to every host with an empty night in the location you want to visit. Hosts will revview it, accept, deny or counter offer, travelers review all matches and choose one to book."
        buttonText="Name your own price"
        onClick={handleNameYourPriceClick}
      />

      {/* 2) Book Now */}
      <BookingCard
        icon={<CalendarCheck size={20} />}
        title="Book Now"
        shortDescription="Secure a place instantly, the normal booking process you are used to."
        moreInfo="The traditional booking process, find a place and book it. We charge less in fees than any major booking site and offer better customer service."
        buttonText="Search Properties"
        onClick={handleSearchPropertiesClick}
      />

      {/* 3) Place a Bid */}
      <BookingCard
        icon={<DollarSign size={20} />}
        title="Place a Bid"
        shortDescription="See a vacancy? If hosts allow it, place a bid and get the best deal."
        moreInfo="If you're flexible, offer a price on leftover dates. Hosts can decide whether to accept—giving you a one-of-a-kind deal."
        buttonText="Search Properties"
        onClick={handleSearchPropertiesClick}
      />

      {/* 4) Preview Offers / Try It Before You Book */}
      <BookingCard
        icon={<Eye size={20} />}
        title="Try it before you book"
        shortDescription="Still considering? Submit a request and try it before you book"
        moreInfo="Hosts will respond to your request and submit one of a kind offers exclusive to you. You can view all offers and choose the best one."
        buttonText="Name your own price"
        onClick={handleNameYourPriceClick}
      />
    </div>
  );
}

interface BookingCardProps {
  icon: React.ReactNode;
  title: string;
  shortDescription: string;
  moreInfo: string;
  buttonText: string;
  scrollToTop?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Single reusable card with an accordion for "More Info."
 */
function BookingCard({
  icon,
  title,
  shortDescription,
  moreInfo,
  buttonText,
  scrollToTop = false,
  onClick,
}: BookingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const toggleAccordion = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Insert your "go to next step" logic here, or a link, etc.
  };

  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Icon + Title */}
      <div className="mb-3 flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primaryGreen text-white">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {/* Short Description */}
      <p className="mb-4 text-sm text-zinc-600">{shortDescription}</p>

      {/* Primary vs. Secondary Button */}
      <Button
        onClick={onClick ? onClick : handleButtonClick}
        className="mb-2 w-full border border-primaryGreen bg-white text-primaryGreen hover:bg-primaryGreen hover:text-white"
      >
        {buttonText}
      </Button>

      {/* "More Info" Toggle */}
      <button
        onClick={toggleAccordion}
        className="text-sm font-medium text-primaryGreen underline hover:text-primaryGreen/80"
      >
        {expanded ? "Hide Info" : "More Info"}
      </button>

      {/* Expandable Section */}
      <div
        className={`mt-2 overflow-hidden transition-[max-height] duration-300 ${
          expanded ? "max-h-40" : "max-h-0"
        }`}
      >
        <p className="mt-2 text-sm text-zinc-500">{moreInfo}</p>
      </div>
    </div>
  );
}

export default OverviewRequestCards;
