import {
  adminNavLinks,
  guestMobileNavLinks,
  hostMobileNavLinks,
} from "@/config/sideNavLinks";
import { ArrowLeftRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { NavBarLink } from "./NavBarLink";

export default function MobileNav({
  type,
}: {
  type: "admin" | "guest" | "host" | "unlogged";
}) {
  const { data: session, status } = useSession();
  const isAdmin = session && session.user.role === "admin";

  let navLinks;

  switch (type) {
    case "admin":
      navLinks = adminNavLinks;
      break;
    case "host":
      navLinks = hostMobileNavLinks;
      break;
    default:
      navLinks = isAdmin
        ? [
            ...guestMobileNavLinks,
            { href: "/admin", name: "Switch To Admin", icon: ArrowLeftRight },
          ]
        : [...guestMobileNavLinks];
      break;
  }

  return (
    <header
      className={`*:w-full *:lg:hidden fixed inset-x-0 bottom-0 z-50 flex h-mobile-header-height w-full flex-row items-center justify-around bg-background shadow-[0px_0px_10px_#0001] lg:hidden`}
    >
      {navLinks.map((link, index) => (
        <NavBarLink key={index} href={link.href} icon={link.icon}>
          {link.name}
        </NavBarLink>
      ))}
    </header>
  );
}
