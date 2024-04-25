import { MenuIcon, CircleHelp } from "lucide-react";
import Link from "next/link";
import HeaderTopRight from "./HeaderTopRight";

import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsLg } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
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
      <div className="container hidden lg:contents ">
        <LargeHeader {...props} />
      </div>
    </>
  );
}

function LargeHeader(props: HeaderProps) {
  const { status, data: session } = useSession();

  const pathname = usePathname();

  return (
    <header className=" sticky top-0 z-50 flex h-header-height items-center bg-white p-4 shadow-md lg:px-24">
      <div className="flex flex-1 gap-4">
        <TramonaLogo />
      </div>

      <div className="flex items-center justify-center gap-2">
        {props.type === "marketing" && (
          <>
            {/* {headerLinks.map(({ href, label }, i) => (
                <HeaderLink key={i} href={href}>
                  {label}
                </HeaderLink>
              ))} */}
          </>
        )}
      </div>

      <div className="flex flex-1 justify-end gap-5">
        {props.type === "dashboard" ? (
          <Button asChild variant="darkOutline">
            {session?.user.role === "host" && pathname === "/host" ? (
              <Link href="/">Switch to Traveler</Link>
            ) : session?.user.role !== "host" ? (
              <Link href="/for-hosts/sign-up">Become a host</Link>
            ) : (
              <Link href="/host">Switch to Host</Link>
            )}
          </Button>
        ) : (
          <Button asChild variant="darkOutline">
            <Link href="/auth/signin">
              {status === "authenticated" ? "Switch to Dashboard" : "Log in"}
            </Link>
          </Button>
        )}
        <Link href="/faq">
          <CircleHelp size={41} strokeWidth={1.7} className="text-primary"/>
        </Link>
        <HeaderTopRight/>
      </div>
    </header>
  );
}

function SmallSidebar(props: HeaderProps) {
  const isVisible = !useIsLg();
  if (!isVisible || props.type === "marketing") return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-max p-0">
        {props.type === "dashboard" && (
          <aside className="sticky bottom-0 top-header-height h-screen-minus-header">
            <Sidebar withLogo type={props.sidebarType} />
          </aside>
        )}
      </SheetContent>
    </Sheet>
  );
}

function SmallHeader(props: HeaderProps) {
  const { status } = useSession();

  return (
    <header className="container sticky top-0 z-50 flex h-header-height items-center bg-white text-sm shadow-md sm:text-base">
      {/* {props.type === "dashboard" && (
        <div className="flex-1">
          <SmallSidebar {...props} />
        </div>
      )} */}

      <TramonaLogo />

      <div className="flex flex-1 justify-end gap-2">
        {props.type === "marketing" && (
          <Button asChild variant="darkOutline">
            <Link href="/auth/signin">
              {status === "authenticated" ? "Dashboard" : "Log in"}
            </Link>
          </Button>
        )}
      
        {/* <HeaderTopRight /> */}
      </div>
    </header>
  );
}
