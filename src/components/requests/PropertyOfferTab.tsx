import { api } from "@/utils/api";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import PropertyOffersEmptySvg from "../_common/EmptyStateSvg/PropertyOffersEmptySvg";
import Spinner from "../_common/Spinner";
import PropertyOfferCard from "./PropertyOfferCard";

export default function PropertyOfferTab() {
  const { data: offers } = api.biddings.getMyBids.useQuery();

  if (!offers) return <Spinner />;

  return offers.length > 0 ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {offers.map((offer) => (
        <PropertyOfferCard
          key={offer.id}
          offer={offer}
          isGuestDashboard={true}
        />
      ))}
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
