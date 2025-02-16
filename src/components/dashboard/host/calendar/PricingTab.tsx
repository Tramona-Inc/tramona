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
  isUpdatingBookItNow,
  bookItNowPercent,
  setBookItNowPercent,
  biddingPercent,
  setBiddingPercent,
  isBookItNowSaveDisabled,
}: {
  property: Property;
  handleBookItNowSlider: (bookItNowPercent: number) => Promise<number>;
  handleBookItNowSwitch: (checked: boolean) => Promise<void>;
  isBookItNowChecked: boolean;
  isTogglingBookItNow: boolean;
  isUpdatingBookItNow: boolean;
  bookItNowPercent: number;
  setBookItNowPercent: (percent: number) => void;
  biddingPercent: number;
  setBiddingPercent: (percent: number) => void;
  isBookItNowSaveDisabled: boolean;
}) {
  return (
    <>
      <BookItNowSection
        handleBookItNowSlider={handleBookItNowSlider}
        isBookItNowChecked={isBookItNowChecked}
        isTogglingBookItNow={isTogglingBookItNow}
        handleBookItNowSwitch={handleBookItNowSwitch}
        isUpdatingBookItNow={isUpdatingBookItNow}
        bookItNowPercent={bookItNowPercent}
        setBookItNowPercent={setBookItNowPercent}
        isBookItNowSaveDisabled={isBookItNowSaveDisabled}
      />

      {/* Bidding section */}
      <BiddingSection
        biddingPercent={biddingPercent}
        setBiddingPercent={setBiddingPercent}
        property={property}
      />

      {/* Name your price section */}
      <RequestAndBidAutomationSection property={property} />
    </>
  );
}
