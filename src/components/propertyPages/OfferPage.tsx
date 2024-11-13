import PropertyPage from "./PropertyPage";
import type { OfferWithDetails } from "./PropertyPage";
import OfferPageMobileBottomCard from "./sidebars/OfferPageMobileBottomCard";
import OfferPageSidebar from "./sidebars/OfferPageSidebar";

export function OfferPage({ offer }: { offer: OfferWithDetails }) {
  return (
    <PropertyPage
      property={offer.property}
      offer={offer}
      sidebar={<OfferPageSidebar offer={offer} property={offer.property} />}
      mobileBottomCard={
        <OfferPageMobileBottomCard offer={offer} property={offer.property} />
      }
    />
  );
}
