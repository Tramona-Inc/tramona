import { Card, CardContent } from "@/components/ui/card";
import { getFmtdFilters } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { CalendarIcon, FilterIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { type GuestDashboardRequest } from "../RequestCard";
import RequestRefreshDialog from "../RequestRefreshDialog";
import RequestCardBadge from "../RequestCardBadge";

export default function LargeRequestCard({
  request,
}: {
  request: GuestDashboardRequest | undefined;
}) {
  if (!request) {
    return <Card size="lg" className="h-64" />;
  }

  const pricePerNight =
    request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut);
  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");

  const fmtdFilters = getFmtdFilters(request, {
    withoutNote: true,
    excludeDefaults: true,
  });

  return (
    <Card size="lg" className="min-h-64">
      <CardContent className="space-y-2">
        <h2 className="flex items-center gap-1 text-lg font-semibold text-zinc-700">
          <MapPinIcon className="-translate-y-0.5 text-zinc-300" />
          <div className="flex-1">{request.location}</div>
        </h2>
        <div className="text-zinc-500">
          <p>
            requested{" "}
            <strong className="text-lg text-zinc-600">{fmtdPrice}</strong>
            <span className="text-sm">/night</span>
          </p>
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4" />
            <p className="mr-3">{fmtdDateRange}</p>
            <UsersIcon className="size-4" />
            <p>{fmtdNumGuests}</p>
          </div>
          {fmtdFilters && (
            <div className="flex items-center gap-1">
              <FilterIcon className="size-4" />
              <p>{fmtdFilters}</p>
            </div>
          )}
        </div>
        {request.note && (
          <div className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
            <p>&ldquo;{request.note}&rdquo;</p>
          </div>
        )}
      </CardContent>
      <div className="flex justify-end">
        <RequestCardBadge size="lg" request={request} />
      </div>
      {request.numOffers > 0 && <RequestRefreshDialog request={request} />}
    </Card>
  );
}
