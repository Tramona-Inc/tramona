import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { TramonaLogo } from "./TramonaLogo";
import NavLink from "@/components/_utils/NavLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarDropdown from "./AvatarDropdown";
import TramonaIcon from "@/components/_icons/TramonaIcon";
import {
  leftHeaderLinks,
  hostCenterHeaderLinks,
  helpMenuItems,
  aboutMenuItems,
} from "@/config/headerNavLinks";
import { MenuIcon } from "lucide-react";
import { SkeletonText } from "@/components/ui/skeleton";
import SubDropdown from "./desktop/SubDropdown";
import MobileHeader from "./mobile/MobileHeader";
import useHostBtn from "./useHostBtn";
import LogInSignUp from "./LoginOrSignup";

export function Header() {
  const { pathname } = useRouter();

  const isHost = pathname.includes("/host") ? true : false;

  return (
    <>
      <div className="text-balance bg-primaryGreen px-4 py-2 text-center text-sm font-medium text-white">
        Hosts, we are expanding fast. Be one of the first 100 hosts in your
        city, and enjoy no fees on your first 5 bookings!{" "}
      </div>
      <div className="lg:hidden">
        <MobileHeader isHost={isHost} />
      </div>
      <div className="container hidden lg:contents">
        <LargeHeader isHost={isHost} />
      </div>
    </>
  );
}

export function HamburgerMenu({
  links,
}: {
  links: {
    name: string;
    href: string;
    icon: React.FC;
  }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center gap-3 px-3 py-1">
          <TramonaIcon />
          <p className="text-xl font-bold text-teal-900">Tramona</p>
        </div>
        <DropdownMenuSeparator />
        {links.map(({ href, name, icon: Icon }) => (
          <Link key={href} href={href}>
            <DropdownMenuItem className="my-2 px-2 py-6 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
              <div className="rounded-full bg-teal-700/10 p-2">
                <Icon />
              </div>
              {name}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LargeHeader({ isHost }: { isHost: boolean }) {
  const { status, data: session } = useSession();

  const hostBtn = useHostBtn();

  const links = isHost ? hostCenterHeaderLinks : leftHeaderLinks;

  return (
    <header className="sticky top-0 z-50 flex h-header-height items-center gap-2 border-b bg-white p-4 lg:pl-8 xl:px-20">
      <TramonaLogo />

      {isHost && <div className="flex-1" />}

      <div className="flex items-center pl-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            href={link.href}
            noChildren={link.href === "/host"}
            render={({ selected }) => (
              <span
                className={cn(
                  "rounded-md px-4 py-3 text-xs font-bold text-zinc-600 hover:text-foreground xl:text-sm",
                  selected && "text-foreground underline underline-offset-2",
                )}
              >
                {link.name}
              </span>
            )}
          />
        ))}
      </div>

      <div className="flex-1" />

      {!isHost && (
        <div className="mx-2 flex flex-row gap-x-6">
          <SubDropdown title="About" menuItems={aboutMenuItems} />
          <SubDropdown title="Help" menuItems={helpMenuItems} />
        </div>
      )}

      {status === "loading" ? null : hostBtn.isLoading ? (
        <div className="px-4">
          <SkeletonText className="w-24" />
        </div>
      ) : (
        <Button
          asChild
          variant="ghost"
          className={cn(hostBtn.href !== "/why-list" && "rounded-full")}
        >
          <Link href={hostBtn.href}>{hostBtn.name}</Link>
        </Button>
      )}

      {status === "unauthenticated" && (
        <>
          <LogInSignUp />
        </>
      )}

      {status === "authenticated" && <AvatarDropdown session={session} />}
    </header>
  );
}
