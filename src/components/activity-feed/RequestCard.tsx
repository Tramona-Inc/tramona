import { type RequestCardDataType } from "@/components/activity-feed/ActivityFeed";
import { Card, CardContent } from "../ui/card";
import {
  formatCurrency,
  formatDateRange,
  getElapsedTime,
  getDisplayedName,
  plural,
} from "@/utils/utils";
import ShareButton from "@/components/_common/ShareLink/ShareButton";
import UserAvatar from "../_common/UserAvatar";
import BaseCard from "./BaseCard";

export default function FeedRequestCard({
  request,
  children,
}: React.PropsWithChildren<{
  request: RequestCardDataType;
}>) {
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdPrice = formatCurrency(request.maxTotalPrice);

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
