import RequestAndBidAutomationSection from "./setttingsSections/pricing-sections/RequestAndBidAutomationSection";
import BookItNowSection from "./setttingsSections/pricing-sections/BookItNowSection";
import BiddingSection from "./setttingsSections/pricing-sections/BiddingSection";
import { Property } from "@/server/db/schema/tables/properties";
export default function PricingTab({
  property,
  handleBookItNowSlider,
  handleBookItNowSwitch,
  isBookItNowChecked,
  isTogglingBookItNow,
  bookItNowPercent,
  setBookItNowPercent,
  biddingPercent,
  setBiddingPercent,
}: {
  property: Property;
  handleBookItNowSlider: (bookItNowPercent: number) => Promise<number>;
  handleBookItNowSwitch: (checked: boolean) => Promise<void>;
  isBookItNowChecked: boolean;
  isTogglingBookItNow: boolean;
  bookItNowPercent: number;
  setBookItNowPercent: (percent: number) => void;
  biddingPercent: number;
  setBiddingPercent: (percent: number) => void;
}) {
  return (
    <>
      <BookItNowSection
        handleBookItNowSlider={handleBookItNowSlider}
        isBookItNowChecked={isBookItNowChecked}
        isTogglingBookItNow={isTogglingBookItNow}
        handleBookItNowSwitch={handleBookItNowSwitch}
        bookItNowPercent={bookItNowPercent}
        setBookItNowPercent={setBookItNowPercent}
      />

      {/* Bidding section */}
      <BiddingSection
        biddingPercent={biddingPercent}
        setBiddingPercent={setBiddingPercent}
        property={property}
      />

      {/* Name your price section */}
      {/* <RequestAndBidAutomationSection property={property} /> */}
    </>
  );
}
