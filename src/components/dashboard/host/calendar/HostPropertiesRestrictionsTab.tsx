import AgeRestrictionSection from "./setttingsSections/restriction-sections/AgeRestrictionSection";
import OfferDiscountRestictionsSection from "./setttingsSections/restriction-sections/OfferDiscountRestictionsSections";
import StripeVerificationSection from "./setttingsSections/restriction-sections/StripeVerificationSection";
import { Property } from "@/server/db/schema/tables/properties";
import { api } from "@/utils/api";
export default function HostPropertiesRestrictionsTab({ property }: { property: Property }) {
  const { data: discountInfo, isLoading: isLoadingDiscountInfo } =
    api.properties.getDiscountPreferences.useQuery({
      propertyId: property.id,
    });
  return (
    <div className="mt-6 space-y-5">
      <AgeRestrictionSection
        ageRestriction={property.ageRestriction}
        propertyId={property.id}
      />
      <OfferDiscountRestictionsSection
        property={property}
        discountInfo={discountInfo}
        isLoadingDiscountInfo={isLoadingDiscountInfo}
      />
      {/* <StripeVerificationSection
        stripeVerRequired={property.stripeVerRequired ?? false}
        property={property}
      /> */}
    </div>
  );
}
