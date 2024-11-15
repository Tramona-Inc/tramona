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

export default function RequestToBookCardBadge({
  requestToBook,
  size = "md",
}: {
  requestToBook: GuestDashboardRequestToBook;
  size?: "md" | "lg";
}) {
  if (requestToBook.status === "Pending" && requestToBook.resolvedAt === null) {
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
