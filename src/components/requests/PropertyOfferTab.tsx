import { api } from "@/utils/api";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import PropertyOffersEmptySvg from "../_common/EmptyStateSvg/PropertyOffersEmptySvg";
import Spinner from "../_common/Spinner";
import PropertyOfferCard from "./PropertyOfferCard";
import SimiliarProperties from "./SimilarProperties";

export default function PropertyOfferTab() {
  const { data: offers } = api.biddings.getMyBids.useQuery();

  if (!offers) return <Spinner />;

  return offers.length > 0 ? (
    <div className="grid grid-cols-3 gap-8 md:grid-cols-5">
      <div className="col-span-3 space-y-4 pb-64">
        {offers.map((offer) => (
          <PropertyOfferCard
            key={offer.id}
            offer={offer}
            isGuestDashboard={true}
          />
        ))}
      </div>
      <div className="hidden md:col-span-2 md:block">
        {offers.length > 0 && (
          // ! Change to one prop (calls the same)
          <SimiliarProperties
            location={offers[0]!.property.address}
            city={offers[0]!.property.address}
          />
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
