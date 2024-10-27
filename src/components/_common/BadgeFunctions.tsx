import { Badge } from "../ui/badge";
import { ALL_TRAVELER_CLAIM_RESPONSES } from "../../server/db/schema/common";

// Update to receive props properly
interface GetBadgeByClaimStatusProps {
  claimStatus: "Submitted" | "In Review" | "Resolved" | null | undefined;
}

export const GetBadgeByClaimStatus = ({
  claimStatus,
}: GetBadgeByClaimStatusProps) => {
  switch (claimStatus) {
    case "Submitted":
      return <Badge variant="gray">{claimStatus}</Badge>;

    case "In Review":
      return <Badge variant="yellow">{claimStatus}</Badge>;

    case "Resolved":
      return <Badge variant="green">{claimStatus}</Badge>;

    default:
      return <Badge variant="skeleton">{claimStatus}</Badge>; // Fallback for any unexpected values
  }
};

// ----------- For INDIVDUAL CLAIM ITEMS using its own data as reference (used to notify travelers whether action is required or not) -------
interface GetBadgeByClaimItemStatusProps {
  travelerClaimResponse:
    | (typeof ALL_TRAVELER_CLAIM_RESPONSES)[number]
    | undefined;
}

export const GetBadgeByClaimItemStatus = ({
  travelerClaimResponse,
}: GetBadgeByClaimItemStatusProps) => {
  if (travelerClaimResponse !== "Pending") {
    return <Badge variant="green">Submitted</Badge>;
  } else {
    return <Badge variant="yellow">Action Required</Badge>;
  }
};

// ------ FOR INDIVDUAL CLAIM ITEMS BUT USING THE CLAIM AS REFERENCE ------
interface GetBadgeByClaimStatusForClaimItemProps {
  isResolvedAt: Date | string | null | undefined;
}

export const GetBadgeByClaimStatusForClaimItem = ({
  isResolvedAt,
}: GetBadgeByClaimStatusForClaimItemProps) => {
  if (isResolvedAt) {
    return <Badge variant="green">Resolved</Badge>;
  } else if (isResolvedAt === null) {
    return <Badge variant="gray">Action Required</Badge>;
  } else {
    return <Badge variant="skeleton">Loading</Badge>; // Fallback for any unexpected values
  }
};

// Traveler claim Response Badge (using this for admins side)
interface GetTravelerClaimResponseBadgeProps {
  travelerClaimResponse: (typeof ALL_TRAVELER_CLAIM_RESPONSES)[number];
}

export const GetTravelerClaimResponseBadge = ({
  travelerClaimResponse,
}: GetTravelerClaimResponseBadgeProps) => {
  switch (travelerClaimResponse) {
    case "Accepted":
      return <Badge variant="green">Traveler Accepted</Badge>;
    case "Rejected":
      return <Badge variant="red">Traveler Rejected</Badge>;
    case "Partially Approved":
      return <Badge variant="yellow">Partially Approved</Badge>;
    case "Pending":
      return <Badge variant="gray">No Response yet</Badge>;
  }
};
