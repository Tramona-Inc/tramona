import TramonaIcon from "@/components/_icons/TramonaIcon";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import HeaderTopRight from "./HeaderTopRight";

import NavLink from "@/components/_utils/NavLink";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import {
  AdminNavLinks,
  GuestNavLinks,
  HostNavLinks,
} from "../Layout/DashboardLayout";

type HeaderProps = {
  type: "marketing" | "dashboard";
};

export default function Header({ type }: HeaderProps) {
  return (
    <>
      <div className="contents lg:hidden">
        <SmallHeader type={type} />
      </div>
      <div className="hidden lg:contents">
        <LargeHeader type={type} />
      </div>
    </>
  );
}

const headerLinks = [
  {
    href: "/program",
    label: "Refer and Earn",
  },
  {
    href: "/for-hosts",
    label: "For Hosts",
  },
  // {
  //   href: "/exclusive-offers",
  //   label: "Exclusive Offers",
  // },
  {
    href: "/feed",
    label: "Social Feed",
  },
];

function LargeHeader({ type }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white p-4 shadow-md">
      <div className="container flex items-center">
        <div className="flex flex-1 gap-4">
          <TramonaLogo />
        </div>

        <div className="flex items-center justify-center gap-2">
          {type === "marketing" && (
            <>
              {headerLinks.map(({ href, label }, i) => (
                <HeaderLink key={i} href={href}>
                  {label}
                </HeaderLink>
              ))}
            </>
          )}
        </div>

        <div className="flex flex-1 justify-end">
          {type === "dashboard" ? (
            <HeaderTopRight />
          ) : (
            <Button asChild variant="darkOutline">
              <Link href="/auth/signin">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function SmallHeader({ type }: HeaderProps) {
  const { status, data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 flex items-center bg-white p-2 text-sm shadow-md sm:p-4 sm:text-base">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Tramona</SheetTitle>
            <SheetDescription>
              {/* This action cannot be undone. This will permanently delete your
              account and remove your data from our servers. */}
            </SheetDescription>
          </SheetHeader>

          {type === "marketing" && (
            <>
              {headerLinks.map(({ href, label }, i) => (
                <HeaderLink key={i} href={href}>
                  {label}
                </HeaderLink>
              ))}
            </>
          )}

          {type === "dashboard" && (
            <>
              {session?.user.role === "admin"
                ? AdminNavLinks.map(({ href, name }, i) => (
                    <HeaderLink key={i} href={href}>
                      {name}
                    </HeaderLink>
                  ))
                : session?.user.role === "guest"
                  ? GuestNavLinks.map(({ href, name }, i) => (
                      <HeaderLink key={i} href={href}>
                        {name}
                      </HeaderLink>
                    ))
                  : session?.user.role === "host"
                    ? HostNavLinks.map(({ href, name }, i) => (
                        <HeaderLink key={i} href={href}>
                          {name}
                        </HeaderLink>
                      ))
                    : null}
            </>
          )}
        </SheetContent>
      </Sheet>

      <TramonaLogo />

      <div className="flex-1" />

      {type === "marketing" && (
        <Button asChild variant="darkOutline">
          <Link href="/auth/signin">Log in</Link>
        </Button>
      )}

      {status === "authenticated" && (
        <div className="flex flex-1 justify-end">
          <HeaderTopRight />
        </div>
      )}
    </header>
  );
}

function HeaderLink({
  href,
  children,
  onClick,
}: PropsWithChildren<{ href: string; onClick?: () => void }>) {
  return (
    <NavLink
      href={href}
      render={({ selected }) => (
        <div
          onClick={onClick} // close dropdown when link is clicked
          className={cn(
            "rounded-lg px-5 py-2 font-medium",
            selected ? "bg-black text-white" : "text-black hover:bg-zinc-200",
          )}
        >
          {children}
        </div>
      )}
    />
  );
}

function TramonaLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
      <TramonaIcon />
      Tramona
    </Link>
  );
}
