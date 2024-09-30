import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import UserAvatar from "@/components/_common/UserAvatar";
import { HostTeamInviteForm } from "@/components/dashboard/host/HostTeamInviteForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type User } from "@/server/db/schema";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { Pencil, X, SendHorizonal } from "lucide-react";

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession({ required: true });
  const { data: hostProfile } = api.users.getMyHostProfile.useQuery();
  const { data: hostTeams } = api.hostTeams.getMyHostTeams.useQuery();
  const { data: curTeamMembers, refetch: refetchMembers } = api.hostTeams.getCurTeamMembers.useQuery();
  const { data: pendingInvites, refetch: refetchInvites } =
    api.hostTeams.getCurTeamPendingInvites.useQuery();

  const curTeam =
    hostProfile && hostTeams?.find((t) => t.id === hostProfile.curTeamId);

  const resendInviteMutation = api.hostTeams.resendInvite.useMutation();
  const cancelInviteMutation = api.hostTeams.cancelInvite.useMutation();
  const removeTeamMemberMutation =
    api.hostTeams.removeHostTeamMember.useMutation();

  const handleResendInvite = async (email: string) => {
    await resendInviteMutation.mutateAsync({ email, hostTeamId: curTeam!.id });
    refetchInvites();
  };

  const handleCancelInvite = async (email: string) => {
    await cancelInviteMutation.mutateAsync({ email, hostTeamId: curTeam!.id });
    refetchInvites();
  };

  const handleRemoveMember = async (userId: string) => {
    await removeTeamMemberMutation.mutateAsync({
      memberId: userId,
      hostTeamId: curTeam!.id,
    });
    refetchMembers();
  };

  if (!session) return null;

  return (
    <DashboardLayout>
      <Head>
        <title>Team | Tramona</title>
      </Head>
      <div className="px-4 pb-32 pt-16">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">Manage team</h1>
            <Button onClick={() => setIsEditing(!isEditing)} className="bg-transparent">
              {isEditing ? <X className="text-primaryGreen"/> : <Pencil className="text-primaryGreen"/>}
            </Button>
          </div>
          {curTeam ? (
            <HostTeamInviteForm hostTeamId={curTeam.id} setIsEditing={setIsEditing}/>
          ) : (
            <Spinner />
          )}
          {curTeamMembers
            ? curTeamMembers.map((member) => (
                <TeamMember
                  key={member.id}
                  member={member}
                  isYou={member.id === session.user.id}
                  isOwner={member.id === curTeam?.ownerId}
                  isEditing={isEditing}
                  onRemove={() => handleRemoveMember(member.id)}
                />
              ))
            : null}
          {pendingInvites
            ? pendingInvites.map((invite) => (
                <PendingInvite
                  key={invite.inviteeEmail}
                  email={invite.inviteeEmail}
                  // createdAt={invite.createdAt}
                  isEditing={isEditing}
                  onResend={() => handleResendInvite(invite.inviteeEmail)}
                  onCancel={() => handleCancelInvite(invite.inviteeEmail)}
                />
              ))
            : null}
        </div>
      </div>
    </DashboardLayout>
  );
}

function TeamMember({
  member,
  isYou,
  isOwner,
  children,
  isEditing,
  onRemove,
}: React.PropsWithChildren<{
  member: Pick<User, "name" | "email" | "image">;
  isYou: boolean;
  isOwner: boolean;
  isEditing: boolean;
  onRemove: () => void;
}>) {
  return (
    <div className="flex items-center gap-4 py-2">
      <UserAvatar
        name={member.name}
        email={member.email}
        image={member.image}
      />
      <div className="flex-1 -space-y-1 font-medium">
        <div>
          {member.name ?? member.email}{" "}
          {isYou && <span className="text-muted-foreground">(You)</span>}{" "}
          {isOwner && (
            <Badge variant="secondary" size="sm">
              Team owner
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {member.name ? member.email : ""}
        </p>
      </div>
      {children}
      {isEditing && !isYou && !isOwner && (
        <Button variant="destructive" size="sm" onClick={onRemove}>
          Remove
        </Button>
      )}
    </div>
  );
}

function PendingInvite({
  email,
  // createdAt,
  isEditing,
  onResend,
  onCancel,
}: {
  email: string;
  // createdAt: Date;
  isEditing: boolean;
  onResend: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-4 py-2">
      <UserAvatar name={email} email={email} />
      <div className="flex-1 -space-y-1 font-medium">
        <div>{email}</div>
        <p className="text-sm text-muted-foreground">
          {/* Invited on {createdAt.toLocaleDateString()} */}
        </p>
      </div>
      {!isEditing && (
        <Badge variant="secondary" size="sm">
          Pending
        </Badge>
      )}
      {isEditing && (
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={onResend} className="hover:bg-transparent">
            <SendHorizonal className="text-primaryGreen"/>
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-transparent">
            <X className="text-primaryGreen"/>
          </Button>
        </div>
      )}
    </div>
  );
}