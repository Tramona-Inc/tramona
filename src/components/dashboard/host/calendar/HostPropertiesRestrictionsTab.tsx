import AgeRestrictionSection from "./setttingsSections/restriction-sections/AgeRestrictionSection";
import OfferDiscountRestictionsSection from "./setttingsSections/restriction-sections/OfferDiscountRestictionsSections";
import StripeVerificationSection from "./setttingsSections/restriction-sections/StripeVerificationSection";
import { Property } from "@/server/db/schema/tables/properties";

export default function HostPropertiesRestrictionsTab({ property }: { property: Property }) {
  return (
    <div className="mt-6 space-y-5">
      <AgeRestrictionSection ageRestriction={property.ageRestriction} propertyId={property.id} />
      <OfferDiscountRestictionsSection property={property} />
      <StripeVerificationSection stripeVerRequired={property.stripeVerRequired ?? false} property={property} />
    </div>
  );
}
