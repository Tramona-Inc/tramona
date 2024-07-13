import { type RequestCardDataType } from "@/components/activity-feed/ActivityFeed";
import { Card, CardContent } from "../ui/card";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  getDisplayedName,
  plural,
} from "@/utils/utils";
import ShareButton from "@/components/_common/ShareLink/ShareButton";
import UserAvatar from "../_common/UserAvatar";
import BaseCard from "./BaseCard";
import CreateRequestDialog from "./admin/RequestDialog";
import { Button } from "@/components/ui/button";

export default function FeedRequestCard({
  request,
  children,
}: React.PropsWithChildren<{
  request: RequestCardDataType;
}>) {
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdPrice = formatCurrency(request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut)) ;

  const userName = request.madeByGroup.owner.name ?? "";
  const userImage = request.madeByGroup.owner.image ?? "";

  return (
    <BaseCard item={request} userName={userName} userImage={userImage}>
      <div className="flex items-center justify-between w-full">
    
      <div>
        <p>
          Made a request for{" "}
          <span className="font-bold">{request.location}</span> from{" "}
          {fmtdDateRange} for {fmtdPrice} per night
        </p>
      </div>
      {request.isFiller && (
      <CreateRequestDialog request={request}>
        <Button className="rounded-full ml-auto">Edit</Button>
      </CreateRequestDialog> )}
      </div>
    </BaseCard>
  );
}
