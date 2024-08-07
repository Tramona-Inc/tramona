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
  LinkIcon,
  MapPinIcon,
  TrashIcon,
  Users2Icon,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import RequestGroupAvatars from "./RequestGroupAvatars";
import RequestCardBadge from "./RequestCardBadge";
import { Button } from "../ui/button";
import { useState } from "react";
import WithdrawRequestDialog from "./WithdrawRequestDialog";

import { Badge } from "../ui/badge";
import UserAvatar from "../_common/UserAvatar";
import { TravelerVerificationsDialog } from "./TravelerVerificationsDialog";
import { getTime } from "date-fns";
import { LinkInputPropertyCard } from "../_common/LinkInputPropertyCard";
import { Separator } from "../ui/separator";

export type GuestDashboardRequest = RouterOutputs["requests"]["getMyRequests"][
  | "activeRequestGroups"
  | "inactiveRequestGroups"][number]["requests"][number];

export type AdminDashboardRequst = RouterOutputs["requests"]["getAll"][
  | "incomingRequests"
  | "pastRequests"][number];

export type HostDashboardRequest =
  RouterOutputs["properties"]["getHostPropertiesWithRequests"][number]["requests"][number]["request"];

export default function RequestCard({
  request,
  type,
  children,
}: (
  | { type: "guest"; request: GuestDashboardRequest }
  | { type: "admin"; request: AdminDashboardRequst }
  | { type: "host"; request: HostDashboardRequest }
) & {
  children?: React.ReactNode;
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

  const showAvatars =
    (request.numGuests > 1 && type !== "host") || type === "admin";

  const [open, setOpen] = useState(false);

  return (
    <Card>
      <WithdrawRequestDialog
        requestId={request.id}
        open={open}
        onOpenChange={setOpen}
      />
      <div>
        <div className="flex flex-wrap gap-2">
          {type !== "host" && <RequestCardBadge request={request} />}
          {type === "guest" && request.linkInputProperty && (
            <Badge variant="pink">
              <LinkIcon className="size-4" />
              Airbnb Link
            </Badge>
          )}
        </div>
        {type === "host" && (
          <div className="flex items-center gap-2">
            <UserAvatar
              size="sm"
              name={request.traveler.name}
              image={request.traveler.image}
            />
            <TravelerVerificationsDialog request={request} />
            <p>&middot;</p>
            <p>{formatInterval(Date.now() - getTime(request.createdAt))} ago</p>
          </div>
        )}
        <div className="absolute right-2 top-2 flex items-center gap-2">
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
      </div>
      <CardContent className="space-y-1">
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
        </div>
        {fmtdFilters && <p>{fmtdFilters}</p>}
        <div className="flex flex-wrap gap-1">
          {request.amenities.map((amenity) => (
            <Badge key={amenity}>{amenity}</Badge>
          ))}
        </div>
        {request.note && (
          <div className="rounded-lg bg-zinc-100 px-4 py-2">
            <p className="text-xs text-muted-foreground">Note</p>
            <p>&ldquo;{request.note}&rdquo;</p>
          </div>
        )}
        {type === "guest" && request.linkInputProperty && (
          <LinkInputPropertyCard property={request.linkInputProperty} />
        )}
      </CardContent>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
}
