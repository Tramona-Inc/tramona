import {
  ArrowLeftRight,
  BadgePercent,
  Briefcase,
  HistoryIcon,
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  WrenchIcon,
  MessagesSquare,
  BriefcaseIcon,
  ClipboardIcon,
  UserIcon,
  MoreHorizontal,
} from "lucide-react";

export const adminNavLinks = [
  { href: "/admin", name: "Dashboard", icon: LayoutDashboardIcon },
  {
    href: "/admin/trips/all-trips",
    name: "All Trips",
    icon: BriefcaseIcon,
  },
  {
    href: "/admin/incoming-requests",
    name: "Incoming Requests",
    icon: InboxIcon,
  },
  { href: "/admin/past-requests", name: "Past Requests", icon: HistoryIcon },
  { href: "/admin/utility", name: "Utility", icon: WrenchIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/requests", name: "Switch To Guest", icon: ArrowLeftRight },
];

export const guestDesktopNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  { href: "/requests", name: "Requests", icon: BadgePercent },
  { href: "/my-trips", name: "My Trips", icon: Briefcase },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

// MOBILE LINKS

export const hostMobileNavLinks = [
  {
    href: "/host",
    name: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/host/requests",
    name: "Requests",
    icon: ClipboardIcon,
  },
  { href: "/host/messages", name: "Messages", icon: MessageCircleIcon },
];

export const guestMobileNavLinks = [
  { href: "/chat-with-admin", name: "Concierge", icon: UserIcon },
  { href: "/", name: "Dashboard", icon: HomeIcon },
  { href: "#", name: "More", icon: MoreHorizontal },
];

export const guestMobileNavHamburgerLinks = [
  { href: "/requests", name: "Requests", icon: BadgePercent },
  { href: "/my-trips", name: "My Trips", icon: Briefcase },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/chat-with-admin", name: "Concierge", icon: MessagesSquare },
];

export const moreMenuLinks = [
  { href: "/my-trips", name: "Stays", icon: HomeIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/requests", name: "Requests", icon: ClipboardIcon },
];
