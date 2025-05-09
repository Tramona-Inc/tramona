import { formatDistanceToNowStrict } from "date-fns";
import { type RouterOutputs } from "@/utils/api";
import UserAvatar from "@/components/_common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { TravelerVerificationsDialog } from "@/components/requests/TravelerVerificationsDialog";
import { Card, CardFooter } from "@/components/ui/card";
import { formatCurrency, formatDateRange, plural } from "@/utils/utils";
import {
  CalendarIcon,
  EllipsisIcon,
  UsersIcon,
  Share2Icon,
  ClockIcon,
} from "lucide-react";
import {
  requestAmountToBaseOfferedAmount,
  baseAmountToHostPayout,
} from "@/utils/payment-utils/paymentBreakdown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useChatWithUserForRequest } from "@/utils/messaging/useChatWithUserForRequest";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { differenceInHours, differenceInMinutes } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function formatTimeLeft(createdAt: Date) {
  // Add 24 hours to creation date to get expiration
  const expirationTime = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();

  const hoursLeft = differenceInHours(expirationTime, now);

  if (hoursLeft <= 0) {
    const minutesLeft = differenceInMinutes(expirationTime, now);
    if (minutesLeft <= 0) {
      return "Expired";
    }
    return `${minutesLeft} ${minutesLeft === 1 ? "minute" : "minutes"} left`;
  }

  return `${hoursLeft} ${hoursLeft === 1 ? "hour" : "hours"} left`;
}

export type NormalHostDashboardRequest =
  RouterOutputs["properties"]["getHostPropertiesWithRequests"]["normal"][number]["requests"][number]["request"];

export type HostDashboardPropertyRequest =
  RouterOutputs["properties"]["getHostPropertiesWithRequests"]["normal"][number]["requests"][number]["properties"][number];

export default function HostRequestCard({
  currentHostTeamId,
  request,
  children,
}: {
  request: NormalHostDashboardRequest;
  currentHostTeamId: number | null | undefined;
  children?: React.ReactNode;
}) {
  const hostPayoutAmount = baseAmountToHostPayout(request.maxTotalPrice);
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const chatWithUserForRequest = useChatWithUserForRequest();
  const { mutateAsync: rejectRequest } =
    api.requests.rejectRequest.useMutation();

  const { data: code } = api.referralCodes.getMyReferralCodeData.useQuery();

  const copyToClipboard = () => {
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
      ? "https://www.tramona.com"
      : "http://localhost:3000";
    void navigator.clipboard.writeText(
      `${baseUrl}/request-preview/${request.id}?referrer=${code?.referralCode}`,
    );
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 2000);
  };

  return (
    <Card className="flex-1 space-y-3 p-4 pt-2">
      <div className="flex w-full flex-row justify-between">
        <div className="flex items-center gap-2">
          <UserAvatar
            size="sm"
            name={request.traveler.name}
            image={request.traveler.image}
          />
          <TravelerVerificationsDialog request={request} />
          <p>·</p>
          <p className="text-xs">
            {formatDistanceToNowStrict(request.createdAt, {
              addSuffix: true,
            })}
          </p>
          {/* <p>·</p> */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-p-2 rounded-full"
                onClick={copyToClipboard}
              >
                <Share2Icon className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-black p-0">
              <div className="px-3 py-2 text-sm font-medium text-white">
                Link copied!
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                void chatWithUserForRequest(request.traveler.id, request.id);
              }}
            >
              Message User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                if (!currentHostTeamId) {
                  toast({
                    title: "Error",
                    description:
                      "Could not reject request. Host team ID is missing.",
                    variant: "destructive",
                  });
                  return;
                }
                await rejectRequest({
                  requestId: request.id,
                  currentHostTeamId: Number(currentHostTeamId), // Ensure currentHostTeamId is a Number here as well
                })
                  .then(() => {
                    toast({
                      title: "Successfully rejected request",
                    });
                  })
                  .catch((error) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (error.data?.code === "FORBIDDEN") {
                      toast({
                        title: "You do not have permission to create an offer.",
                        description:
                          "Please contact your team owner to request access.",
                      });
                    } else {
                      errorToast();
                    }
                  });
              }}
            >
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="">
        <div>
          <span className="font-semibold text-black">{request.location}</span>
          <p className="mt-1 text-sm">
            Your payout after fees:{" "}
            <span className="font-semibold text-black underline underline-offset-2">
              {formatCurrency(hostPayoutAmount)}
            </span>
          </p>
          <div className="my-4 flex flex-col items-start gap-3 text-black sm:flex-row sm:items-center">
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-3 py-1"
            >
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{fmtdDateRange}</span>
            </Badge>
            <Separator orientation="vertical" className="hidden h-4 md:block" />
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-3 py-1"
            >
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <span>{fmtdNumGuests}</span>
            </Badge>
          </div>
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
            <p>{request.note}</p>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center gap-x-1 text-xs">
        <ClockIcon className="size-3" />
        Quick response recommended - Time remaining:{" "}
        {formatTimeLeft(request.createdAt)}
      </div>

      {children && <CardFooter>{children}</CardFooter>}
    </Card>
  );
}
