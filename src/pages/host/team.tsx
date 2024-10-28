import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
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
import { Pencil, X, SendHorizonal, Ellipsis } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession({ required: true });
  const { data: hostProfile } = api.users.getMyHostProfile.useQuery();
  const { data: hostTeams } = api.hostTeams.getMyHostTeams.useQuery();
  const { data: curTeamMembers, refetch: refetchMembers } =
    api.hostTeams.getCurTeamMembers.useQuery();
  const { data: pendingInvites, refetch: refetchInvites } =
    api.hostTeams.getCurTeamPendingInvites.useQuery();

  const curTeam =
    hostProfile && hostTeams?.find((t) => t.id === hostProfile.curTeamId);

  const resendInviteMutation = api.hostTeams.resendInvite.useMutation();
  const cancelInviteMutation = api.hostTeams.cancelInvite.useMutation();
  const removeTeamMemberMutation =
    api.hostTeams.removeHostTeamMember.useMutation();

  const handleResendInvite = async (email: string) => {
    const res = await resendInviteMutation.mutateAsync({
      email,
      hostTeamId: curTeam!.id,
    });
    switch (res.status) {
      case "invite resent":
        toast({
          title: `Emailed an invite to ${email}`,
          description: "The invite will expire in 24 hours",
        });
        break;

      case "cooldown":
        toast({
          title: `Invite failed`,
          description: "Please wait a few minutes before resending the invite",
          variant: "destructive",
        });
        break;
    }
    await refetchInvites();
  };

  const handleCancelInvite = async (email: string) => {
    const res = await cancelInviteMutation.mutateAsync({
      email,
      hostTeamId: curTeam!.id,
    });
    switch (res.status) {
      case "invite canceled":
        toast({
          title: "Invite canceled",
          description: `Canceled invite to ${email}`,
        });
        break;
    }
    await refetchInvites();
  };

  const handleRemoveMember = async (userId: string) => {
    await removeTeamMemberMutation.mutateAsync({
      memberId: userId,
      hostTeamId: curTeam!.id,
    });
    await refetchMembers();
  };

  if (!session) return null;

  return (
    <HostDashboardLayout>
      <Head>
        <title>Team | Tramona</title>
      </Head>
      <div className="px-4 pb-32 pt-16">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">Manage team</h1>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-transparent"
            >
              {isEditing ? (
                <X className="text-primaryGreen" />
              ) : (
                <Pencil className="text-primaryGreen" />
              )}
            </Button>
          </div>
          {curTeam ? (
            <HostTeamInviteForm
              hostTeamId={curTeam.id}
              setIsEditing={setIsEditing}
            />
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
                  isEditing={isEditing}
                  onResend={() => handleResendInvite(invite.inviteeEmail)}
                  onCancel={() => handleCancelInvite(invite.inviteeEmail)}
                />
              ))
            : null}
        </div>
      </div>
    </HostDashboardLayout>
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
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-transparent">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="center">
            <DropdownMenuItem>Change role</DropdownMenuItem>
            <DropdownMenuItem red onClick={() => setShowRemoveConfirmation(true)}>
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AlertDialog
        open={showRemoveConfirmation}
        onOpenChange={setShowRemoveConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to remove this member?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRemoveConfirmation(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onRemove}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PendingInvite({
  email,
  isEditing,
  onResend,
  onCancel,
}: {
  email: string;
  isEditing: boolean;
  onResend: () => void;
  onCancel: () => void;
}) {
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  return (
    <div className="flex items-center gap-4 py-2">
      <UserAvatar name={email} email={email} />
      <div className="flex-1 -space-y-1 font-medium">
        <div>{email}</div>
      </div>
      {!isEditing && (
        <Badge variant="secondary" size="sm">
          Pending
        </Badge>
      )}
      {isEditing && (
        <div className="space-x-2">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResend}
                className="hover:bg-transparent"
              >
                <SendHorizonal className="text-primaryGreen" />
              </Button>
            </TooltipTrigger>

            <TooltipContent className="" side="bottom">
              Resend invite
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCancelConfirmation(true)}
                className="hover:bg-transparent"
              >
                <X className="text-primaryGreen" />
              </Button>
            </TooltipTrigger>

            <TooltipContent className="" side="bottom">
              Cancel invite
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <AlertDialog
        open={showCancelConfirmation}
        onOpenChange={setShowCancelConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invite</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to cancel the team invite to ${email}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelConfirmation(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onCancel}>
              Cancel Invite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
