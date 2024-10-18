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
  { href: "/how-it-works", name: "Name your own price", icon: HomeIcon },
  { href: "/how-it-works", name: "Book it now", icon: MessagesSquare },
];

export const guestMobileNavHamburgerLinks = [
  { href: "/requests", name: "Requests", icon: BadgePercent },
  { href: "/my-trips", name: "My Trips", icon: Briefcase },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/chat-with-admin", name: "Concierge", icon: MessagesSquare },
];

export const unloggedMobileNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  { href: "/chat-with-admin", name: "Concierge", icon: MessagesSquare },
  { href: "/how-it-works", name: "Name your own price", icon: HomeIcon },
  { href: "/how-it-works", name: "Book it now", icon: MessagesSquare },
  // { href: "/link-input", name: "Link Input", icon: LinkIcon },
  // ...headerLinks,
];
