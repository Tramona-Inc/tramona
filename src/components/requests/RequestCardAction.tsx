import { getRequestStatus } from "@/utils/formatters";
import { Button } from "../ui/button";
import { UserPlusIcon } from "lucide-react";
import { type GuestDashboardRequest } from "./RequestCard";
import GroupDetailsDialog from "./group-details-dialog/GroupDetailsDialog";
import { useSession } from "next-auth/react";
import { getRequestWithGroupDetails } from "./RequestGroupAvatars";

export function RequestCardAction({
  request,
}: {
  request: GuestDashboardRequest;
}) {
  const { data: session } = useSession({ required: true });
  if (!session) return null;

  const { isEveryoneInvited, userIsOwner } = getRequestWithGroupDetails({
    request,
    userId: session.user.id,
  });

  switch (getRequestStatus(request)) {
    case "pending":
      return (
        !isEveryoneInvited &&
        userIsOwner && (
          <GroupDetailsDialog request={request}>
            <Button>
              <UserPlusIcon />
              Invite people
            </Button>
          </GroupDetailsDialog>
        )
      );
    case "accepted":
      return null;
    case "rejected":
      return null;
    case "booked":
      // return <Button className={primaryBtn}>Request again</Button>;
      return null;
  }
}
