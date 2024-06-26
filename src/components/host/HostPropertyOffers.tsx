import { api } from "@/utils/api";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import PropertyOffersEmptySvg from "../_common/EmptyStateSvg/PropertyOffersEmptySvg";
import Spinner from "../_common/Spinner";
import HostPropertyOfferCard from "./HostPropertyOfferCard";
export default function HostPropertyOffers() {
  // const isMobile = useMediaQuery("(max-width: 640px)");
  const { data: offers } = api.biddings.getAllHostPending.useQuery();

  if (!offers) return <Spinner />;

  return offers.length > 0 ? (
    <>
      {offers.map((offer) => (
        <HostPropertyOfferCard
          key={offer.id}
          offer={offer}
          isGuestDashboard={false}
        />
      ))}
    </>
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
