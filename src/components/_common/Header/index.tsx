import { MenuIcon } from "lucide-react";
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

const headerLinks = [
  { name: "How it works", href: "/how-it-works" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/support" },
];

function LargeHeader(props: HeaderProps) {
  const { status, data: session } = useSession();

  const pathname = usePathname();

  return (
    <header className=" sticky top-0 z-50 flex h-header-height items-center border-b bg-white p-4 lg:px-24">
      <div className="flex flex-1 gap-4">
        <TramonaLogo />
      </div>

      <div className="flex items-center justify-center gap-8">
        {props.type === "marketing" && (
          <>
            {status !== "authenticated" &&
              headerLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  render={({ selected }) => (
                    <span
                      className={cn(
                        "font-semibold",
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

      <div className="flex flex-1 justify-end gap-2">
        <SupportBtn />
        {props.type === "dashboard" ? (
          <Button asChild variant="ghost" className="rounded-full">
            {session?.user.role === "host" && pathname.includes("/host") ? (
              <Link href="/">Switch to Traveler</Link>
            ) : session?.user.role !== "host" ? null : ( // <Link href="/host-onboarding">Become a host</Link>
              <Link href="/host">Switch to Host</Link>
            )}
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link href="/auth/signin">
              {status === "authenticated" ? "Switch to Dashboard" : "Log in"}
            </Link>
          </Button>
        )}
        {status !== "authenticated" && (
          <Button asChild variant="greenPrimary">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        )}
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
        <SupportBtn />
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

        {/* <HeaderTopRight /> */}
      </div>
    </header>
  );
}
