import { guestMenuNavLinks } from "@/config/menuNavLinks";
import {
  adminNavLinks,
  guestNavLinks,
  hostMobileNavLinks,
} from "@/config/sideNavLinks";
import { cn } from "@/utils/utils";
import { ArrowLeftRight, LucideMenu } from "lucide-react";
import { useSession } from "next-auth/react";
import NavLink from "../_utils/NavLink";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

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
  type: "admin" | "guest" | "host";
  withLogo?: boolean;
}) {
  const { data: session } = useSession();

  const isAdmin = session && session.user.role === "admin";

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
          : guestNavLinks;

  return (
    <header className="h-mobile-header-height sticky bottom-0 z-50 flex items-center bg-white lg:hidden">
      <div className="grid w-full grid-cols-5">
        {navLinks.map((link, index) => (
          <BottomNavLink key={index} href={link.href} icon={link.icon}>
            {link.name}
          </BottomNavLink>
        ))}

        {/* Menu items */}
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
                <h3 className="mb-3 text-sm font-semibold uppercase">
                  Account
                </h3>
                <div className="flex flex-col space-y-4">
                  {guestMenuNavLinks.map((link, index) => (
                    <div key={index}>{link.name}</div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <Button variant={"outlineMinimal"} className="rounded-lg p-2">
                  Switch to host
                </Button>
                <Button>Log out</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
