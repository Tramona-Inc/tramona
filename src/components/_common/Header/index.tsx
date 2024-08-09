import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { TramonaLogo } from "./TramonaLogo";
import NavLink from "@/components/_utils/NavLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import AvatarDropdown from "./AvatarDropdown";
import { api } from "@/utils/api";
import TramonaIcon from "@/components/_icons/TramonaIcon";
import {
  headerLinks1,
  headerLinks2,
  hamburgerLinksDesktop,
  hamburgerLinksHostMobileToHost,
  hamburgerLinksHostMobileToTraveler,
  hamburgerLinksMobile,
} from "@/config/headerNavLinks";
import { MenuIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Header() {
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
    icon: React.ReactNode;
  }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <DropdownMenuItem className="my-2 px-2 py-6 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
              <div className="rounded-full bg-teal-700/10 p-2">{link.icon}</div>
              {link.name}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LargeHeader() {
  const { data: isHost, isLoading: isHostLoading } =
    api.users.isHost.useQuery();

  const { status, data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 flex h-header-height items-center gap-2 border-b bg-white p-4 lg:pl-8 xl:px-20">
      <TramonaLogo />

      <div className="w-2" />

      {headerLinks1.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          render={({ selected }) => (
            <span
              className={cn(
                "text-sm font-bold text-muted-foreground xl:text-base",
                selected && "underline underline-offset-2",
              )}
            >
              {link.name}
            </span>
          )}
        />
      ))}

      <div className="flex-1" />

      {isHostLoading ? (
        status === "loading" ? null : (
          <Skeleton className="h-9 w-32 rounded-full" />
        )
      ) : isHost ? (
        <HostDashboardSwitcher />
      ) : (
        <Link
          href="/for-hosts"
          className="whitespace-nowrap rounded-full border px-3 py-2 text-sm font-bold text-primaryGreen hover:bg-zinc-100"
        >
          Become a host
        </Link>
      )}

      {status === "unauthenticated" && (
        <>
          {headerLinks2.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full border px-3 py-2 text-sm font-bold text-primaryGreen hover:bg-zinc-100"
            >
              {link.name}
            </Link>
          ))}
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
  const pathname = usePathname();

  const links =
    status === "authenticated"
      ? pathname.includes("/host")
        ? hamburgerLinksHostMobileToTraveler
        : hamburgerLinksHostMobileToHost
      : hamburgerLinksMobile;

  return (
    <header className="sticky top-0 z-50 flex h-header-height items-center gap-2 border-b bg-white px-2 pl-4 text-sm sm:text-base">
      <TramonaLogo />

      <div className="flex-1" />

      {status === "authenticated" && (
        <AvatarDropdown session={session} size="sm" />
      )}

      {status === "unauthenticated" && <LogInSignUp />}

      <HamburgerMenu links={links} />
    </header>
  );
}

function HostDashboardSwitcher() {
  const pathname = usePathname();

  return pathname.includes("/host") ? (
    <Link
      href="/"
      className="whitespace-nowrap rounded-full border px-3 py-2 text-sm font-bold text-primaryGreen hover:bg-zinc-100"
    >
      Switch to Traveler
    </Link>
  ) : (
    <Link
      href="/host"
      className="whitespace-nowrap rounded-full border px-3 py-2 text-sm font-bold text-primaryGreen hover:bg-zinc-100"
    >
      Switch to Host
    </Link>
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
