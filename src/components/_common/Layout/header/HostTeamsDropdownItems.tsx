import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { type HostTeam, type HostProfile } from "@/server/db/schema";
import { PlusCircleIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import UserAvatar from "../../UserAvatar";

export default function HostTeamsDropdownItems({
  hostProfile,
  hostTeams,
  setChtDialogOpen,
}: {
  hostProfile: HostProfile | undefined;
  hostTeams: HostTeam[] | undefined;
  setChtDialogOpen: (o: boolean) => void;
}) {
  const setCurHostTeam = api.hostTeams.setCurHostTeam.useMutation();

  const curTeam =
    hostProfile && hostTeams?.find((t) => t.id === hostProfile.curTeamId);

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="gap-2 px-1">
          {curTeam ? (
            <>
              <UserAvatar size="sm" name={curTeam.name} />
              {curTeam.name}
            </>
          ) : (
            <SkeletonText />
          )}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuLabel>Your teams</DropdownMenuLabel>
          {hostTeams?.map((team) => (
            <DropdownMenuCheckboxItem
              key={team.id}
              checked={hostProfile?.curTeamId === team.id}
              disabled={setCurHostTeam.isLoading}
              onSelect={() =>
                setCurHostTeam
                  .mutateAsync({ hostTeamId: team.id })
                  .then(({ hostTeamName }) => {
                    toast({ title: `Switched to team: ${hostTeamName}` });
                  })
              }
              className="gap-2 px-1"
            >
              <UserAvatar size="sm" name={team.name} />
              {team.name}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuItem onClick={() => setChtDialogOpen(true)}>
            <PlusCircleIcon />
            Create Team
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
}
