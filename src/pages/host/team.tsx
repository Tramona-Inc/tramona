import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import UserAvatar from "@/components/_common/UserAvatar";
import { HostTeamInviteForm } from "@/components/dashboard/host/HostTeamInviteForm";
import { Badge } from "@/components/ui/badge";
import { type User } from "@/server/db/schema";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Page() {
  const { data: session } = useSession({ required: true });
  const { data: hostProfile } = api.users.getMyHostProfile.useQuery();
  const { data: hostTeams } = api.hostTeams.getMyHostTeams.useQuery();
  const { data: curTeamMembers } = api.hostTeams.getCurTeamMembers.useQuery();

  const curTeam =
    hostProfile && hostTeams?.find((t) => t.id === hostProfile.curTeamId);

  if (!session) return null;

  return (
    <DashboardLayout type="host">
      <Head>
        <title>Team | Tramona</title>
      </Head>
      <div className="px-4 pb-32 pt-16">
        <div className="mx-auto max-w-xl space-y-4">
          <h1 className="text-3xl font-bold">Team</h1>
          {curTeam ? (
            <HostTeamInviteForm hostTeamId={curTeam.id} />
          ) : (
            <Spinner />
          )}
          {curTeamMembers ? (
            curTeamMembers.map((member) => (
              <TeamMember
                key={member.id}
                member={member}
                isYou={member.id === session.user.id}
                isOwner={member.id === curTeam?.ownerId}
              />
            ))
          ) : (
            <Spinner />
          )}
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
}: React.PropsWithChildren<{
  member: Pick<User, "name" | "email" | "image">;
  isYou: boolean;
  isOwner: boolean;
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
          {member.name ?? member.email ?? ""}{" "}
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
    </div>
  );
}
