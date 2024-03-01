import UserAvatar from "../_common/UserAvatar";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import GroupDetailsDialog from "./group-details-dialog/GroupDetailsDialog";
import { type RequestWithUser, type DetailedRequest } from "./RequestCard";
import { Button } from "../ui/button";

export default function RequestGroupAvatars({
  request,
  isAdminDashboard = false,
}: {
  request: DetailedRequest | RequestWithUser;
  isAdminDashboard?: boolean;
}) {
  const { data: session } = useSession({ required: true });
  if (!session) return null;

  const userIsOwner = request.groupMembers.some(
    (member) => member.id === session.user.id && member.isGroupOwner,
  );

  const isEveryoneInvited = request.groupMembers.length >= request.numGuests;
  const showPlus = userIsOwner && !isAdminDashboard && !isEveryoneInvited;
  const isSingleUser = request.groupMembers.length === 1;
  const isInviteDialog = !isAdminDashboard && userIsOwner && !isEveryoneInvited;

  return (
    <GroupDetailsDialog request={request} isAdminDashboard={isAdminDashboard}>
      <Button
        variant="wrapper"
        className="-space-x-2"
        tooltip={
          isInviteDialog
            ? "Invite people"
            : `View ${isSingleUser ? "user" : "group"} details`
        }
      >
        {request.groupMembers.map((member) => (
          <UserAvatar
            key={member.id}
            size="sm"
            name={member.name}
            email={member.email}
            image={member.image}
          />
        ))}
        {showPlus && (
          <div className="z-10 grid size-8 place-items-center rounded-full bg-zinc-300 text-zinc-700">
            <PlusIcon className="size-6" />
          </div>
        )}
      </Button>
    </GroupDetailsDialog>
  );
}
