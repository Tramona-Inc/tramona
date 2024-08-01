import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import Spinner from "@/components/_common/Spinner";
import { RequestCards } from "@/components/requests/RequestCards";
import { api } from "@/utils/api";
import PropertyOfferCard from "./PropertyOfferCard";

export default function PastRequestsAndOffersTab() {
  const { data: requests } = api.requests.getMyRequests.useQuery();
  const { data: unfilteredOffers } = api.biddings.getMyBids.useQuery();
  const offers = unfilteredOffers?.filter(
    (offer) => offer.status !== "Pending",
  );

  if (!requests || !offers) return <Spinner />;

  return requests.inactiveRequestGroups.length !== 0 ? (
    <div className="grid grid-cols-1 gap-4 pb-32 md:grid-cols-2">
      <RequestCards requestGroups={requests.inactiveRequestGroups} />
      {offers.map((offer) => (
        <PropertyOfferCard
          key={offer.id}
          offer={offer}
          isGuestDashboard={true}
        />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center">
        <EmptyStateValue
          title={"You have no history"}
          description={
            "You haven't made any request or offers. Completed requets will show up here."
          }
          redirectTitle={"Request Deal"}
          href={"/"}
        />
      </p>
    </div>
  );
}
