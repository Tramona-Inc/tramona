import { MenuIcon } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import HeaderTopRight from "./HeaderTopRight";

import NavLink from "@/components/_utils/NavLink";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/utils/utils";
import Sidebar from "@/components/dashboard/Sidebar";
import { TramonaLogo } from "./TramonaLogo";

type HeaderProps =
  | {
      type: "dashboard";
      sidebarType: "guest" | "host" | "admin";
    }
  | { type: "marketing" };

export default function Header(props: HeaderProps) {
  return (
    <>
      <div className="contents lg:hidden">
        <SmallHeader {...props} />
      </div>
      <div className="hidden lg:contents">
        <LargeHeader {...props} />
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

function LargeHeader(props: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white p-4 shadow-md">
      <div className="flex items-center">
        <div className="flex flex-1 gap-4">
          <TramonaLogo />
        </div>

        <div className="flex items-center justify-center gap-2">
          {props.type === "marketing" && (
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
          {props.type === "dashboard" ? (
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

function SmallHeader(props: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center bg-white p-2 text-sm shadow-md sm:p-4 sm:text-base">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-max p-0">
          {props.type === "marketing" && (
            <div className="flex w-80 flex-col gap-2 p-8 pr-16">
              {headerLinks.map(({ href, label }, i) => (
                <HeaderLink key={i} href={href}>
                  {label}
                </HeaderLink>
              ))}
            </div>
          )}

          {props.type === "dashboard" && (
            <aside className="sticky bottom-0 top-header hidden h-screen-minus-header bg-zinc-100 lg:block">
              <Sidebar withLogo type={props.sidebarType} />
            </aside>
          )}
        </SheetContent>
      </Sheet>

      <TramonaLogo />

      <div className="flex-1" />

      {props.type === "marketing" && (
        <Button asChild variant="darkOutline">
          <Link href="/auth/signin">Log in</Link>
        </Button>
      )}

      {props.type === "dashboard" && (
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
