import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import { formatCurrency, formatDateRange, getNumNights } from "@/utils/utils";
import BaseCard from "./BaseCard";
import RequestDialog from "./admin/RequestDialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function FeedRequestCard({
  request,
}: {
  request: FeedRequestItem;
}) {
  const { data: session } = useSession();
  const isAdmin = session && session.user.role === "admin";

  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const numNights = getNumNights(request.checkIn, request.checkOut);
  const fmtdPrice = formatCurrency(request.maxTotalPrice / numNights);
  const userName = request.madeByGroup.owner.firstName ?? "";
  const userImage = request.madeByGroup.owner.image ?? "";

  return (
    <BaseCard item={request} userName={userName} userImage={userImage}>
      <div className="flex w-full items-center justify-between">
        <div>
          <p>
            Made a request for{" "}
            <span className="font-bold">{request.location}</span> from{" "}
            {fmtdDateRange} for {fmtdPrice}/night
          </p>
        </div>
        {isAdmin && request.isFiller && (
          <RequestDialog request={request}>
            <Button className="ml-auto rounded-full">Edit</Button>
          </RequestDialog>
        )}
      </div>
    </BaseCard>
  );
}
