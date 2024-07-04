import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { type RouterOutputs } from "@/utils/api";
import { getFmtdFilters } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  formatInterval,
  getNumNights,
  plural,
} from "@/utils/utils";
import {
  CalendarIcon,
  EllipsisIcon,
  MapPinIcon,
  TrashIcon,
  Users2Icon,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import RequestGroupAvatars from "./RequestGroupAvatars";
import RequestCardBadge from "./RequestCardBadge";
import { Button } from "../ui/button";
import { useState } from "react";
import WithdrawRequestDialog from "./WithdrawRequestDialog";

import MobileSimilarProperties from "./MobileSimilarProperties";
import { Separator } from "../ui/separator";
import UserAvatar from "../_common/UserAvatar";
import { getTime } from "date-fns";

export type DetailedRequest = RouterOutputs["requests"]["getMyRequests"][
  | "activeRequestGroups"
  | "inactiveRequestGroups"][number]["requests"][number];

export type RequestWithUser = RouterOutputs["requests"]["getAll"][
  | "incomingRequests"
  | "pastRequests"][number];

export type HostDashboardRequest =
  RouterOutputs["properties"]["getHostPropertiesWithRequests"][number]["requests"][number]["request"];

export default function RequestCard({
  request,
  isSelected,
  type,
  children,
}: React.PropsWithChildren<
  | {
      request: DetailedRequest;
      type: "guest";
      isSelected?: boolean;
    }
  | {
      request: RequestWithUser;
      type: "admin";
      isSelected?: boolean;
    }
  | {
      request: HostDashboardRequest;
      type: "host";
      isSelected?: boolean;
    }
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

  const showAvatars =
    (request.numGuests > 1 && type !== "host") || type === "admin";

  const [open, setOpen] = useState(false);

  return (
    <Card className="block">
      <WithdrawRequestDialog
        requestId={request.id}
        open={open}
        onOpenChange={setOpen}
      />
      <CardContent className="space-y-2">
        {/* <p className="font-mono text-xs uppercase text-muted-foreground">
          Id: {request.id} · Request group Id: {request.requestGroupId}
        </p> */}
        {type !== "host" && <RequestCardBadge request={request} />}
        {type === "host" && (
          <div className="flex gap-2 items-center">
            <UserAvatar size="sm" name={request.name} image={request.image} />
            {request.name} &middot;{" "}
            {formatInterval(Date.now() - getTime(request.createdAt))} ago
          </div>
        )}
        {/* {request.requestGroup.hasApproved ? (
          <RequestCardBadge request={request} />
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="lightGray" className="border tracking-tight">
                Unconfirmed
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-64">
              You haven&apos;t confirmed your request yet. Check your text
              messages or click &quot;Resend Confirmation&quot; to start getting
              offers.
            </TooltipContent>
          </Tooltip>
        )} */}
        <div className="absolute right-2 top-0 flex items-center gap-2">
          {showAvatars && (
            <RequestGroupAvatars
              request={request}
              isAdminDashboard={type === "admin"}
            />
          )}
          {type === "guest" && !request.resolvedAt && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem red onClick={() => setOpen(true)}>
                  <TrashIcon />
                  Withdraw
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-start gap-1">
          <MapPinIcon className="shrink-0 text-primary" />
          <h2 className="text-base font-bold text-primary md:text-lg">
            {request.location}
          </h2>
        </div>
        <div>
          <p>Requested {fmtdPrice}/night</p>
          <p className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-4" />
              {fmtdDateRange}
            </span>
            &middot;
            <span className="flex items-center gap-1">
              <Users2Icon className="size-4" />
              {fmtdNumGuests}
            </span>
          </p>

          {fmtdFilters && <p>{fmtdFilters} </p>}
          {request.note && <p>&ldquo;{request.note}&rdquo;</p>}
          {request.airbnbLink && (
            <a className="underline" href={request.airbnbLink}>
              Airbnb Link
            </a>
          )}
        </div>
        <div className="flex justify-end gap-2">{children}</div>
        {isSelected && (
          <div className="md:hidden">
            <Separator className="my-1" />
            <MobileSimilarProperties
              location={request.location}
              city={request.location}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
