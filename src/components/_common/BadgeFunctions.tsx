import { Badge } from "../ui/badge";

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
