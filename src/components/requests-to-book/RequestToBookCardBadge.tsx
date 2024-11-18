import { formatInterval } from "@/utils/utils";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { RouterOutputs } from "@/utils/api";

export type HostDashboardRequestToBook =
  RouterOutputs["requestsToBook"]["getHostRequestsToBookFromId"][
    | "activeRequestsToBook"
    | "inactiveRequestsToBook"][number];

export type GuestDashboardRequestToBook =
  RouterOutputs["requestsToBook"]["getMyRequestsToBook"][
    | "activeRequestsToBook"
    | "inactiveRequestsToBook"][number];

const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

export default function RequestToBookCardBadge({
  requestToBook,
  size = "md",
}: {
  requestToBook: GuestDashboardRequestToBook | HostDashboardRequestToBook;
  size?: "md" | "lg";
}) {
  if (
    requestToBook.status === "Pending" &&
    requestToBook.resolvedAt === null &&
    requestToBook.createdAt > twentyFourHoursAgo
  ) {
    const msAgo = Date.now() - requestToBook.createdAt.getTime();
    const showTimeAgo = msAgo > 1000 * 60 * 60;
    const fmtdTimeAgo = showTimeAgo ? `(${formatInterval(msAgo)})` : "";
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge size={size} variant="yellow">
            Pending {fmtdTimeAgo}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>Pending host response.</TooltipContent>
      </Tooltip>
    );
  } else if (
    requestToBook.createdAt < twentyFourHoursAgo &&
    requestToBook.status === "Pending" &&
    requestToBook.resolvedAt === null
  ) {
    // if status is not  updated to expired yet(Fallback for cronjob) but is past 24 hours
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge size={size} variant="yellow">
            Expired
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          The host has not responded within 24 hours. This request is now
          expired
        </TooltipContent>
      </Tooltip>
    );
  } else if (
    requestToBook.status !== "Accepted" &&
    requestToBook.resolvedAt !== null
  ) {
    return (
      <Badge size={size} variant="red">
        {requestToBook.status}
      </Badge>
    );
  } else if (
    requestToBook.status === "Accepted" &&
    requestToBook.resolvedAt !== null
  ) {
    return (
      <Badge size={size} variant="blue">
        Booked
      </Badge>
    );
  }
}
