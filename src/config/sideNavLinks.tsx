import {
  ArrowLeftRight,
  BadgePercent,
  Briefcase,
  DollarSign,
  HandshakeIcon,
  HistoryIcon,
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  Users2Icon,
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
  {
    href: "/host/requests",
    name: "Requests",
    icon: BadgePercent,
  },
  { href: "/host/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/host/properties", name: "Properties", icon: HomeIcon },
  { href: "/host/stays", name: "Stays", icon: Briefcase },
  { href: "/host/finances", name: "Finances", icon: DollarSign },
  { href: "/host/team", name: "Team", icon: Users2Icon },
];

export const guestMobileNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  // { href: "/explore", name: "Explore", icon: Search },
  { href: "/requests", name: "Requests", icon: BadgePercent },
  { href: "/my-trips", name: "My Trips", icon: Briefcase },
];

export const guestNavLinks = [
  ...guestMobileNavLinks,
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

export const unloggedNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  // { href: "/link-input", name: "Link Input", icon: LinkIcon },
  { href: "/exclusive-offers", name: "Recent Deals", icon: HandshakeIcon },
  // { href: "/explore", name: "Explore", icon: Search },
];
