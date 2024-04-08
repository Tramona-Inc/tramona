import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFmtdFilters, getRequestStatus } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  formatInterval,
  getNumNights,
  plural,
} from "@/utils/utils";
import { CalendarIcon, FilterIcon, MapPinIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { type DetailedRequest } from "../RequestCard";
import RequestRefreshDialog from "../RequestRefreshDialog";

export default function LargeRequestCard({
  request,
}: {
  request: DetailedRequest | undefined;
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
    <Card size="lg" className="h-64">
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
        <LargeRequestCardBadge request={request} />
      </div>
      {request.numOffers > 0 && <RequestRefreshDialog request={request} />}
    </Card>
  );
}

function LargeRequestCardBadge({ request }: { request: DetailedRequest }) {
  switch (getRequestStatus(request)) {
    case "pending":
      const msAgo = Date.now() - request.createdAt.getTime();
      const showTimeAgo = msAgo > 1000 * 60 * 60;
      const fmtdTimeAgo = showTimeAgo ? `(${formatInterval(msAgo)})` : "";
      return (
        <Badge size="lg" variant="yellow">
          Pending {fmtdTimeAgo}
        </Badge>
      );
    case "accepted":
      return (
        <Badge size="lg" variant="green" className="pr-1">
          {request.numOffers > 0 ? request.numOffers : "No"}{" "}
          {request.numOffers === 1 ? "offer" : "offers"}
          <div className="flex items-center -space-x-2">
            {request.hostImages.map((imageUrl) => (
              <Image
                key={imageUrl}
                src={imageUrl}
                alt=""
                width={22}
                height={22}
                className="inline-block"
              />
            ))}
          </div>
        </Badge>
      );
    case "rejected":
      return (
        <Badge size="lg" variant="red">
          Rejected
        </Badge>
      );
    case "booked":
      return (
        <Badge size="lg" variant="blue">
          Used
        </Badge>
      );
  }
}
