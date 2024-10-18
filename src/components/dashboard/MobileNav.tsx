import {
  adminNavLinks,
  guestMobileNavHamburgerLinks,
  guestMobileNavLinks,
  hostMobileNavLinks,
  unloggedMobileNavLinks,
} from "@/config/sideNavLinks";
import { ArrowLeftRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { NavBarLink } from "./NavBarLink";
import { HamburgerMenu } from "../_common/Layout/header/Header";

export default function MobileNav({
  type,
}: {
  type: "admin" | "guest" | "host" | "unlogged";
}) {
  const { data: session, status } = useSession();
  const isAdmin = session && session.user.role === "admin";
  const isHost = session && session.user.role === "host";

  let navLinks;

  switch (type) {
    case "admin":
      navLinks = adminNavLinks;
      break;
    case "host":
      navLinks = hostMobileNavLinks;
      break;
    case "unlogged":
      navLinks = unloggedMobileNavLinks;
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
      className={`fixed inset-x-0 bottom-0 z-50 flex h-mobile-header-height items-center bg-[#fafafa] shadow-[0px_0px_10px_#0001] *:flex-1 lg:hidden *:lg:hidden`}
    >
      {navLinks.map((link, index) => (
        <NavBarLink key={index} href={link.href} icon={link.icon}>
          {link.name}
        </NavBarLink>
      ))}
      {status === "authenticated" && !isHost && (
        <HamburgerMenu links={guestMobileNavHamburgerLinks} />
      )}
    </header>
  );
}
