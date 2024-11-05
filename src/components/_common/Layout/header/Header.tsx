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
  unloggedHamburgerLinksMobile,
  unloggedCenterHeaderLinks,
  unloggedHamburgerLinksDesktop,
  loggedCenterHeaderLinks,
  loggedHamburgerLinksMobile,
  hostCenterHeaderLinks,
} from "@/config/headerNavLinks";
import {
  ArrowLeftRightIcon,
  ChevronDown,
  DoorOpen,
  MenuIcon,
} from "lucide-react";
import { SkeletonText } from "@/components/ui/skeleton";

export function Header() {
  const { pathname } = useRouter();

  const isHost = pathname.includes("/host") ? true : false;

  return (
    <>
      <div className="text-balance bg-primaryGreen px-4 py-2 text-center text-sm font-medium text-white">
        Welcome to the Tramona, the best deals on Airbnbs anywhere. Enjoy 15%
        off all stays during our launch!
      </div>
      <div className="contents lg:hidden">
        <SmallHeader isHost={isHost} />
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

  const links = isHost ? hostCenterHeaderLinks : headerLinks;

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
        <div className="flex items-center">
          {status === "authenticated"
            ? loggedCenterHeaderLinks.map((link) => (
                <NavLink
                  href={link.href}
                  key={link.href}
                  render={({ selected }) => (
                    <span
                      className={cn(
                        "rounded-md px-2 py-3 text-xs font-bold text-zinc-600 hover:text-foreground xl:text-sm",
                        selected &&
                          "text-foreground underline underline-offset-2",
                      )}
                    >
                      {link.name}
                    </span>
                  )}
                />
              ))
            : unloggedCenterHeaderLinks.map((link) => (
                <NavLink
                  href={link.href}
                  key={link.href}
                  render={({ selected }) => (
                    <span
                      className={cn(
                        "rounded-md px-2 py-3 text-xs font-bold text-zinc-600 hover:text-foreground xl:text-sm",
                        selected &&
                          "text-foreground underline underline-offset-2",
                      )}
                    >
                      {link.name}
                    </span>
                  )}
                />
              ))}
        </div>
      )}

      <div className="flex-1" />

      {status === "authenticated" && !isHost && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center">
            <p className="text-xs font-bold text-zinc-600 hover:text-foreground xl:text-sm">
              Help
            </p>
            <ChevronDown size={15} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href="/faq">
              <DropdownMenuItem>24/7 Support</DropdownMenuItem>
            </Link>
            <Link href="/help-center">
              <DropdownMenuItem>100% Re booking guarantee</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

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
          <HamburgerMenu links={unloggedHamburgerLinksDesktop} />
        </>
      )}

      {status === "authenticated" && <AvatarDropdown session={session} />}
    </header>
  );
}

function SmallHeader({ isHost }: { isHost: boolean }) {
  const { status, data: session } = useSession();
  const hostBtn = useHostBtn();

  return (
    <header className="sticky top-0 z-50 flex h-header-height items-center gap-2 border-b bg-white px-2 pl-4 text-sm sm:text-base">
      <TramonaLogo />
      <div className="flex translate-y-0.5 items-center pl-2"></div>

      <div className="flex-1" />

      {status === "loading" ? null : hostBtn.isLoading ? (
        <div className="px-4">
          <SkeletonText className="w-24" />
        </div>
      ) : (
        <Button
          asChild
          size="sm"
          variant="ghost"
          className={cn(
            hostBtn.href !== "/for-hosts" && "rounded-full px-2 tracking-tight",
          )}
        >
          <Link href={hostBtn.href}>{hostBtn.name}</Link>
        </Button>
      )}

      {status === "authenticated" && (
        <AvatarDropdown session={session} size="sm" />
      )}

      {status === "unauthenticated" && <LogInSignUp />}

      {!isHost && (
        <HamburgerMenu
          links={[
            // ...(hostBtn.isLoading ? [] : [hostBtn]),
            ...(status === "unauthenticated"
              ? unloggedHamburgerLinksMobile
              : loggedHamburgerLinksMobile),
          ]}
        />
      )}
    </header>
  );
}

function LogInSignUp() {
  return (
    <>
      <Button asChild variant="secondary">
        <Link href="/auth/signin">Log In</Link>
      </Button>
      <Button asChild>
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
