import { getRequestStatus } from "@/utils/formatters";
import { formatInterval, plural } from "@/utils/utils";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function RequestToBookCardBadge({
  requestToBook,
  size = "md",
}: {
  requestToBook: {
    createdAt: Date;
    resolvedAt: Date | null;
    isAccepted: boolean;
  };
  size?: "md" | "lg";
}) {
  console.log(
    "isAccepted",
    requestToBook.isAccepted,
    "resolvedAt",
    requestToBook.resolvedAt,
  );
  if (!requestToBook.isAccepted && requestToBook.resolvedAt === null) {
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
  } else if (!requestToBook.isAccepted && requestToBook.resolvedAt !== null) {
    return (
      <Badge size={size} variant="red">
        Rejected
      </Badge>
    );
  } else if (requestToBook.isAccepted && requestToBook.resolvedAt !== null) {
    return (
      <Badge size={size} variant="blue">
        Booked
      </Badge>
    );
  }
}
