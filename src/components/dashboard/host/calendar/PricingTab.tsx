import RequestAndBidAutomationSection from "./setttingsSections/pricing-sections/RequestAndBidAutomationSection";
import BookItNowSection from "./setttingsSections/pricing-sections/BookItNowSection";
import BiddingSection from "./setttingsSections/pricing-sections/BiddingSection";
import { Property } from "@/server/db/schema/tables/properties";
export default function PricingTab({
  property,
  isBookItNowChecked,
  biddingPercent,
  setBiddingPercent,
  onPriceLoadingChange,
}: {
  property: Property;
  isBookItNowChecked: boolean;
  biddingPercent: number;
  setBiddingPercent: (percent: number) => void;
  onPriceLoadingChange: (isLoading: boolean) => void;
}) {
  return (
    <>
      <BookItNowSection
        isBookItNowChecked={isBookItNowChecked}
        propertyId={property.id}
        onLoadingChange={onPriceLoadingChange}
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
