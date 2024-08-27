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
import { api } from "@/utils/api";
import TramonaIcon from "@/components/_icons/TramonaIcon";
import {
  headerLinks,
  hamburgerLinksDesktop,
  hamburgerLinksMobile,
  unloggedHamburgerLinksMobile,
} from "@/config/headerNavLinks";
import { ArrowLeftRightIcon, DoorOpen, MenuIcon } from "lucide-react";
import { SkeletonText } from "@/components/ui/skeleton";

export function Header() {
  return (
    <>
      <div className="contents lg:hidden">
        <SmallHeader />
      </div>
      <div className="container hidden lg:contents">
        <LargeHeader />
      </div>
    </>
  );
}

function HamburgerMenu({
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

function LargeHeader() {
  const { status, data: session } = useSession();

  const hostBtn = useHostBtn();

  return (
    <header className="sticky top-0 z-50 flex h-header-height items-center gap-2 border-b bg-white p-4 lg:pl-8 xl:px-20">
      <TramonaLogo />

      <div className="flex translate-y-0.5 items-center pl-2">
        {headerLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            render={({ selected }) => (
              <span
                className={cn(
                  "rounded-md px-2 py-3 text-sm font-bold text-zinc-600 hover:text-foreground xl:text-base",
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

      {status === "loading" ? null : hostBtn.isLoading ? (
        <div className="px-4">
          <SkeletonText className="w-24" />
        </div>
      ) : (
        <Button
          asChild
          variant="ghost"
          className={cn(hostBtn.href !== "/for-hosts" && "rounded-full")}
        >
          <Link href={hostBtn.href}>{hostBtn.name}</Link>
        </Button>
      )}

      {status === "unauthenticated" && (
        <>
          <LogInSignUp />
          <HamburgerMenu links={hamburgerLinksDesktop} />
        </>
      )}

      {status === "authenticated" && <AvatarDropdown session={session} />}
    </header>
  );
}

function SmallHeader() {
  const { status, data: session } = useSession();
  const hostBtn = useHostBtn();

  return (
    <header className="sticky top-0 z-50 flex h-header-height items-center gap-2 border-b bg-white px-2 pl-4 text-sm sm:text-base">
      <TramonaLogo />

      <div className="flex-1" />

      {status === "authenticated" && (
        <AvatarDropdown session={session} size="sm" />
      )}

      {status === "unauthenticated" && <LogInSignUp />}

      <HamburgerMenu
        links={[
          ...(hostBtn.isLoading ? [] : [hostBtn]),
          ...(status === "unauthenticated"
            ? unloggedHamburgerLinksMobile
            : hamburgerLinksMobile),
        ]}
      />
    </header>
  );
}

function LogInSignUp() {
  return (
    <>
      <Button asChild variant="secondary">
        <Link href="/auth/signin">Log In</Link>
      </Button>
      <Button asChild variant="greenPrimary">
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </>
  );
}

function useHostBtn() {
  const { data: isHost, isLoading: isHostLoading } =
    api.users.isHost.useQuery();

  const { status: sessionStatus } = useSession();

  const { pathname } = useRouter();

  if (sessionStatus === "loading" || isHostLoading) {
    return { isLoading: true } as const;
  }

  if (sessionStatus === "unauthenticated" || !isHost) {
    return {
      href: "/for-hosts",
      name: "Become a host",
      icon: DoorOpen,
    } as const;
  }

  if (pathname.includes("/host")) {
    return {
      href: "/",
      name: "Switch to Traveler",
      icon: ArrowLeftRightIcon,
    } as const;
  }

  return {
    href: "/host",
    name: "Switch to Host",
    icon: ArrowLeftRightIcon,
  } as const;
}
