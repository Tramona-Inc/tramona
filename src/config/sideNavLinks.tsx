import {
  ArrowLeftRight,
  BadgePercent,
  Briefcase,
  DollarSign,
  Fence,
  Handshake,
  HistoryIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  MessageSquareMore,
  Search,
  WrenchIcon,
} from "lucide-react";

export const adminNavLinks = [
  { href: "/admin", name: "Dashboard", icon: LayoutDashboardIcon },
  {
    href: "/admin/incoming-requests",
    name: "Incoming Requests",
    icon: InboxIcon,
  },
  { href: "/admin/past-requests", name: "Past Requests", icon: HistoryIcon },
  { href: "/admin/utility", name: "Utility", icon: WrenchIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/dashboard", name: "Switch To Guest", icon: ArrowLeftRight },
];

export const hostMobileNavLinks = [
  { href: "/host", name: "Dashboard", icon: LayoutDashboardIcon },
  {
    href: "/host/incoming-request",
    name: "Requests",
    icon: BadgePercent,
  },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/host/properties", name: "stays", icon: Briefcase },
];
export const hostNavLinks = [
  { href: "/host", name: "Overview", icon: LayoutDashboardIcon },
  {
    href: "/host/incoming-request",
    name: "Incoming Requests",
    icon: Handshake,
  },
  { href: "/host/properties", name: "Properties", icon: Fence },
  { href: "/host/payout", name: "Payout", icon: DollarSign },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

export const guestNavLinks = [
  { href: "/", name: "Explore", icon: Search },
  { href: "/requests", name: "Requests", icon: BadgePercent },
  { href: "/messages", name: "Messages", icon: MessageSquareMore },
  { href: "/my-trips", name: "My Trips", icon: Briefcase },
];
