import { api } from "@/utils/api";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import PropertyOffersEmptySvg from "../_common/EmptyStateSvg/PropertyOffersEmptySvg";
import Spinner from "../_common/Spinner";
import { useMediaQuery } from "../_utils/useMediaQuery";
import PropertyOfferCard from "./PropertyOfferCard";
import SimiliarProperties from "./SimilarProperties";

export default function PropertyOfferTab() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { data: offers } = api.biddings.getMyBids.useQuery();

  if (!offers) return <Spinner />;

  return offers.length > 0 ? (
    <div className="grid gap-24 md:grid-cols-2">
      <div className=" col-span-1 space-y-4">
        {offers.map((offer) => (
          <PropertyOfferCard
            key={offer.id}
            offer={offer}
            isGuestDashboard={true}
          />
        ))}
      </div>
      <div>
        {offers.length > 0 && !isMobile && (
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
