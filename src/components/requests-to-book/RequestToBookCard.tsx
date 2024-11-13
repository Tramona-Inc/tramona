import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { type RouterOutputs } from "@/utils/api";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import {
  CalendarIcon,
  EllipsisIcon,
  Home,
  MapPinIcon,
  TrashIcon,
  Users2Icon,
} from "lucide-react";
import { Card, CardFooter } from "../ui/card";
import RequestToBookCardBadge from "./RequestToBookCardBadge";
import { Button } from "../ui/button";
import { useState } from "react";
import WithdrawRequestToBookDialog from "./WithdrawRequestToBookDialog";

import { RequestToBookCardPreviews } from "./RequestToBookCardPreviews";
import { Property } from "@/server/db/schema";
import UserAvatar from "../_common/UserAvatar";
import { formatDistanceToNowStrict } from "date-fns";
import { TravelerVerificationsDialog } from "../requests/TravelerVerificationsDialog";

// export type GuestDashboardRequest = RouterOutputs["requests"]["getMyRequests"][
//   | "activeRequests"
//   | "inactiveRequests"][number];

// export type AdminDashboardRequst = RouterOutputs["requests"]["getAll"][
//   | "incomingRequests"
//   | "pastRequests"][number];

export type HostDashboardRequestToBook =
  RouterOutputs["requestsToBook"]["getHostRequestsToBookFromId"][
    | "activeRequestsToBook"
    | "inactiveRequestsToBook"][number];

export type GuestDashboardRequestToBook =
  RouterOutputs["requestsToBook"]["getMyRequestsToBook"][
    | "activeRequestsToBook"
    | "inactiveRequestsToBook"][number];

export default function RequestToBookCard({
  requestToBook,
  // property,
  type,
  children,
}: (
  | {
      type: "guest";
      requestToBook: GuestDashboardRequestToBook;
    }
  // change these
  | {
      type: "admin";
      requestToBook: GuestDashboardRequestToBook;
    }
  | {
      type: "host";
      requestToBook: HostDashboardRequestToBook;
      // property: Property;
    } // | { type: "guest"; request: GuestDashboardRequest }
  // | { type: "host"; request: HostDashboardRequest }
) & // | { type: "admin"; request: AdminDashboardRequst }
{
  children?: React.ReactNode;
}) {
  const pricePerNight =
    // request.maxTotalPrice
    34567 / getNumNights(requestToBook.checkIn, requestToBook.checkOut);
  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(
    requestToBook.checkIn,
    requestToBook.checkOut,
  );
  const fmtdNumGuests = plural(requestToBook.numGuests, "guest");

  const showAvatars =
    (requestToBook.numGuests > 1 && type !== "host") || type === "admin";

  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden p-0">
      {/* {request.id} */}
      <WithdrawRequestToBookDialog
        requestToBookId={requestToBook.id}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="flex">
        <div className="flex-1 space-y-4 overflow-hidden p-4 pt-2">
          <div className="flex items-center gap-2">
            {type !== "host" && (
              <RequestToBookCardBadge requestToBook={requestToBook} />
            )}
            {/* {type === "guest" && request.linkInputProperty && (
              <Badge variant="pink">
                <LinkIcon className="size-4" />
                Airbnb Link
              </Badge>
            )} */}
            {type === "host" && (
              <>
                <UserAvatar
                  size="sm"
                  name={requestToBook.madeByGroup.owner.name}
                  image={requestToBook.madeByGroup.owner.image}
                />
                <TravelerVerificationsDialog request={requestToBook} />
                <p>&middot;</p>
                <p>
                  {formatDistanceToNowStrict(requestToBook.createdAt, {
                    addSuffix: true,
                  })}
                </p>
              </>
            )}
            <div className="flex-1" />
            {/* figure out madeByGroupId stuff and then refactor */}
            {/* {showAvatars && (
              <RequestGroupAvatars
                request={request}
                isAdminDashboard={type === "admin"}
              />
            )} */}
            {type === "guest" && !requestToBook.resolvedAt && (
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
              <div>
                <div className="flex items-start gap-1">
                  <MapPinIcon className="shrink-0 text-primary" />
                  <h2 className="text-base font-bold text-primary md:text-lg">
                    {requestToBook.property.city}
                  </h2>
                </div>
                <div className="flex items-start gap-1">
                  <Home className="shrink-0 text-primary" />
                  <h2 className="text-base font-bold text-primary md:text-lg">
                    {requestToBook.property.name}
                  </h2>
                </div>
              </div>
            )}
            <div>
              <p>
                Requested <span className="font-semibold">{fmtdPrice}</span>
                /night
              </p>
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
            {/* <div className="flex flex-wrap gap-1">
              {property.numBeds > 1 && (
                <Badge>{property.numBeds}+ beds</Badge>
              )}
              {property.numBedrooms > 1 && (
                <Badge>{property.numBedrooms}+ bedrooms</Badge>
              )}
              {property.numBathrooms && property.numBathrooms > 1 && (
                <Badge>{property.numBathrooms}+ bathrooms</Badge>
              )} */}
            {/* {<Badge>{property.propertyType}</Badge>}
              {property.amenities.map((amenity) => (
                <Badge key={amenity}>{amenity}</Badge>
              ))} */}
            {/* </div> */}
            {/* {request.note && (
              <div className="rounded-lg bg-zinc-100 px-4 py-2">
                <p className="text-xs text-muted-foreground">Note</p>
                <p>&ldquo;{request.note}&rdquo;</p>
              </div>
            )} */}
            {/* {type !== "host" && request.linkInputProperty && (
              <LinkInputPropertyCard property={request.linkInputProperty} />
            )} */}
          </div>
          {/* add an 'accepted' column to requestsToBook */}
          {type === "guest" && !requestToBook.isAccepted && (
            <RequestToBookCardPreviews requestToBook={requestToBook} />
          )}
          <CardFooter className="empty:hidden">{children}</CardFooter>
        </div>
        {/* {type !== "host" && (
          <div className="hidden w-64 shrink-0 bg-zinc-100 lg:block">
            <SingleLocationMap
              lat={property.latLngPoint.y}
              lng={property.latLngPoint.x}
              icon={true}
            />
          </div>
        )} */}
      </div>
    </Card>
  );
}
