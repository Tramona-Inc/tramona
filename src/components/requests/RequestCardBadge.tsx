import { getRequestStatus } from "@/utils/formatters";
import { formatInterval, plural } from "@/utils/utils";
import { Badge } from "../ui/badge";

export default function RequestCardBadge({
  request,
  size = "md",
}: {
  request: {
    createdAt: Date;
    resolvedAt: Date | null;
    numOffers: number;
  };
  size?: "md" | "lg";
}) {
  switch (getRequestStatus(request)) {
    case "pending":
      const msAgo = Date.now() - request.createdAt.getTime();
      const showTimeAgo = msAgo > 1000 * 60 * 60;
      const fmtdTimeAgo = showTimeAgo ? `(${formatInterval(msAgo)})` : "";
      return (
        <Badge size={size} variant="yellow">
          Pending {fmtdTimeAgo}
        </Badge>
      );
    case "accepted":
      return (
        <Badge size={size} variant="green">
          {plural(request.numOffers, "offer")}
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
