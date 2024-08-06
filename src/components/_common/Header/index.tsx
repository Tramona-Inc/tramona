import {
  BadgeHelp,
  BadgeInfo,
  DoorOpen,
  Home,
  Menu,
  MenuIcon,
  MessageCircleQuestion,
  X,
} from "lucide-react";
import Link from "next/link";
// import { useMediaQuery } from "@/components/_utils/useMediaQuery";
import HeaderTopRight from "./HeaderTopRight";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { TramonaLogo } from "./TramonaLogo";
import QuestionMarkIcon from "@/components/_icons/QuestionMarkIcon";
import NavLink from "@/components/_utils/NavLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import AvatarDropdown from "./AvatarDropdown";

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
      <div className="container hidden lg:contents">
        <LargeHeader {...props} />
      </div>
    </>
  );
}

const headerLinks1 = [
  { name: "Link Input", href: "/link-input" },
  { name: "Recent Deals", href: "/exclusive-offers" },
  //{ name: "Unclaimed Offers", href: "/unclaimed-offers" },
];

const headerLinks2 = [
  { name: "How it works", href: "/how-it-works" },
  { name: "24/7 Support", href: "/help-center" },
  { name: "Become a host", href: "/for-hosts" },
];

const hamburgerLinksDesktop = [
  { name: "FAQ", href: "/faq", icon: <MessageCircleQuestion /> },
  { name: "Contact", href: "/support", icon: <BadgeInfo /> },
  { name: "For Hosts", href: "/for-hosts", icon: <DoorOpen /> },
];

const hamburgerLinksMobile = [
  { name: "Become a host", href: "/for-hosts", icon: <Home /> },
  { name: "How it works", href: "/how-it-works", icon: <Menu /> },
  { name: "24/7 Support", href: "/help-center", icon: <BadgeHelp /> },
  // { name: "FAQ", href: "/faq", icon: <MessageCircleQuestion /> },
  // { name: "Contact", href: "/support", icon: <BadgeInfo /> },
  // { name: "For Hosts", href: "/for-hosts", icon: <DoorOpen /> },
  // { name: "Link Input", href: "/link-input", icon: <Link2 /> },
  // { name: "Unclaimed Offers", href: "/unclaimed-offers", icon: <Tag /> },
  // { name: "Recent Deals", href: "/exclusive-offers", icon: <BadgePercent /> },
];

export const hamburgerLinksHostMobileToTraveler = [
  { name: "Switch to Traveler", href: "/", icon: <DoorOpen /> },
  { name: "24/7 Support", href: "/help-center", icon: <BadgeHelp /> },
];

export const hamburgerLinksHostMobileToHost = [
  { name: "Switch to Host", href: "/host", icon: <DoorOpen /> },
  { name: "24/7 Support", href: "/help-center", icon: <BadgeHelp /> },
];

function HamburgerMenu({
  links,
}: {
  links: {
    name: string;
    href: string;
    icon?: React.ReactNode | null;
  }[];
}) {
  // const isMobile = useMediaQuery("(max-width:810px)")
  const [open, setOpen] = useState(false);

  return (
    // <Dialog open={open} onOpenChange={setOpen}>
    //   <DialogTrigger>
    //   <div className="pl-2">
    //       <MenuIcon />
    //     </div>
    //   </DialogTrigger>
    //   <DialogContent className="min-w-full h-screen">
    //     <DialogTitle>
    //     <div className="flex items-center gap-3">
    //         <button
    //           className="rounded-full border border-teal-900 bg-zinc-200 p-2"
    //           onClick={() => setOpen(!open)}
    //         >
    //           <X size={20} />
    //         </button>
    //         <h3>Tramona</h3>
    //       </div>
    //     </DialogTitle>
    //     <DropdownMenuSeparator className="mt-3"/>
    //     {links.map((link) => (
    //       <Link key={link.href} href={link.href}>
    //           {link.icon ? 
    //           <>
    //           <div className="flex flex-row my-1 px-2 py-4 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
    //           <div className="flex p-1">{link.icon}</div>
    //           <div className="flex p-1">{link.name}</div>
    //         </div>
    //           <Separator className=""/>
    //           </>
    //           : 
    //           <>
    //           <div className="px-2 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
    //           <div className="p-2">
    //             {link.name}
    //           </div>
    //         </div>
    //         <Separator />
    //         </>
    //           }
    //       </Link>
    //     ))}
    //   </DialogContent>
    // </Dialog>
    <DropdownMenu open={open} onOpenChange={setOpen}>
       <DropdownMenuTrigger>
         <div className="pl-2">
           <MenuIcon />
         </div>
       </DropdownMenuTrigger>
        {/* <DropdownMenuPortal container={document.body}> */}
        {/* {isMobile ?  */}
        <DropdownMenuContent className="sm:hidden fixed -top-[3rem] -right-12 w-screen h-screen bg-white z-50 p-4 overflow-y-auto">
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
              {link.icon ? 
              <>
                <DropdownMenuItem className="my-2 px-2 py-4 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
              <div className="p-1">{link.icon}</div>
              <div>{link.name}</div>
            </DropdownMenuItem>
              <Separator />
              </>
              : 
              <>
              <DropdownMenuItem className="px-2 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
              <div className="p-2">
                {link.name}
              </div>
            </DropdownMenuItem>
            <Separator />
            </>
              }
          </Link>
        ))}
        </DropdownMenuContent>
        
          <DropdownMenuContent className="bg-white hidden">
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
              {link.icon ? 
              <>
                <DropdownMenuItem className="my-2 px-2 py-4 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
              <div className="p-1">{link.icon}</div>
              <div>{link.name}</div>
            </DropdownMenuItem>
              <Separator />
              </>
              : 
              <>
              <DropdownMenuItem className="px-2 font-bold text-teal-900 focus:bg-zinc-100 focus:text-teal-900">
              <div className="p-2">
                {link.name}
              </div>
            </DropdownMenuItem>
            <Separator />
            </>
              }
          </Link>
        ))}
        </DropdownMenuContent>
        {/* } */}
        {/* </DropdownMenuPortal> */}
      </DropdownMenu> 
  );
}

function LargeHeader(props: HeaderProps) {
  const { status, data: session } = useSession();

  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex h-header-height items-center border-b bg-white p-4 lg:pl-8 xl:px-20">
      <div className="pr-5">
        <TramonaLogo />
      </div>

      <div className="mt-1 flex items-center justify-center gap-x-5 leading-tight text-muted-foreground">
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
                        "text-sm font-bold xl:text-base",
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
        {status !== "authenticated" && (
          <>
            {headerLinks2.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-full border bg-white px-3 py-2 text-sm font-bold text-teal-900 xl:text-base"
              >
                {link.name}
              </Link>
            ))}
          </>
        )}
        {props.type === "dashboard" ? (
          <>
            <Link
              href="/help-center"
              className="whitespace-nowrap rounded-full border bg-white px-3 py-2 text-sm font-bold text-teal-900 xl:text-base"
            >
              24/7 Support
            </Link>
            {session?.user.role == "guest" && (
              <Link
                href="/for-hosts"
                className="whitespace-nowrap rounded-full border bg-white px-3 py-2 text-sm font-bold text-teal-900 xl:text-base"
              >
                Become a host
              </Link>
            )}

            {session?.user.role === "host" && pathname.includes("/host") ? (
              <Link
                href="/"
                className="whitespace-nowrap rounded-full border bg-white px-3 py-2 text-sm font-bold text-teal-900 xl:text-base"
              >
                Switch to Traveler
              </Link>
            ) : session?.user.role !== "host" ? null : ( // <Link href="/host-onboarding">Become a host</Link>
              <Link
                href="/host"
                className="whitespace-nowrap rounded-full border bg-white px-3 py-2 text-sm font-bold text-teal-900 xl:text-base"
              >
                Switch to Host
              </Link>
            )}

            {status !== "authenticated" && (
              <>
                <Button asChild variant="greenPrimary" className="font-bold">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
                <HamburgerMenu links={hamburgerLinksDesktop} />
              </>
            )}
          </>
        ) : (
          <Button asChild variant="ghost" className="font-bold">
            <Link href="/auth/signin">
              {status === "authenticated" ? "Switch to Dashboard" : "Log in"}
            </Link>
          </Button>
        )}
        {status !== "authenticated" && (
          <>
            <Button asChild variant="greenPrimary" className="font-bold">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
            <HamburgerMenu links={hamburgerLinksDesktop} />
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
  const { status, data: session } = useSession();
  const pathname = usePathname();
  return (
    <header className="container sticky top-0 z-50 flex h-header-height items-center border-b bg-white text-sm sm:text-base">
      {/* {props.type === "dashboard" && (
        <div className="flex-1">
          <SmallSidebar {...props} />
        </div>
      )} */}
      <TramonaLogo />

      <div className="flex w-full flex-row items-center justify-between gap-x-1">
        {props.type !== "marketing" && (
          <Button size="sm" asChild variant="ghost" className="place-items-end">
            <Link
              href={
                props.sidebarType == "host"
                  ? "/host"
                  : props.sidebarType == "admin"
                    ? "/admin"
                    : "/"
              }
            >
              Dashboard
            </Link>
            {/* <Link href={sidebarType== "host" ? "/host" : "dashboard"} >Dashboard</Link> */}
          </Button>
        )}
        {props.type === "marketing" ? (
          <div className="flex w-full justify-end gap-x-2">
            {status !== "authenticated" && (
              <>
                <Button size="sm" asChild variant="greenPrimary">
                  <Link href="/auth/signup">Log In</Link>
                </Button>
                <HamburgerMenu links={hamburgerLinksMobile} />
              </>
            )}
          </div>
        ) : null}
        {status === "authenticated" && session.user.role == "host" && (
          <div className="flex items-center gap-x-2 self-end justify-self-end">
            <AvatarDropdown session={session} size="sm" />
            <HamburgerMenu
              links={
                pathname.includes("/host")
                  ? hamburgerLinksHostMobileToTraveler
                  : hamburgerLinksHostMobileToHost
              }
            />
          </div>
        )}{" "}
        {status === "authenticated" && session.user.role != "host" && (
          <div className="flex items-center gap-x-2 self-end justify-self-end">
            <AvatarDropdown session={session} size="sm" />
            <HamburgerMenu links={hamburgerLinksMobile} />
          </div>
        )}
      </div>
    </header>
  );
}
