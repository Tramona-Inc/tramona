import {
  BadgeInfo,
  BadgePercent,
  DoorOpen,
  Home,
  Link2,
  Menu,
  MenuIcon,
  MessageCircleQuestion,
  Tag,
  X,
} from "lucide-react";
import Link from "next/link";
import HeaderTopRight from "./HeaderTopRight";

import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn, useIsLg } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { TramonaLogo } from "./TramonaLogo";
import QuestionMarkIcon from "@/components/_icons/QuestionMarkIcon";
import NavLink from "@/components/_utils/NavLink";
import { SupportBtn } from "./SupportBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/_icons/icons";
import { useState } from "react";

type HeaderProps =
  | {
      type: "dashboard";
      sidebarType: "guest" | "host" | "admin" | "unlogged";
    }
  | { type: "marketing" };

export default function Header(props: HeaderProps) {
  return (
    <>
      <div className="contents lg:hidden">
        <SmallHeader {...props} />
      </div>
      <div className="container hidden lg:contents ">
        <LargeHeader {...props} />
      </div>
    </>
  );
}

const headerLinks1 = [
  { name: "Link Input", href: "/link-input" },
  { name: "Unclaimed Offers", href: "/unclaimed-offers" },
  { name: "Recent Deals", href: "/exclusive-offers" },
];

const headerLinks2 = [
  { name: "How it works", href: "/how-it-works" },
  { name: "24/7 Support", href: "/help-center" },
  { name: "Become a host", href: "/host-onboarding" },
];

const hamburgerLinksDesktop = [
  { name: "FAQ", href: "/faq", icon: <MessageCircleQuestion /> },
  { name: "Contact", href: "/support", icon: <BadgeInfo /> },
  { name: "For Hosts", href: "/for-hosts", icon: <DoorOpen /> },
];

const hamburgerLinksMobile = [
  { name: "Become a host", href: "/host-onboarding", icon: <Home /> },
  { name: "Unclaimed Offers", href: "/unclaimed-offers", icon: <Tag /> },
  { name: "Recent Deals", href: "/exclusive-offers", icon: <BadgePercent /> },
  { name: "Link Input", href: "/link-input", icon: <Link2 /> },
  { name: "For Hosts", href: "/for-hosts", icon: <DoorOpen /> },
];

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
      <DropdownMenuTrigger>
        <div className="pl-2">
          <MenuIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuLabel className="text-xl font-bold text-teal-900">
          <div className="flex items-center gap-3">
            <button
              className="rounded-full border border-teal-900 bg-zinc-200 p-2"
              onClick={() => setOpen(!open)}
            >
              <X size={20} />
            </button>
            <h3>Tramona</h3>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <DropdownMenuItem className="my-2 px-2 py-6 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
              <div className="rounded-full bg-zinc-200 p-2">{link.icon}</div>
              {link.name}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LargeHeader(props: HeaderProps) {
  const { status, data: session } = useSession();

  const pathname = usePathname();

  return (
    <header className=" sticky top-0 z-50 flex h-header-height items-center border-b bg-white p-4 lg:px-24">
      <div className="pr-10">
        <TramonaLogo />
      </div>

      <div className="flex items-center justify-center gap-8 text-muted-foreground">
        {props.type === "marketing" && (
          <>
            {status !== "authenticated" &&
              headerLinks1.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  render={({ selected }) => (
                    <span
                      className={cn(
                        "font-bold",
                        selected && "underline underline-offset-2",
                      )}
                    >
                      {link.name}
                    </span>
                  )}
                />
              ))}
          </>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {headerLinks2.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border bg-white px-4 py-2 text-sm font-bold text-teal-900"
          >
            {link.name}
          </Link>
        ))}
        {props.type === "dashboard" ? (
          <Button asChild variant="ghost" className="rounded-full">
            {session?.user.role === "host" && pathname.includes("/host") ? (
              <Link href="/">Switch to Traveler</Link>
            ) : session?.user.role !== "host" ? null : ( // <Link href="/host-onboarding">Become a host</Link>
              <Link href="/host">Switch to Host</Link>
            )}
          </Button>
        ) : (
          <Button asChild variant="ghost" className="font-bold">
            <Link href="/auth/signin">
              {status === "authenticated" ? "Switch to Dashboard" : "Log in"}
            </Link>
          </Button>
        )}
        {status !== "authenticated" && (
          <Button asChild variant="greenPrimary" className="font-bold">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        )}

        <HamburgerMenu links={hamburgerLinksDesktop} />

        {status == "authenticated" && (
          <>
            <Button
              size="icon"
              className="grid place-items-center rounded-full text-xl font-extrabold"
              variant="outline"
              asChild
            >
              <Link href="/help-center">
                <QuestionMarkIcon />
              </Link>
            </Button>
          </>
        )}

        <HeaderTopRight />
      </div>
    </header>
  );
}

// function SmallSidebar(props: HeaderProps) {
//   const isVisible = !useIsLg();
//   if (!isVisible || props.type === "marketing") return null;

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="ghost" size="icon">
//           <MenuIcon />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-max p-0">
//         {props.type === "dashboard" && (
//           <aside className="sticky bottom-0 top-header-height h-screen-minus-header">
//             <Sidebar withLogo type={props.sidebarType} />
//           </aside>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// }

function SmallHeader(props: HeaderProps) {
  const { status } = useSession();

  return (
    <header className="container sticky top-0 z-50 flex h-header-height items-center border-b bg-white text-sm sm:text-base">
      {/* {props.type === "dashboard" && (
        <div className="flex-1">
          <SmallSidebar {...props} />
        </div>
      )} */}

      <TramonaLogo />

      <div className="flex flex-1 items-center justify-end gap-2">
        {props.type === "marketing" && (
          <>
            {status === "authenticated" && (
              <Button size="sm" asChild variant="secondary">
                <Link href="/auth/signin">Dashboard</Link>
              </Button>
            )}
            <Button size="sm" asChild variant="greenPrimary">
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </>
        )}
        <HamburgerMenu links={hamburgerLinksMobile} />
        {/* <HeaderTopRight /> */}
      </div>
    </header>
  );
}
