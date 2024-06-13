import { getRequestStatus } from "@/utils/formatters";
import { plural } from "@/utils/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon, UserPlusIcon } from "lucide-react";
import { type DetailedRequest } from "./RequestCard";
import GroupDetailsDialog from "./group-details-dialog/GroupDetailsDialog";
import { useSession } from "next-auth/react";
import { getRequestWithGroupDetails } from "./RequestGroupAvatars";
import RequestRefreshDialog from "./RequestRefreshDialog";

export function RequestCardAction({ request }: { request: DetailedRequest }) {
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
            <Button className="rounded-md">
              <UserPlusIcon />
              Invite people
            </Button>
          </GroupDetailsDialog>
        )
      );
    case "accepted":
      return (
        <Button asChild className="rounded-full pr-3">
          <Link href={`/requests/${request.id}`}>
            View {plural(request.numOffers, "offer")}
            <ArrowRightIcon />
          </Link>
        </Button>
      );
    case "rejected":
      return null;
    case "booked":
      // return <Button className={primaryBtn}>Request again</Button>;
      return null;
  }
}
