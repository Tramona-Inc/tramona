import UserAvatar from "../_common/UserAvatar";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import GroupDetailsDialog from "./group-details-dialog/GroupDetailsDialog";
import { Button } from "../ui/button";
import { type InferQueryModel } from "@/server/db";

export type RequestWithGroup = InferQueryModel<
  "requests",
  {
    columns: { numGuests: true };
    with: {
      madeByGroup: {
        with: {
          invites: true;
          members: {
            with: {
              user: {
                columns: { name: true; email: true; image: true; id: true };
              };
            };
          };
        };
      };
    };
  }
>;

export function getRequestWithGroupDetails({
  request,
  isAdminDashboard,
  userId,
}: {
  request: RequestWithGroup;
  isAdminDashboard?: boolean;
  userId?: string;
}) {
  const userIsOwner = request.madeByGroup.ownerId === userId;
  const isEveryoneInvited =
    request.madeByGroup.members.length >= request.numGuests;

  return {
    isEveryoneInvited,
    userIsOwner,
    isSingleUser: request.madeByGroup.members.length === 1,
    isInviteDialog: !isAdminDashboard && userIsOwner && !isEveryoneInvited,
  };
}

export default function RequestGroupAvatars({
  request,
  isAdminDashboard = false,
}: {
  request: RequestWithGroup;
  isAdminDashboard?: boolean;
}) {
  const { data: session } = useSession({ required: true });
  if (!session) return null;

  const { userIsOwner, isEveryoneInvited, isSingleUser, isInviteDialog } =
    getRequestWithGroupDetails({
      request,
      isAdminDashboard,
      userId: session.user.id,
    });

  const showPlus = userIsOwner && !isAdminDashboard && !isEveryoneInvited;

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
        tooltipOptions={{ side: "left" }}
      >
        {request.madeByGroup.members.map(({ user }) => (
          <UserAvatar
            key={user.id}
            size="sm"
            name={user.name}
            email={user.email}
            image={user.image}
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
