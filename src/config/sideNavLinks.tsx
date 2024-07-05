import { icon } from "leaflet";
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
  {
    href: "/admin/past-property-offers",
    name: "Past Property Offers",
    icon: Briefcase,
  },
  { href: "/admin/utility", name: "Utility", icon: WrenchIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/requests", name: "Switch To Guest", icon: ArrowLeftRight },
];

export const hostMobileNavLinks = [
  { href: "/host", name: "Dashboard", icon: LayoutDashboardIcon },
  {
    href: "/host/requests",
    name: "Requests",
    icon: BadgePercent,
  },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/host/properties", name: "Properties", icon: HomeIcon },
];

export const hostNavLinks = [
  ...hostMobileNavLinks,
  { href: "/host/payout", name: "Payout", icon: DollarSign },
];

export const guestMobileNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  { href: "/explore", name: "Explore", icon: Search },
  { href: "/requests", name: "Requests", icon: BadgePercent },
  { href: "/my-trips", name: "My Trips", icon: Briefcase },
];

export const guestNavLinks = [
  ...guestMobileNavLinks,
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

export const unloggedNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  { href: "/explore", name: "Explore", icon: Search },
];
