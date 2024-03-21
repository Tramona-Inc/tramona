import { MenuIcon } from "lucide-react";
import Link from "next/link";
import HeaderTopRight from "./HeaderTopRight";

import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsLg } from "@/utils/utils";
import { useSession } from "next-auth/react";
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

function LargeHeader(props: HeaderProps) {
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white p-4 shadow-md">
      <div className="flex items-center">
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
              <Link href="/">Switch to Home page</Link>
            </Button>
          ) : (
            <Button variant="darkOutline">
              <Link href="/auth/signin">
                {status === "authenticated" ? "Switch to Dashboard" : "Log in"}
              </Link>
            </Button>
          )}
          <HeaderTopRight />
        </div>
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
    <header className="sticky top-0 z-50 flex items-center bg-white p-2 text-sm shadow-md sm:p-4 sm:text-base">
      {props.type === "dashboard" && (
        <div className="flex-1">
          <SmallSidebar {...props} />
        </div>
      )}

      <TramonaLogo />

      <div className="flex flex-1 justify-end gap-2">
        {props.type === "marketing" && (
          <Button variant="darkOutline">
            <Link href="/auth/signin">
              {status === "authenticated" ? "Dashboard" : "Log in"}
            </Link>
          </Button>
        )}

        <HeaderTopRight />
      </div>
    </header>
  );
}
