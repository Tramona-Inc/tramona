import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import Spinner from "@/components/_common/Spinner";
import UserAvatar from "@/components/_common/UserAvatar";
import { HostTeamInviteForm } from "@/components/dashboard/host/HostTeamInviteForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COHOST_ROLES, CoHostRole, type User } from "@/server/db/schema";
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
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { errorToast } from "@/utils/toasts";

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession({ required: true });
  const { data: hostProfile } = api.hosts.getMyHostProfile.useQuery();
  const { data: hostTeams } = api.hostTeams.getMyHostTeams.useQuery();

  const curTeam =
    hostProfile && hostTeams?.find((team) => team.id === hostProfile.curTeamId);

  if (!session || !curTeam) return <Spinner />;

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
          <HostTeamInviteForm
            hostTeamId={curTeam.id}
            setIsEditing={setIsEditing}
          />
          {curTeam.members.map((member) => (
            <TeamMember
              key={member.userId}
              hostTeamId={curTeam.id}
              member={member.user}
              role={member.role}
              isYou={member.userId === session.user.id}
              isOwner={member.userId === curTeam.ownerId}
              isEditing={isEditing}
            />
          ))}
          {curTeam.invites.map((invite) => (
            <PendingInvite
              key={invite.inviteeEmail}
              hostTeamId={curTeam.id}
              email={invite.inviteeEmail}
              isEditing={isEditing}
            />
          ))}
        </div>
      </div>
    </HostDashboardLayout>
  );
}

function TeamMember({
  hostTeamId,
  member,
  role,
  isYou,
  isOwner,
  children,
  isEditing,
}: React.PropsWithChildren<{
  hostTeamId: number;
  member: Pick<User, "name" | "email" | "image" | "id">;
  role: CoHostRole;
  isYou: boolean;
  isOwner: boolean;
  isEditing: boolean;
}>) {
  const removeTeamMember = api.hostTeams.removeHostTeamMember.useMutation();
  const updateRole = api.hostTeams.updateCoHostRole.useMutation();

  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);

  async function handleRemove() {
    await removeTeamMember
      .mutateAsync({ memberId: member.id, hostTeamId })
      .then(() => {
        toast({
          title: "Member removed",
          description: `${member.name} has been removed from the team`,
        });
      })
      .catch(() => errorToast());
  }

  async function handleUpdateRole() {
    await updateRole
      .mutateAsync({ userId: member.id, hostTeamId, role })
      .then(() => {
        toast({
          title: "Role updated",
          description: `${member.name} has been updated to ${role}`,
        });
      })
      .catch(() => errorToast());
  }

  return (
    <div className="flex items-center gap-4 py-2">
      <UserAvatar
        name={member.name}
        email={member.email}
        image={member.image}
      />
      <div className="flex-1 -space-y-1 font-medium">
        <div>
          {member.name ?? member.email}
          {isYou && <span className="text-muted-foreground">(You)</span>}{" "}
          {isOwner && (
            <Badge variant="secondary" size="sm">
              Team owner
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          <p>{member.name ? member.email : ""}</p>
          <p>Role: {role}</p>
        </div>
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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change role</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {COHOST_ROLES.map((role, index) => (
                    <DropdownMenuItem key={index} onClick={handleUpdateRole}>
                      {role}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem
              red
              onClick={() => setShowRemoveConfirmation(true)}
            >
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
              Are you sure you want to remove this member?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRemoveConfirmation(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PendingInvite({
  hostTeamId,
  email,
  isEditing,
}: {
  hostTeamId: number;
  email: string;
  isEditing: boolean;
}) {
  const resendInvite = api.hostTeams.resendInvite.useMutation();
  const cancelInvite = api.hostTeams.cancelInvite.useMutation();

  const handleResendInvite = async () => {
    await resendInvite
      .mutateAsync({ email, hostTeamId })
      .then((res) => {
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
              description:
                "Please wait a few minutes before resending the invite",
              variant: "destructive",
            });
            break;
        }
      })
      .catch(() => errorToast());
  };

  const handleCancelInvite = async () => {
    await cancelInvite
      .mutateAsync({ email, hostTeamId })
      .then(() => {
        toast({
          title: "Invite canceled",
          description: `Canceled invite to ${email}`,
        });
      })
      .catch(() => errorToast());
  };

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
                onClick={handleResendInvite}
                className="hover:bg-transparent"
              >
                <SendHorizonal className="text-primaryGreen" />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">Resend invite</TooltipContent>
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

            <TooltipContent side="bottom">Cancel invite</TooltipContent>
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
              Are you sure you want to cancel the team invite to {email}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelConfirmation(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelInvite}>
              Cancel Invite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
