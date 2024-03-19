import { Button } from "../../ui/button";
import { type RequestWithUser, type DetailedRequest } from "../RequestCard";
import { GroupMember } from "./GroupMember";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function GroupInviteesList({
  request,
  userId,
  isAdminDashboard = false,
}: {
  request: DetailedRequest | RequestWithUser;
  userId?: string;
  isAdminDashboard?: boolean;
}) {
  const userIsOwner =
    userId === request.groupMembers.find((member) => member.isGroupOwner)!.id;

  const groupId = request.madeByGroupId;

  return request.groupInvites.map((invite) => {
    return (
      <Invitee
        key={invite.inviteeEmail}
        groupId={groupId}
        email={invite.inviteeEmail}
        isAdminDashboard={isAdminDashboard}
        userIsOwner={userIsOwner}
      />
    );
  });
}

function Invitee({
  groupId,
  email,
  isAdminDashboard,
  userIsOwner,
}: {
  groupId: number;
  email: string;
  isAdminDashboard: boolean;
  userIsOwner: boolean;
}) {
  const mutation = api.groups.inviteUserByEmail.useMutation({
    onSuccess: () =>
      toast({
        title: "Successfully resent invite",
        description: "It will expire in 24 hours",
      }),
    onError: () => errorToast(),
  });

  return (
    <GroupMember
      key={email}
      member={{ email: email }}
      isOwner={false}
      isYou={false}
      isAdminDashboard={isAdminDashboard}
      isSingleUser={false}
    >
      {!isAdminDashboard && userIsOwner && (
        <Button
          variant="ghost"
          disabled={mutation.isLoading}
          onClick={() => mutation.mutate({ email, groupId })}
        >
          Resend invite
        </Button>
      )}
    </GroupMember>
  );
}
