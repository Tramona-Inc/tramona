import {
  adminNavLinks,
  guestMobileNavLinks,
  hostMobileNavLinks,
  unloggedNavLinks,
} from "@/config/sideNavLinks";

import { ArrowLeftRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { NavBarLink } from "./NavBarLink";

export default function MobileNav({
  type,
}: {
  type: "admin" | "guest" | "host" | "unlogged";
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
              ...guestMobileNavLinks,
              { href: "/admin", name: "Switch To Admin", icon: ArrowLeftRight },
            ]
          : type == "unlogged"
            ? unloggedNavLinks
            : guestMobileNavLinks;

  return (
    <header
      className={`fixed inset-x-0 bottom-0 z-50 flex h-mobile-header-height items-center bg-[#fafafa] shadow-[0px_0px_10px_#0001] *:flex-1 lg:hidden *:lg:hidden`}
    >
      {navLinks.map((link, index) => (
        <NavBarLink key={index} href={link.href} icon={link.icon}>
          {link.name}
        </NavBarLink>
      ))}
    </header>
  );
}
