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
} from "lucide-react";
import { headerLinks } from "./headerNavLinks";

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

export const guestNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  { href: "/requests", name: "Requests", icon: BadgePercent },
  { href: "/my-trips", name: "My Trips", icon: Briefcase },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

export const unloggedNavLinks = [
  { href: "/", name: "Home", icon: HomeIcon },
  { href: "/chat-with-admin", name: "Concierge", icon: MessagesSquare },
  ...headerLinks,
];
