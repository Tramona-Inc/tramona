import {
  ArrowLeftRight,
  BadgePercent,
  Briefcase,
  DollarSign,
  HistoryIcon,
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  Users2Icon,
  WrenchIcon,
  MessagesSquare,
  BriefcaseIcon,
  ClipboardIcon,
  UserIcon,
  SearchIcon,
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
  { href: "/", name: "Dashboard", icon: HomeIcon },
  { href: "/unclaimed-offers", name: "Explore", icon: SearchIcon },
  { href: "/", name: "Concierge", icon: UserIcon },
];

export const guestMobileNavHamburgerLinks = [
  { href: "/requests", name: "Requests", icon: BadgePercent },
  { href: "/my-trips", name: "My Trips", icon: Briefcase },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/chat-with-admin", name: "Concierge", icon: MessagesSquare },
];
