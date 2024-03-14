import NavLink from "../_utils/NavLink";

import { cn } from "@/utils/utils";
import {
  BriefcaseIcon,
  HistoryIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  TagIcon,
  WrenchIcon,
} from "lucide-react";
import { TramonaLogo } from "../_common/Header/TramonaLogo";

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
            "flex items-center gap-4 border-[3px] border-transparent px-4 py-2 font-medium",
            selected
              ? "border-r-black bg-zinc-200 text-black"
              : "text-zinc-700 hover:bg-zinc-200",
          )}
        >
          <Icon
            className={cn("size-6", selected ? "text-black" : "text-zinc-500")}
          />
          {children}
        </div>
      )}
    />
  );
}

const adminNavLinks = [
  { href: "/admin", name: "Overview", icon: LayoutDashboardIcon },
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
  { href: "/dashboard", name: "Overview", icon: LayoutDashboardIcon },
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
    <div className="sticky top-0 flex h-full w-64 flex-col border-r">
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
