import UserAvatar from "@/components/_common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HandCoinsIcon,
  LogOutIcon,
  SettingsIcon,
  User2Icon,
} from "lucide-react";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import HostTeamsDropdownItems from "./HostTeamsDropdownItems";
import useSetInitialHostTeamId from "../../CustomHooks/useSetInitialHostTeamId";

import { useState } from "react";
import CreateHostTeamDialog from "./CreateHostTeamDialog";
import { api } from "@/utils/api";

function DropdownTop({ session }: { session: Session }) {
  useSetInitialHostTeamId();
  const title = session.user.name ?? session.user.email;
  const subtitle = session.user.name ? session.user.email : null;

  return (
    <div className="flex items-center gap-2 pb-1 pl-3">
      <UserAvatar {...session.user} />
      <div className="flex-1 -space-y-1">
        <div className="font-medium">
          {title}

          {session.user.role !== "guest" && (
            <Badge
              variant="secondary"
              size="sm"
              className="ml-2 -translate-y-0.5 uppercase"
            >
              {session.user.role}
            </Badge>
          )}
        </div>

        {subtitle && <p className="text-sm text-zinc-600">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function AvatarDropdown({
  session,
  size,
}: {
  session: Session;
  size?: "sm" | "md" | "lg" | "huge";
}) {
  const [chtDialogOpen, setChtDialogOpen] = useState(false);
  const { data: hostProfile } = api.hosts.getMyHostProfile.useQuery();

  // prefetch data for HostTeamsDropdownItems instead of waiting for the dropdown to open
  api.hosts.getMyHostProfile.useQuery();
  api.hostTeams.getMyHostTeams.useQuery();

  return (
    <>
      <CreateHostTeamDialog open={chtDialogOpen} setOpen={setChtDialogOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <UserAvatar
            name={session.user.name}
            email={session.user.email}
            image={session.user.image}
            size={size}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-80 font-medium text-primaryGreen"
        >
          <DropdownTop session={session} />
          <DropdownMenuSeparator />
          {hostProfile && (
            <>
              <HostTeamsDropdownItems setChtDialogOpen={setChtDialogOpen} />
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/account">
              <HandCoinsIcon />
              Refer and earn
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings/personal-information">
              <SettingsIcon />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/profile/view/${session.user.id}`}>
              <User2Icon />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            red
            onClick={() =>
              signOut({ callbackUrl: `${window.location.origin}` })
            }
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
