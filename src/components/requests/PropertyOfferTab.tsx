import { api } from "@/utils/api";
import PropertyOfferCard from "./PropertyOfferCard";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import PropertyOffersEmptySvg from "../_common/EmptyStateSvg/PropertyOffersEmptySvg";

export default function PropertyOfferTab() {
  const { data: offers } = api.biddings.getMyBids.useQuery();

  return (
    <div className="flex flex-col gap-5">
      <EmptyStateValue
        title="No property offers"
        description="You don't have any active offers. Properties that you make an offer on will show up here."
        redirectTitle="Make offer"
        href="/"
      >
        <PropertyOffersEmptySvg />
      </EmptyStateValue>
    </div>
  );
}
