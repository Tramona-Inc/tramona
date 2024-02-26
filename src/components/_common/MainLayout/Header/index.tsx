import type { PropsWithChildren } from "react";
import Link from "next/link";
import React, { useState } from "react";
import TramonaIcon from "@/components/_icons/TramonaIcon";
import { MenuIcon } from "lucide-react";
import HeaderTopRight from "./HeaderTopRight";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NavLink from "@/components/_utils/NavLink";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <>
      <div className="contents lg:hidden">
        <SmallHeader />
      </div>
      <div className="hidden lg:contents">
        <LargeHeader />
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

function LargeHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center bg-white p-4 shadow-md">
      <div className="flex flex-1 gap-4">
        <TramonaLogo />
      </div>

      <div className="flex items-center justify-center gap-2">
        {headerLinks.map(({ href, label }, i) => (
          <HeaderLink key={i} href={href}>
            {label}
          </HeaderLink>
        ))}
      </div>

      <div className="flex flex-1 justify-end">
        <HeaderTopRight />
      </div>
    </header>
  );
}

function SmallHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 flex items-center bg-white p-2 text-sm shadow-md sm:p-4 sm:text-base">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="p-2">
          {headerLinks.map(({ href, label }, i) => (
            <HeaderLink key={i} href={href} onClick={closeMenu}>
              {label}
            </HeaderLink>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <TramonaLogo />

      <div className="flex flex-1 justify-end">
        <HeaderTopRight />
      </div>
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
