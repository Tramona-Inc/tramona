import AgeRestrictionSection from "./setttingsSections/restriction-sections/AgeRestrictionSection";
import OfferDiscountRestictionsSection from "./setttingsSections/restriction-sections/OfferDiscountRestictionsSections";
import StripeVerificationSection from "./setttingsSections/restriction-sections/StripeVerificationSection";
import { type Property } from "@/server/db/schema";

export default function HostPropertiesRestrictionsTab({ property }: { property: Property }) {
  return (
    <div className="mt-6 space-y-5">
      <AgeRestrictionSection ageRestriction={property.ageRestriction} property={property} />
      <OfferDiscountRestictionsSection />
      <StripeVerificationSection stripeVerRequired={property.stripeVerRequired ?? false} property={property} />
    </div>
  );
}
