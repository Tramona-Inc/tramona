import { type FeedItem } from "@/components/activity-feed/ActivityFeed";
import { formatCurrency, formatDateRange, getNumNights } from "@/utils/utils";
import BaseCard from "./BaseCard";

export default function FeedRequestCard({
  request,
}: {
  request: FeedItem & { type: "request" };
}) {
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdPrice = formatCurrency(
    request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut),
  );

  const userName = request.madeByGroup.owner.name ?? "";
  const userImage = request.madeByGroup.owner.image ?? "";

  return (
    <BaseCard item={request} userName={userName} userImage={userImage}>
      <div>
        <p>
          Made a request for{" "}
          <span className="font-bold">{request.location}</span> from{" "}
          {fmtdDateRange} for {fmtdPrice} per night
        </p>
      </div>
    </BaseCard>
  );
}
