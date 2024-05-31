import { guestMenuNavLinks } from "@/config/menuNavLinks";
import {
  adminNavLinks,
  guestMobileNavLinks,
  hostMobileNavLinks,
  unloggedNavLinks,
} from "@/config/sideNavLinks";
import { cn } from "@/utils/utils";
import {
  ArrowLeftRight,
  LucideMenu,
  ChevronDownIcon,
  ChevronUpIcon,
  NotepadTextIcon,
  MessageSquareMore,
  ShieldQuestion,
  Contact,
  MessageCircleQuestion,
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

export default function MobileNav({
  type,
  withLogo = false,
}: {
  type: "admin" | "guest" | "host" | "unlogged";
  withLogo?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: session } = useSession();
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isAdmin = session && session.user.role === "admin";
  const isHost = session && session.user.role === "host";

  const navLinks =
    type === "admin"
      ? adminNavLinks
      : type === "host"
        ? hostMobileNavLinks
        : isAdmin
          ? [
              ...guestMobileNavLinks,
              { href: "/admin", name: "Switch To Admin", icon: ArrowLeftRight },
            ]
          : type == "unlogged"
            ? unloggedNavLinks
            : guestMobileNavLinks;

  return (
    <header className="fixed bottom-0 z-50 flex h-mobile-header-height w-full items-center bg-zinc-100 shadow-md lg:hidden">
      {/* <div className="grid w-full grid-cols-5"> */}
      <div
        className={cn(
          "grid w-full",
          type === "unlogged" ? "grid-cols-3" : "grid-cols-5",
        )}
      >
        {navLinks.map((link, index) => (
          <NavBarLink key={index} href={link.href} icon={link.icon}>
            {link.name}
          </NavBarLink>
        ))}

        {/* Menu items */}
        {session ? (
          <div className="flex flex-col items-center justify-center">
            <Sheet>
              <SheetTrigger>
                <div
                  className={cn(
                    "relative flex flex-col items-center justify-center text-center text-xs font-medium text-muted-foreground",
                  )}
                >
                  <LucideMenu className="h-7 w-7" />
                  <p>Menu</p>
                </div>
              </SheetTrigger>
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
                  ) : !isHost ? // </Button> //   <Link href="/host-onboarding">Become a host</Link> // <Button asChild variant="darkOutline">
                  null : (
                    <Button asChild variant="darkOutline">
                      <Link href="/host">Switch to Host</Link>
                    </Button>
                  )}
                  <Button
                    onClick={() => signOut()}
                    className="mb-12 w-full gap-2"
                  >
                    Log out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className={cn(
                    "relative flex flex-col items-center justify-center text-center text-xs font-medium text-muted-foreground",
                  )}
                >
                  <LucideMenu className="size-8" />
                  <p>Menu</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <Link href="/how-it-works">
                    <DropdownMenuItem className="text-primary">
                      <ShieldQuestion />
                      How it works
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/faq">
                    <DropdownMenuItem className="text-primary">
                      <MessageCircleQuestion />
                      FAQ
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/support">
                    <DropdownMenuItem className="text-primary">
                      <Contact />
                      Contact
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
