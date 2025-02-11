import { formatDistanceToNowStrict } from "date-fns";
import { type RouterOutputs } from "@/utils/api";
import UserAvatar from "@/components/_common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { TravelerVerificationsDialog } from "@/components/requests/TravelerVerificationsDialog";
import { Card, CardFooter } from "@/components/ui/card";
import OfferPriceBreakdown from "../pricebreakdown/OfferPricebreakdown";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import WithdrawRequestDialog from "@/components/requests/WithdrawRequestDialog";
import { ClockIcon } from "lucide-react";
import { useState } from "react";
import { requestAmountToBaseOfferedAmount } from "@/utils/payment-utils/paymentBreakdown";

export type HostDashboardRequest =
  RouterOutputs["properties"]["getHostPropertiesWithRequests"][number]["requests"][number]["request"];

export default function RequestCard({
  request,
  children,
}: { type: "host"; request: HostDashboardRequest } & {
  children?: React.ReactNode;
}) {
  const pricePerNight =
    requestAmountToBaseOfferedAmount(request.maxTotalPrice) /
    getNumNights(request.checkIn, request.checkOut);

  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");

  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden p-0">
      <WithdrawRequestDialog
        requestId={request.id}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 space-y-4 overflow-hidden p-4 pt-2">
          <div className="flex items-center gap-2">
            <UserAvatar
              size="sm"
              name={request.traveler.name}
              image={request.traveler.image}
            />
            <TravelerVerificationsDialog request={request} />
            <p>·</p>
            <p>
              {formatDistanceToNowStrict(request.createdAt, {
                addSuffix: true,
              })}
            </p>
          </div>

          <div className="space-y-1">
            <div>
              <p>
                Requested <span className="font-medium">{fmtdPrice}</span>
                /night
              </p>
              <p className="mt-3 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {fmtdDateRange}
                </span>
                ·
                <span className="flex items-center gap-1">{fmtdNumGuests}</span>
              </p>
            </div>
            <OfferPriceBreakdown request={request} />

            <div className="flex flex-wrap gap-1">
              {request.minNumBeds && request.minNumBeds > 1 && (
                <Badge>{request.minNumBeds}+ beds</Badge>
              )}
              {request.minNumBedrooms && request.minNumBedrooms > 1 && (
                <Badge>{request.minNumBedrooms}+ bedrooms</Badge>
              )}
              {request.minNumBathrooms && request.minNumBathrooms > 1 && (
                <Badge>{request.minNumBathrooms}+ bathrooms</Badge>
              )}
              {request.propertyType && <Badge>{request.propertyType}</Badge>}
              {request.amenities.map((amenity) => (
                <Badge key={amenity}>{amenity}</Badge>
              ))}
            </div>

            {request.note && (
              <div className="rounded-lg bg-zinc-100 px-4 py-2">
                <p className="text-xs text-muted-foreground">Note</p>
                <p>{request.note}</p>
              </div>
            )}
          </div>

          {children && <CardFooter>{children}</CardFooter>}
        </div>
      </div>
    </Card>
  );
}
