import { getRequestStatus } from "@/utils/formatters";
import { formatInterval, plural } from "@/utils/utils";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { REQUEST_STATUS } from "../../server/db/schema/tables/requests";

export default function RequestCardBadge({
  request,
  size = "md",
}: {
  request: {
    createdAt: Date;
    resolvedAt: Date | null;
    offers: unknown[];
    status: (typeof REQUEST_STATUS)[number];
  };
  size?: "md" | "lg";
}) {
  if (request.status === "Withdrawn")
    return (
      <Badge size={size} variant="red">
        Withdrawn
      </Badge>
    );
  switch (getRequestStatus(request)) {
    case "pending":
      const msAgo = Date.now() - request.createdAt.getTime();
      const showTimeAgo = msAgo > 1000 * 60 * 60;
      const fmtdTimeAgo = showTimeAgo ? `(${formatInterval(msAgo)})` : "";
      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge size={size} variant="yellow">
              Pending {fmtdTimeAgo}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            An offer is being found for your request.
          </TooltipContent>
        </Tooltip>
      );
    case "accepted":
      return (
        <Badge size={size} variant="green">
          {plural(request.offers.length, "offer")}
        </Badge>
      );
    case "rejected":
      return (
        <Badge size={size} variant="red">
          Rejected
        </Badge>
      );
    case "booked":
      return (
        <Badge size={size} variant="blue">
          Booked
        </Badge>
      );
  }
}
