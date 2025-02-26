import AgeRestrictionSection from "./setttingsSections/restriction-sections/AgeRestrictionSection";
import StripeVerificationSection from "./setttingsSections/restriction-sections/StripeVerificationSection";
import { Property } from "@/server/db/schema/tables/properties";

export default function HostPropertiesRestrictionsTab({
  property,
}: {
  property: Property;
}) {
  return (
    <div className="mt-6 space-y-5">
      <AgeRestrictionSection
        ageRestriction={property.ageRestriction}
        propertyId={property.id}
      />
      {/* <StripeVerificationSection
        stripeVerRequired={property.stripeVerRequired ?? false}
        property={property}
      /> */}
    </div>
  );
}
