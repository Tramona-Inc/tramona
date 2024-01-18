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
import { MapPinIcon } from "lucide-react";

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

function RequestCardTag({ request }: { request: RequestWithDetails }) {
  switch (getRequestStatus(request)) {
    case "pending":
      return (
        <Badge variant="yellow">
          Pending ({formatInterval(Date.now() - request.createdAt.getTime())})
        </Badge>
      );
    case "accepted":
      return (
        <Badge variant="green" className="pr-1">
          {request.numOffers > 0 ? request.numOffers : "No"}{" "}
          {request.numOffers === 1 ? "offer" : "offers"}
          <div className="flex items-center -space-x-2">
            {request.numOffers > 0 &&
              Array.from({ length: Math.min(request.numOffers, 3) }).map(
                (_, i) => (
                  <Image
                    key={i}
                    src={`/assets/images/fake-pfps/1.png`}
                    alt=""
                    width={22}
                    height={22}
                    className="inline-block"
                  />
                ),
              )}
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
  switch (getRequestStatus(request)) {
    case "pending":
      return null;
    case "accepted":
      const numOffers = request.numOffers;
      const buttonText = `View ${numOffers === 1 ? "Offer" : "Offers"}`;
      const primaryBtn = cn(
        buttonVariants({ size: "lg", variant: "default" }),
        "w-36 rounded-full",
      );

      return (
        <Link href={`/requests/${request.id}`} className={primaryBtn}>
          {buttonText} &rarr;
        </Link>
      );
    case "rejected":
      return (
        <Button size="lg" variant="outline" className="w-36 rounded-full">
          Revise
        </Button>
      );
    case "booked":
      return (
        <Button size="lg" className="w-36 rounded-full">
          Request again
        </Button>
      );
  }
}

export default function RequestCard({
  request,
}: {
  request: RequestWithDetails;
}) {
  const pricePerNight =
    request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut);
  const fmtdPrice = `${formatCurrency(pricePerNight)}`;
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");

  return (
    <article
      key={request.id}
      className="flex items-stretch gap-1 rounded-xl border border-zinc-100 bg-white p-4 shadow-md"
    >
      <div className="flex-1">
        <h2 className="flex gap-1 text-lg font-semibold text-zinc-700">
          <div className="opacity-25">
            <MapPinIcon />
          </div>
          {request.location}
        </h2>
        <div className="pl-7 text-zinc-500">
          <p>
            requested{" "}
            <strong className="text-lg text-zinc-600">{fmtdPrice}</strong>
            <span className="text-sm">/night</span>
          </p>
          <p>
            {fmtdDateRange} • {fmtdNumGuests}
          </p>

          {request.note && (
            <div className="rounded-md bg-accent p-2 text-sm text-accent-foreground">
              <p>&ldquo;{request.note}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between gap-2">
        <RequestCardTag request={request} />
        <RequestCardAction request={request} />
      </div>
    </article>
  );
}
