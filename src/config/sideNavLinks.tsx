import {
  ArrowLeftRight,
  BadgePercent,
  Briefcase,
  DollarSign,
  Fence,
  Handshake,
  HistoryIcon,
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
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
  {
    href: "/admin/incoming-property-offers",
    name: "Incoming Property Offers",
    icon: HomeIcon,
  },
  { href: "/admin/utility", name: "Utility", icon: WrenchIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/requests", name: "Switch To Guest", icon: ArrowLeftRight },
];

export const hostMobileNavLinks = [
  { href: "/host", name: "Dashboard", icon: LayoutDashboardIcon },
  {
    href: "/host/incoming-requests",
    name: "Requests",
    icon: BadgePercent,
  },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/host/properties", name: "stays", icon: Briefcase },
];
export const hostNavLinks = [
  { href: "/host", name: "Overview", icon: LayoutDashboardIcon },
  {
    href: "/host/incoming-requests",
    name: "Incoming Requests",
    icon: Handshake,
  },
  { href: "/host/properties", name: "Properties", icon: Fence },
  { href: "/host/payout", name: "Payout", icon: DollarSign },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

export const guestNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  { href: "/explore", name: "Explore", icon: Search },
  { href: "/requests", name: "Requests", icon: BadgePercent },
  { href: "/my-trips", name: "My Trips", icon: Briefcase },
];

export const unloggedNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  { href: "/explore", name: "Explore", icon: Search },
];
