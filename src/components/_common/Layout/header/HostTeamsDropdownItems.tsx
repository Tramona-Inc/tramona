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
import { PlusCircleIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import UserAvatar from "../../UserAvatar";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";

export default function HostTeamsDropdownItems({
  setChtDialogOpen,
}: {
  setChtDialogOpen: (o: boolean) => void;
}) {
  const { currentHostTeamId, setCurrentHostTeam } = useHostTeamStore();
  const { data: hostProfile } = api.hosts.getMyHostProfile.useQuery();
  const { data: hostTeams } = api.hostTeams.getMyHostTeams.useQuery();

  const curTeam =
    hostProfile && hostTeams?.find((t) => t.id === currentHostTeamId);

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="gap-2 px-1">
          {curTeam ? (
            <>
              <UserAvatar size="sm" name={curTeam.name} />
              <p className="truncate">{curTeam.name}</p>
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
              checked={currentHostTeamId === team.id}
              onSelect={() => {
                setCurrentHostTeam(team.id);
                toast({
                  title: `Switched to team: ${team.name}`,
                  description: `You are now managing the team "${team.name}".`,
                });
              }}
              className="gap-2 px-1"
            >
              <UserAvatar size="sm" name={team.name} />
              {team.name}
            </DropdownMenuCheckboxItem>
          ))}
          {/* <DropdownMenuItem onClick={() => setChtDialogOpen(true)}>
            <PlusCircleIcon />
            Create Team
          </DropdownMenuItem> */}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
}
