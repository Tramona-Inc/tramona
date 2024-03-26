import { getRequestStatus } from "@/utils/formatters";
import { plural } from "@/utils/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon, UserPlusIcon } from "lucide-react";
import { type DetailedRequest } from "./RequestCard";
import GroupDetailsDialog from "./group-details-dialog/GroupDetailsDialog";
import { useSession } from "next-auth/react";
import { RequestUnconfirmedButton } from "./RequestUnconfirmedButton";

type RequestCardActionProps = {
  request: DetailedRequest;
  isWaiting: boolean;
  onClick: () => void;
};

export function RequestCardAction({
  request,
  isWaiting,
  onClick,
}: RequestCardActionProps) {
  const { data: session } = useSession({ required: true });
  if (!session) return null;

  const isEveryoneInvited = request.groupMembers.length >= request.numGuests;
  const groupOwner = request.groupMembers.find(
    (member) => member.isGroupOwner,
  )!;
  const userIsOwner = groupOwner?.id === session.user.id;

  switch (getRequestStatus(request)) {
    case "pending":
      return (
        !isEveryoneInvited &&
        userIsOwner && (
          <GroupDetailsDialog request={request}>
            <Button className="rounded-full">
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
      // return <Button className={secondaryBtn}>Revise</Button>;
      return null;
    case "booked":
      // return <Button className={primaryBtn}>Request again</Button>;
      return null;
    case "unconfirmed":
      return (
        userIsOwner &&
        session.user.phoneNumber && (
          <RequestUnconfirmedButton
            request={request}
            isWaiting={isWaiting}
            onClick={onClick}
          />
        )
      );
  }
}
