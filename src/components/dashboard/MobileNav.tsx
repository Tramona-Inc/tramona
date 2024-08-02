import { guestMenuNavLinks } from "@/config/menuNavLinks";
import {
  adminNavLinks,
  guestMobileNavLinks,
  hostNavLinks,
  unloggedNavLinks,
} from "@/config/sideNavLinks";
import { cn } from "@/utils/utils";
import {
  ArrowLeftRight,
  ChevronDownIcon,
  ChevronUpIcon,
  NotepadTextIcon,
  MessageSquareMore,
  ShieldQuestion,
  Contact,
  MessageCircleQuestion,
  MenuIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavBarLink } from "./NavBarLink";
import { api } from "@/utils/api";

function LoggedInMenu({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentYear = new Date().getFullYear();

  const { data: isHost } = api.users.isHost.useQuery();

  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side={"top"}>
        <h2 className="text-2xl font-bold">Menu</h2>
        <Link href="/messages" className="flex gap-4 py-3 font-light">
          <MessageSquareMore />
          Messages
        </Link>

        <h3 className="pt-2 text-sm font-semibold uppercase tracking-tight">
          Account
        </h3>
        {guestMenuNavLinks.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className="flex gap-4 py-3 font-light"
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
        <div className="flex flex-col">
          <button
            className="flex gap-4 py-3"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            <div className="font-light">More</div>
          </button>
          {isExpanded && (
            <div className="flex flex-col gap-y-2">
              <Separator />
              <div className="flex flex-row gap-x-4">
                <NotepadTextIcon />
                <Link href="/support" className="font-light">
                  Terms
                </Link>
              </div>
              <div className="mb-2 mt-4 w-full text-center text-xs text-muted-foreground">
                © {currentYear} Tramona. All rights reserved.
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          {isHost && pathname === "/host" ? (
            <Button asChild variant="darkOutline">
              <Link href="/">Switch to Traveler</Link>
            </Button>
          ) : !isHost ? null : ( // </Button> //   <Link href="/host-onboarding">Become a host</Link> // <Button asChild variant="darkOutline">
            <Button asChild variant="darkOutline">
              <Link href="/host">Switch to Host</Link>
            </Button>
          )}
          <Button onClick={() => signOut()} className="mb-12 w-full gap-2">
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function LoggedOutMenu({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Link href="/how-it-works">
            <DropdownMenuItem>
              <ShieldQuestion />
              How it works
            </DropdownMenuItem>
          </Link>
          <Link href="/faq">
            <DropdownMenuItem>
              <MessageCircleQuestion />
              FAQ
            </DropdownMenuItem>
          </Link>
          <Link href="/support">
            <DropdownMenuItem>
              <Contact />
              Contact
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function MobileNav({
  type,
}: {
  type: "admin" | "guest" | "host" | "unlogged";
}) {
  const { data: session } = useSession();
  const isAdmin = session && session.user.role === "admin";

  const Menu = session ? LoggedInMenu : LoggedOutMenu;

  const navLinks =
    type === "admin"
      ? adminNavLinks
      : type === "host"
        ? hostNavLinks
        : isAdmin
          ? [
              ...guestMobileNavLinks,
              { href: "/admin", name: "Switch To Admin", icon: ArrowLeftRight },
            ]
          : type == "unlogged"
            ? unloggedNavLinks
            : guestMobileNavLinks;

  return (
    <header
      className={`fixed inset-x-0 bottom-0 z-50 flex h-mobile-header-height items-center bg-[#fafafa] shadow-[0px_0px_10px_#0001] lg:hidden *:lg:hidden ${type == "unlogged" ? `justify-around px-20` : `*:flex-1`}`}
    >
      {navLinks.map((link, index) => (
        <NavBarLink key={index} href={link.href} icon={link.icon}>
          {link.name}
        </NavBarLink>
      ))}
      {/* <Menu>
        <div
          className={cn(
            "relative flex flex-col items-center gap-1 px-1 py-3 text-center text-xs font-medium text-muted-foreground",
          )}
        >
          <MenuIcon className="size-6 lg:size-8" />
          Menu
        </div>
      </Menu> */}
    </header>
  );
}
