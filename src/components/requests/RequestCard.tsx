import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { type RouterOutputs } from "@/utils/api";
import { getFmtdFilters, getRequestStatus } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { EllipsisIcon, MapPinIcon, TrashIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import RequestGroupAvatars from "./RequestGroupAvatars";
import RequestCardBadge from "./RequestCardBadge";
import { Button } from "../ui/button";
import { useState } from "react";
import WithdrawRequestDialog from "./WithdrawRequestDialog";

import MobileSimilarProperties from "./MobileSimilarProperties";
import { Separator } from "../ui/separator";

export type DetailedRequest = RouterOutputs["requests"]["getMyRequests"][
  | "activeRequestGroups"
  | "inactiveRequestGroups"][number]["requests"][number];

export type RequestWithUser = RouterOutputs["requests"]["getAll"][
  | "incomingRequests"
  | "pastRequests"][number];

export default function RequestCard({
  request,
  isSelected,
  isAdminDashboard,
  children,
}: React.PropsWithChildren<
  | {
      request: DetailedRequest;
      isAdminDashboard?: false | undefined;
      isSelected?: boolean;
    }
  | {
      request: RequestWithUser;
      isAdminDashboard: true;
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

  const showAvatars = request.numGuests > 1 || isAdminDashboard;

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
        <RequestCardBadge request={request} />
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
              isAdminDashboard={isAdminDashboard}
            />
          )}
          {!isAdminDashboard && !request.resolvedAt && (
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
          <p>{fmtdDateRange}</p>
          {fmtdFilters && <p>{fmtdFilters} &middot;</p>}
          <p>{fmtdNumGuests}</p>
          {request.note && <p>&ldquo;{request.note}&rdquo;</p>}
          {request.airbnbLink && <a className="underline" href={request.airbnbLink}>Airbnb Link</a>}
          {isAdminDashboard && request.radius && <p>Radius: {request.radius} miles</p>}
          {isAdminDashboard && request.lat && request.lng && <p>Coordinates: {request.lat}, {request.lng}</p>}
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
