import RequestAndBidAutomationSection from "./setttingsSections/pricing-sections/RequestAndBidAutomationSection";
import BookItNowSection from "./setttingsSections/pricing-sections/BookItNowSection";
import OfferDiscountRestictionsSection from "./setttingsSections/restriction-sections/OfferDiscountRestictionsSections";
import { Property } from "@/server/db/schema/tables/properties";
import { api } from "@/utils/api";

export default function PricingTab({
  property,
  isBookItNowChecked,
  onPriceLoadingChange,
}: {
  property: Property;
  isBookItNowChecked: boolean;
  onPriceLoadingChange: (isLoading: boolean) => void;
}) {
  const { data: discountInfo, isLoading: isLoadingDiscountInfo } =
    api.properties.getDiscountPreferences.useQuery({
      propertyId: property.id,
    });

  return (
    <>
      <BookItNowSection
        isBookItNowChecked={isBookItNowChecked}
        propertyId={property.id}
        onLoadingChange={onPriceLoadingChange}
      />

      {/* Offer Discount Restrictions section */}
      <OfferDiscountRestictionsSection
        property={property}
        discountInfo={discountInfo}
        isLoadingDiscountInfo={isLoadingDiscountInfo}
      />

      {/* Name your price section */}
      {/* <RequestAndBidAutomationSection property={property} /> */}
    </>
  );
}
