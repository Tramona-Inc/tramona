import { type RequestCardDataType } from "@/components/activity-feed/ActivityFeed";
import { Card, CardContent } from "../ui/card";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import ShareButton from "@/components/_common/ShareLink/ShareButton";

export default function FeedRequestCard({
  request,
  isSelected,
  children,
}: React.PropsWithChildren<{
  request: RequestCardDataType;
  isSelected?: boolean;
}>) {
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdPrice = formatCurrency(request.maxTotalPrice);

  const handleShare = () => {};

  return (
    <Card className="block">
      <div>avatar here</div>

      <CardContent className="space-y-2">
        <div className="absolute right-2 top-0 flex items-center gap-2">
          <div className="mx-4  mt-5 flex h-full items-center justify-center">
            <ShareButton id={request.id} isRequest={true} propertyName="TODO" />
          </div>
        </div>
        <div>
          <p>
            Made a request for {request.location} from {fmtdDateRange} for{" "}
            {fmtdPrice} per night
          </p>
        </div>
        <div className="flex justify-end gap-2">{children}</div>
        {isSelected && <div className="md:hidden">when selected</div>}
      </CardContent>
    </Card>
  );
}
