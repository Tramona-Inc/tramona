import { api } from "@/utils/api";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import PropertyOffersEmptySvg from "../_common/EmptyStateSvg/PropertyOffersEmptySvg";
import Spinner from "../_common/Spinner";
import PropertyOfferCard from "./PropertyOfferCard";
import SimiliarProperties from "./SimilarProperties";
import { useEffect, useState } from "react";

export default function PropertyOfferTab() {
  const { data: offers } = api.biddings.getMyBids.useQuery();

  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const selectedOffer = offers?.find((offer) => offer.id === selectedOfferId);

  useEffect(() => {
    if (!selectedOfferId && offers) {
      setSelectedOfferId(offers[0]?.id ?? null);
    }
  }, [offers, selectedOfferId]);

  if (!offers) return <Spinner />;

  return offers.length > 0 ? (
    <div className="grid grid-cols-3 gap-8 md:grid-cols-5">
      <div className="col-span-3 space-y-4 pb-64">
        {offers.map((offer) => (
          <PropertyOfferCard
            key={offer.id}
            offer={offer}
            isGuestDashboard={true}
            selectedOfferId={selectedOfferId}
            setSelectedOfferId={setSelectedOfferId}
          />
        ))}
      </div>
      <div className="hidden md:col-span-2 md:block">
        {selectedOffer ? (
          <SimiliarProperties
            location={selectedOffer.property.address}
            city={selectedOffer.property.address}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  ) : (
    <EmptyStateValue
      title="No property offers"
      description="You don't have any active offers. Properties that you make an offer on will show up here."
      redirectTitle="Make offer"
      href="/"
    >
      <PropertyOffersEmptySvg />
    </EmptyStateValue>
  );
}
