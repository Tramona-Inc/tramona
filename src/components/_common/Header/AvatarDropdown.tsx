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
  LogOutIcon,
  User2Icon,
  UserCheck2Icon,
  UserCheckIcon,
} from "lucide-react";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import HostTeamsDropdownItems from "./HostTeamsDropdownItems";
import { api } from "@/utils/api";
import { useState } from "react";
import CreateHostTeamDialog from "./CreateHostTeamDialog";
import { usePathname } from "next/navigation";
function DropdownTop({ session }: { session: Session }) {
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

export default function AvatarDropdown({ session }: { session: Session }) {
  const { data: hostProfile } = api.users.getMyHostProfile.useQuery();
  const { data: hostTeams } = api.hostTeams.getMyHostTeams.useQuery();
  const pathname = usePathname();
  const [chtDialogOpen, setChtDialogOpen] = useState(false);

  return (
    <>
      <CreateHostTeamDialog open={chtDialogOpen} setOpen={setChtDialogOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <UserAvatar
            name={session.user.name}
            email={session.user.email}
            image={session.user.image}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 py-4 font-medium">
          <DropdownTop session={session} />
          <DropdownMenuSeparator />
          {session.user.role === "admin" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <UserCheckIcon />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {hostProfile && (
            <>
              <HostTeamsDropdownItems
                hostProfile={hostProfile}
                hostTeams={hostTeams}
                setChtDialogOpen={setChtDialogOpen}
              />
              <DropdownMenuItem asChild>
                <Link href="/host">
                  <UserCheck2Icon />
                  Host Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {session.user.role === "guest" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/host-onboarding">
                  <UserCheck2Icon />
                  Become a Host
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User2Icon />
              Profile
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild>
     <Link href="/">
       <ExternalLinkIcon />
       Tramona Homepage
     </Link>
   </DropdownMenuItem> */}
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
