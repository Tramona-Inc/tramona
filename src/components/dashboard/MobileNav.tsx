import { guestMenuNavLinks } from "@/config/menuNavLinks";
import {
  adminNavLinks,
  guestNavLinks,
  hostMobileNavLinks,
  unloggedNavLinks
} from "@/config/sideNavLinks";
import { cn } from "@/utils/utils";
import {
  ArrowLeftRight,
  LucideMenu,
  ChevronDownIcon,
  ChevronUpIcon,
  NotepadTextIcon,
  MessageSquareMore,
  Menu, 
  ShieldQuestion, 
  Contact, 
  MessageCircleQuestion
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import NavLink from "../_utils/NavLink";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function BottomNavLink({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <NavLink
      href={href}
      render={({ selected }) => (
        <div
          className={cn(
            "relative flex flex-col items-center text-center text-xs font-medium",
            selected ? "text-[#2F5BF6]" : "text-[#5B616D]",
          )}
        >
          <Icon
            className={cn(
              "size-8",
              selected ? "text-[#2F5BF6]" : "text-[#5B616D]",
            )}
          />
          {children}
        </div>
      )}
    />
  );
}

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
  console.log("Session: ", session);
  const navLinks =
    type === "admin"
      ? adminNavLinks
      : type === "host"
        ? hostMobileNavLinks
        : isAdmin
          ? [
              ...guestNavLinks,
              { href: "/admin", name: "Switch To Admin", icon: ArrowLeftRight },
            ]
          : type == "unlogged"
            ? unloggedNavLinks
              : guestNavLinks;

  return (
    <header className="fixed bottom-0 z-50 flex h-mobile-header-height w-full items-center bg-white lg:hidden">
      {/* <div className="grid w-full grid-cols-5"> */}
      <div className={cn("grid w-full", type === "unlogged" ? "grid-cols-3" : "grid-cols-5")}>
        {navLinks.map((link, index) => (
          <BottomNavLink key={index} href={link.href} icon={link.icon}>
            {link.name}
          </BottomNavLink>
        ))}

        {/* Menu items */}
        {
          session ?
          <div className="flex flex-col items-center justify-center">
            <Sheet>
              <SheetTrigger>
                <div
                  className={cn(
                    "relative flex flex-col items-center justify-center text-center text-xs font-medium text-[#5B616D]",
                  )}
                >
                  <LucideMenu className="size-8" />
                  <p>Menu</p>
                </div>
              </SheetTrigger>
              <SheetContent side={"top"} className="flex flex-col space-y-5">
                <h2 className="text-2xl font-bold">Menu</h2>
                <div>
                  <div className="flex flex-col space-y-6 mb-4">
                      <div className="flex flex-row gap-x-4">
                        <MessageSquareMore/>
                        <Link href="/messages" className="font-light">
                          {"Messages"}
                        </Link>
                      </div>
                  </div>
                  <h3 className="mb-5 text-sm font-semibold uppercase tracking-tight">
                    Account
                  </h3>
                  <div className="flex flex-col space-y-6">
                    {guestMenuNavLinks.map((link, index) => (
                      <div className="flex flex-row gap-x-4" key={index}>
                        {link.icon}
                        <Link href={link.href} key={index} className="font-light">
                          {link.name}
                        </Link>
                      </div>
                    ))}
                    <div className="flex flex-col gap-y-4 ">
                      <div
                        className="flex cursor-pointer flex-row gap-x-4"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        <div className="font-light">More</div>
                      </div>
                      {isExpanded && (
                        <div className="flex flex-col gap-y-2">
                          <Separator />
                          <div className="flex flex-row gap-x-4">
                            <NotepadTextIcon />
                            <Link href="/support" className="font-light">
                              Terms
                            </Link>
                          </div>
                          <div className="mt-4 w-full text-center text-xs text-muted-foreground">
                            © {currentYear} Tramona. All rights reserved.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  {isHost && pathname === "/host" ? (
                    <Button asChild variant="darkOutline">
                      <Link href="/">Switch to Traveler</Link>
                    </Button>
                  ) : !isHost ? (
                    <Button asChild variant="darkOutline">
                      <Link href="/host-onboarding">Become a host</Link>
                    </Button>
                  ) : (
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
          </div> :
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                    className={cn(
                      "relative flex flex-col items-center justify-center text-center text-xs font-medium text-[#5B616D]",
                    )}>
                  <LucideMenu className="size-8" />
                  <p>Menu</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <Link href="/how-it-works">
                    <DropdownMenuItem className="text-primary">
                      <ShieldQuestion/>
                      How it works
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/faq">
                    <DropdownMenuItem className="text-primary">
                      <MessageCircleQuestion/>
                      FAQ
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/support">
                    <DropdownMenuItem className="text-primary">
                      <Contact/>
                      Contact
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      </div>
    </header>
  );
}
