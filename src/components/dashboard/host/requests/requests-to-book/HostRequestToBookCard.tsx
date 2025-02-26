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
  ClockIcon,
  EllipsisIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UserAvatar from "@/components/_common/UserAvatar";
import { formatDistanceToNowStrict } from "date-fns";
import { TravelerVerificationsDialog } from "@/components/requests/TravelerVerificationsDialog";
import WithdrawRequestToBookDialog from "@/components/requests-to-book/WithdrawRequestToBookDialog";
import RequestToBookCardBadge from "@/components/requests-to-book/RequestToBookCardBadge";
import { TRAVELER_MARKUP } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatTimeLeft } from "../city/HostRequestCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
  // Calculate the number of nights
  const numNights = getNumNights(requestToBook.checkIn, requestToBook.checkOut);

  // Calculate the price per night the host will receive (removing traveler markup)
  const pricePerNight =
    requestToBook.calculatedTravelerPrice / TRAVELER_MARKUP / numNights;

  // Calculate the total price the host will receive
  const totalHostPrice = pricePerNight * numNights;

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
        <div className="flex-1 space-y-3 overflow-hidden p-4 pt-2">
          <div className="flex items-center gap-2">
            <UserAvatar
              size="sm"
              name={requestToBook.madeByGroup.owner.name}
              image={requestToBook.madeByGroup.owner.image}
            />
            <TravelerVerificationsDialog request={requestToBook} />
            <p>&middot;</p>
            <p className="text-xs">
              {formatDistanceToNowStrict(requestToBook.createdAt, {
                addSuffix: true,
              })}
            </p>
            <p>&middot;</p>

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
          <div className="">
            <div>
              <p className="font-semibold text-primary md:text-base">
                {requestToBook.property.city}
              </p>
              <p className="text-sm text-primary md:text-base">
                {requestToBook.property.name}
              </p>
            </div>
            <p>
              Requested:{" "}
              <span className="font-semibold">
                {formatCurrency(totalHostPrice)}
              </span>
            </p>
            <Dialog>
              <DialogTrigger className="text-sm underline">
                See payment breakdown
              </DialogTrigger>
              <DialogContent className="w-full max-w-md sm:max-w-lg">
                <div className="flex flex-col gap-y-4 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between border-b pb-2">
                    <p className="font-semibold">Payment Breakdown</p>
                  </div>
                  <div className="flex flex-col justify-between sm:flex-row">
                    <span>
                      {fmtdPrice} x {numNights} nights
                    </span>
                    <span className="text-right">
                      {formatCurrency(totalHostPrice)}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between border-t pt-2 text-lg font-semibold sm:flex-row">
                    <span>Total You&apos;ll Receive (USD)</span>
                    <span className="text-right">
                      {formatCurrency(totalHostPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Note: This is the amount you&apos;ll receive after
                    Tramona&apos;s fee. Future versions will include cleaning
                    fee deductions.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <div className="my-2 flex flex-col items-start gap-3 text-black sm:flex-row sm:items-center">
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
              >
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{fmtdDateRange}</span>
              </Badge>
              <Separator
                orientation="vertical"
                className="hidden h-4 md:block"
              />
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
              >
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span>{fmtdNumGuests}</span>
              </Badge>
            </div>
            {formatTimeLeft(requestToBook.createdAt) !== "Expired" && (
              <div className="my-1 flex flex-row items-center gap-x-1 text-xs">
                <ClockIcon className="size-3" />
                Quick response recommended - Time remaining:{" "}
                {formatTimeLeft(requestToBook.createdAt)}
              </div>
            )}
          </div>
          <CardFooter className="empty:hidden">{children}</CardFooter>
        </div>
      </div>
    </Card>
  );
}
