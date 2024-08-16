import {
  adminNavLinks,
  guestNavLinks,
  hostMobileNavLinks,
  unloggedNavLinks,
} from "@/config/sideNavLinks";

import { ArrowLeftRight, MessagesSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { NavBarLink } from "./NavBarLink";

export default function MobileNav({
  type,
}: {
  type: "admin" | "guest" | "host" | "unlogged";
}) {
  const { data: session } = useSession();
  const isAdmin = session && session.user.role === "admin";

  let navLinks;

  switch (type) {
    case "admin":
      navLinks = adminNavLinks;
      break;
    case "host":
      navLinks = hostMobileNavLinks;
      break;
    case "unlogged":
      navLinks = unloggedNavLinks;
      break;
    default:
      navLinks = isAdmin
        ? [
            ...guestNavLinks,
            { href: "/admin", name: "Switch To Admin", icon: ArrowLeftRight },
          ]
        : [
            ...guestNavLinks,
            {
              href: "/chat-with-admin",
              name: "Concierge",
              icon: MessagesSquare,
            },
          ];
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
    </header>
  );
}
