import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UserAvatar from "@/components/_common/UserAvatar";
import { formatDistanceToNowStrict } from "date-fns";
import { TravelerVerificationsDialog } from "@/components/requests/TravelerVerificationsDialog";
import WithdrawRequestToBookDialog from "@/components/requests-to-book/WithdrawRequestToBookDialog";
import RequestToBookCardBadge from "@/components/requests-to-book/RequestToBookCardBadge";

export type HostDashboardRequestToBook =
  RouterOutputs["requestsToBook"]["getHostRequestsToBookFromId"][
    | "activeRequestsToBook"
    | "inactiveRequestsToBook"][number];

export default function HostRequestToBookCard({
  requestToBook,
  children,
}: {
  requestToBook: HostDashboardRequestToBook;
  children?: React.ReactNode;
}) {
  const pricePerNight =
    requestToBook.amountAfterTravelerMarkupAndBeforeFees /
    getNumNights(requestToBook.checkIn, requestToBook.checkOut);
  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(
    requestToBook.checkIn,
    requestToBook.checkOut,
  );
  const fmtdNumGuests = plural(requestToBook.numGuests, "guest");

  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden p-0">
      {/* {request.id} */}
      <WithdrawRequestToBookDialog
        requestToBookId={requestToBook.id}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="flex p-2">
        <div className="flex-1 space-y-4 overflow-hidden p-4 pt-2">
          <div className="flex items-center gap-2">
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

            <RequestToBookCardBadge requestToBook={requestToBook} />
            <div className="flex-1" />

            {!requestToBook.resolvedAt && (
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 shrink-0 text-primary" />
              <h2 className="text-sm font-semibold text-primary md:text-base">
                {requestToBook.property.city}
              </h2>
            </div>
            <div className="flex items-start gap-2">
              <Home className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <h2 className="text-sm font-semibold text-primary md:text-base">
                {requestToBook.property.name}
              </h2>
            </div>

            <div>
              <p>
                Requested <span className="font-semibold">{fmtdPrice}</span>
                /night
              </p>
              <p className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {fmtdDateRange}
                </span>
                &middot;
                <span className="flex items-center gap-1">
                  <Users2Icon className="h-4 w-4" />
                  {fmtdNumGuests}
                </span>
              </p>
            </div>
          </div>
          <CardFooter className="empty:hidden">{children}</CardFooter>
        </div>
      </div>
    </Card>
  );
}
