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
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";

export type DetailedRequest =
  inferRouterOutputs<AppRouter>["requests"]["getMyRequests"][
    | "activeRequests"
    | "inactiveRequests"][number];

export type RequestWithUser =
  inferRouterOutputs<AppRouter>["requests"]["getAll"][
    | "incomingRequests"
    | "pastRequests"][number];

export default function RequestCard({
  withUser,
  request,
  children,
}: React.PropsWithChildren<
  | { request: DetailedRequest; withUser?: false | undefined }
  | { request: RequestWithUser; withUser: true }
>) {
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
    <Card key={request.id}>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1">
            {withUser && (
              <p className="text-xs font-medium text-zinc-500">
                {request.madeByUser.email}
              </p>
            )}
            <div className="flex items-start gap-1">
              <MapPinIcon className="shrink-0 text-zinc-300" />
              <h2 className="text-lg font-semibold text-zinc-700">
                {request.location}
              </h2>
            </div>
          </div>
          <RequestCardBadge request={request} />
        </div>
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
      <CardFooter>{children}</CardFooter>
    </Card>
  );
}

function RequestCardBadge({
  request,
}: {
  request: DetailedRequest | RequestWithUser;
}) {
  switch (getRequestStatus(request)) {
    case "pending":
      const msAgo = Date.now() - request.createdAt.getTime();
      const showTimeAgo = msAgo > 1000 * 60 * 60;
      const fmtdTimeAgo = showTimeAgo ? `(${formatInterval(msAgo)})` : "";
      return <Badge variant="yellow">Pending {fmtdTimeAgo}</Badge>;
    case "accepted":
      return (
        <Badge variant="green" className="pr-1">
          {plural(request.numOffers, "offer")}
          <div className="flex items-center -space-x-2">
            {"hostImages" in request &&
              request.hostImages.map((imageUrl) => (
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
      return <Badge variant="red">Rejected</Badge>;
    case "booked":
      return <Badge variant="blue">Booked</Badge>;
  }
}
