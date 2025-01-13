import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { guestMobileNavLinks, moreMenuLinks } from "@/config/sideNavLinks";
import { useSession } from "next-auth/react";
import { NavBarLink } from "./NavBarLink";

export default function MobileNav({
  _type,
}: {
  _type: "admin" | "guest" | "host" | "unlogged";
}) {
  const { data: session } = useSession();
  const _isAdmin = session && session.user.role === "admin";

  const navLinks = guestMobileNavLinks;

  return (
    <header className="fixed inset-x-0 bottom-0 z-50 flex h-mobile-header-height w-full flex-row items-center justify-around bg-background shadow-[0px_0px_10px_#0001] lg:hidden">
      {navLinks.map((link, index) => {
        if (link.name === "More") {
          return (
            <Sheet key={index}>
              <SheetTrigger className="flex flex-col items-center justify-center text-sm">
                <link.icon className="h-5 w-5" />
                <span className="mt-1">{link.name}</span>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[300px]">
                <div className="grid gap-4 py-4">
                  {moreMenuLinks.map((menuLink, menuIndex) => (
                    <NavBarLink
                      key={menuIndex}
                      href={menuLink.href}
                      icon={menuLink.icon}
                    >
                      {menuLink.name}
                    </NavBarLink>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          );
        }
        return (
          <NavBarLink key={index} href={link.href} icon={link.icon}>
            {link.name}
          </NavBarLink>
        );
      })}
    </header>
  );
}
