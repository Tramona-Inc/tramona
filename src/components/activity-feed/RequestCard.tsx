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

export default function FeedRequestCard({
  request,
  // isSelected,
  children,
}: React.PropsWithChildren<{
  request: RequestCardDataType;
  // isSelected?: boolean;
}>) {
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdPrice = formatCurrency(request.maxTotalPrice);

  const elapsedTime = getElapsedTime(new Date(request.createdAt));
  const handleShare = () => {};

  return (
    <Card className="block">
      <div className="flex items-center gap-4">
        <UserAvatar
          size="md"
          name={request.madeByGroup.owner.name}
          image={request.madeByGroup.owner.image}
        />
        <div className="min-w-0 flex-1  font-medium">
          <div className="truncate">
            {getDisplayedName(request.madeByGroup.owner.name) ?? ""}
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {elapsedTime}
          </p>
        </div>
      </div>
      <CardContent className="space-y-2">
        <div className="absolute right-2 top-0 flex items-center gap-2">
          <div className="mx-4  mt-5 flex h-full items-center justify-center">
            <ShareButton id={request.id} isRequest={true} propertyName="TODO" />
          </div>
        </div>
        <div>
          <p>
            Made a request for{" "}
            <span className="font-bold">{request.location}</span> from{" "}
            {fmtdDateRange} for {fmtdPrice} per night
          </p>
        </div>
        <div className="flex justify-end gap-2">{children}</div>
        {/* {isSelected && <div className="md:hidden">when selected</div>} */}
      </CardContent>
    </Card>
  );
}
