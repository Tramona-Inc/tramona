import NavLink from "../_utils/NavLink";

import { cn } from "@/utils/utils";
import {
  BriefcaseIcon,
  HistoryIcon,
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  TagIcon,
  WrenchIcon,
} from "lucide-react";
import { TramonaLogo } from "../_common/Header/TramonaLogo";
import { motion } from "framer-motion";

function SidebarLink({
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
            "relative flex items-center gap-4 p-4 text-center font-medium lg:flex-col lg:gap-1 lg:px-2 lg:py-3 lg:text-xs",
            selected
              ? "bg-zinc-200 text-black"
              : "text-zinc-700 hover:bg-zinc-200",
          )}
        >
          {selected && (
            <motion.div
              layoutId="sidebar-indicator"
              transition={{ duration: 0.1, ease: "circOut" }}
              className="absolute inset-y-0 right-0 border-[3px] border-transparent border-r-black"
            />
          )}
          <Icon
            className={cn(
              "size-6 lg:size-8",
              selected ? "text-black" : "text-zinc-700",
            )}
          />
          {children}
        </div>
      )}
    />
  );
}

const adminNavLinks = [
  { href: "/admin", name: "Dashboard", icon: LayoutDashboardIcon },
  {
    href: "/admin/incoming-requests",
    name: "Incoming Requests",
    icon: InboxIcon,
  },
  { href: "/admin/past-requests", name: "Past Requests", icon: HistoryIcon },
  { href: "/admin/utility", name: "Utility", icon: WrenchIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

const hostNavLinks = [
  { href: "/host", name: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

const guestNavLinks = [
  { href: "/dashboard", name: "Home", icon: HomeIcon },
  { href: "/requests", name: "My Requests", icon: TagIcon },
  { href: "/my-trips", name: "My Trips", icon: BriefcaseIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

export default function Sidebar({
  type,
  withLogo = false,
}: {
  type: "admin" | "guest" | "host";
  withLogo?: boolean;
}) {
  const navLinks =
    type === "admin"
      ? adminNavLinks
      : type === "host"
        ? hostNavLinks
        : guestNavLinks;

  return (
    <div className="sticky top-0 flex h-full w-64 flex-col border-r lg:w-24">
      {withLogo && (
        <div className="p-3">
          <TramonaLogo />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center">
        {navLinks.map((link, index) => (
          <SidebarLink key={index} href={link.href} icon={link.icon}>
            {link.name}
          </SidebarLink>
        ))}
      </div>
    </div>
  );
}
