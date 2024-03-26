import { type RouterOutputs } from "@/utils/api";
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
import { Icons } from "../_icons/icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import RequestGroupAvatars from "./RequestCardGroupAvatars";

export type DetailedRequest = RouterOutputs["requests"]["getMyRequests"][
  | "activeRequestGroups"
  | "inactiveRequestGroups"][number]["requests"][number];

export type RequestWithUser = RouterOutputs["requests"]["getAll"][
  | "incomingRequests"
  | "pastRequests"][number];

export default function RequestCard({
  request,
  isAdminDashboard,
  children,
}: React.PropsWithChildren<
  | { request: DetailedRequest; isAdminDashboard?: false | undefined }
  | { request: RequestWithUser; isAdminDashboard: true }
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

  const showAvatars = request.numGuests > 1 || isAdminDashboard;

  return (
    <Card key={request.id}>
      <CardContent className="space-y-2">
        <RequestCardBadge request={request} />
        <div className="absolute right-4 top-2 flex flex-row items-center gap-2">
          {showAvatars && (
            <RequestGroupAvatars
              request={request}
              isAdminDashboard={isAdminDashboard}
            />
          )}
          <ActionDialog />
        </div>
        <div className="flex items-start gap-1">
          <MapPinIcon className="shrink-0 text-zinc-300" />
          <h2 className="text-lg font-semibold text-zinc-700">
            {request.location}
          </h2>
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

function ActionDialog() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"ghost"}>
            <Icons.ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
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
        <Badge variant="green">
          {plural(request.numOffers, "offer")}
          {"hostImages" in request && request.hostImages.length > 0 && (
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
          )}
        </Badge>
      );
    case "rejected":
      return <Badge variant="red">Rejected</Badge>;
    case "booked":
      return <Badge variant="blue">Booked</Badge>;
    case "unconfirmed":
      return <Badge variant="secondary">Unconfirmed</Badge>;
  }
}
