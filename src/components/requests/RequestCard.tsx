import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { type RouterOutputs } from "@/utils/api";
import { getRequestStatus } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
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
import { Card, CardFooter } from "../ui/card";
import RequestGroupAvatars from "./RequestGroupAvatars";
import RequestCardBadge from "./RequestCardBadge";
import { Button } from "../ui/button";
import { useState } from "react";
import WithdrawRequestDialog from "./WithdrawRequestDialog";

import { Badge } from "../ui/badge";
import UserAvatar from "../_common/UserAvatar";
import { TravelerVerificationsDialog } from "./TravelerVerificationsDialog";
import { formatDistanceToNowStrict } from "date-fns";
import { LinkInputPropertyCard } from "../_common/LinkInputPropertyCard";
import SingleLocationMap from "../_common/GoogleMaps/SingleLocationMap";
import { RequestCardOfferPreviews } from "./RequestCardOfferPreviews";
export type GuestDashboardRequest = RouterOutputs["requests"]["getMyRequests"][
  | "activeRequests"
  | "inactiveRequests"][number];

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

  const showAvatars =
    (request.numGuests > 1 && type !== "host") || type === "admin";

  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden p-0">
      {/* {request.id} */}
      <WithdrawRequestDialog
        requestId={request.id}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="flex">
        <div className="flex-1 space-y-4 overflow-hidden p-4 pt-2">
          <div className="flex items-center gap-2">
            {type !== "host" && <RequestCardBadge request={request} />}
            {type === "guest" && request.linkInputProperty && (
              <Badge variant="pink">
                <LinkIcon className="size-4" />
                Airbnb Link
              </Badge>
            )}
            {type === "host" && (
              <>
                <UserAvatar
                  size="sm"
                  name={request.traveler.name}
                  image={request.traveler.image}
                />
                <TravelerVerificationsDialog request={request} />
                <p>&middot;</p>
                <p>
                  {formatDistanceToNowStrict(request.createdAt, {
                    addSuffix: true,
                  })}
                </p>
              </>
            )}
            <div className="flex-1" />
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
          <div className="space-y-1">
            {type !== "host" && (
              <div className="flex items-start gap-1">
                <MapPinIcon className="shrink-0 text-primary" />
                <h2 className="text-base font-bold text-primary md:text-lg">
                  {request.location}
                </h2>
              </div>
            )}
            <div>
              <p className="mb-4 font-bold">
                Requested <span className="font-bold">{fmtdPrice}</span>
                /night
              </p>
              <p className="flex items-center gap-2">
                <span className="flex items-center gap-1">{fmtdDateRange}</span>
                &middot;
                <span className="flex items-center gap-1">{fmtdNumGuests}</span>
              </p>
            </div>
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
                <p>&ldquo;{request.note}&rdquo;</p>
              </div>
            )}
            {type !== "host" && request.linkInputProperty && (
              <LinkInputPropertyCard property={request.linkInputProperty} />
            )}
          </div>
          {type === "guest" && getRequestStatus(request) === "accepted" && (
            <RequestCardOfferPreviews request={request} />
          )}
          <CardFooter className="empty:hidden">{children}</CardFooter>
        </div>
        {type !== "host" && (
          <div className="hidden w-64 shrink-0 bg-zinc-100 lg:block">
            <SingleLocationMap
              lat={request.latLngPoint.y}
              lng={request.latLngPoint.x}
              icon={true}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
