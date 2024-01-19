import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import {
  cn,
  formatCurrency,
  formatDateRange,
  formatInterval,
  getNumNights,
  plural,
} from "@/utils/utils";
import { Badge } from "../ui/badge";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import { CalendarIcon, FilterIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { getFmtdFilters } from "@/utils/formatters";

type RequestWithDetails =
  inferRouterOutputs<AppRouter>["requests"]["getMyRequests"][
    | "activeRequests"
    | "inactiveRequests"][number];

function getRequestStatus(request: RequestWithDetails) {
  if (request.numOffers === 0) return "pending";
  if (request.resolvedAt) {
    return request.numOffers === 0 ? "rejected" : "booked";
  }
  return request.numOffers === 0 ? "pending" : "accepted";
}

function RequestCardBadge({ request }: { request: RequestWithDetails }) {
  switch (getRequestStatus(request)) {
    case "pending":
      const msAgo = Date.now() - request.createdAt.getTime();
      const showTimeAgo = msAgo > 1000 * 60 * 60;
      const fmtdTimeAgo = showTimeAgo ? `(${formatInterval(msAgo)})` : "";
      return <Badge variant="yellow">Pending {fmtdTimeAgo}</Badge>;
    case "accepted":
      return (
        <Badge variant="green" className="pr-1">
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
      return <Badge variant="red">Rejected</Badge>;
    case "booked":
      return <Badge variant="blue">Used</Badge>;
  }
}

function RequestCardAction({ request }: { request: RequestWithDetails }) {
  const primaryBtn = cn(buttonVariants(), "rounded-full");
  const secondaryBtn = cn(
    buttonVariants({ variant: "outline" }),
    "rounded-full",
  );

  switch (getRequestStatus(request)) {
    case "pending":
      return null;
    case "accepted":
      return (
        <Link href={`/requests/${request.id}`} className={primaryBtn}>
          View {plural(request.numOffers, "offer")} &rarr;
        </Link>
      );
    case "rejected":
      return <Button className={secondaryBtn}>Revise</Button>;
    case "booked":
      return <Button className={primaryBtn}>Request again</Button>;
  }
}

export default function RequestCard({
  request,
}: {
  request: RequestWithDetails;
}) {
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
        <h2 className="flex items-center gap-1 text-lg font-semibold text-zinc-700">
          <MapPinIcon className="-translate-y-0.5 text-zinc-300" />
          <div className="flex-1">{request.location}</div>
          <RequestCardBadge request={request} />
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
      <CardFooter>
        <RequestCardAction request={request} />
      </CardFooter>
    </Card>
  );
}
