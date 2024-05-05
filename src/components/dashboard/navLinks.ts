import {
  ArrowLeftRight,
  DollarSign,
  Handshake,
  FenceIcon,
  HistoryIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  TagIcon,
  WrenchIcon,
  HomeIcon,
  Users2Icon,
  UploadIcon,
} from "lucide-react";
import SuitcaseIcon from "../_icons/SuitcaseIcon";
import { type SidebarLinkProps } from "./SidebarLink";

export const adminNavLinks: SidebarLinkProps[] = [
  {
    href: "/admin",
    name: "Dashboard",
    icon: LayoutDashboardIcon,
    noChildren: true,
  },
  {
    href: "/admin/incoming-requests",
    name: "Incoming Requests",
    icon: InboxIcon,
    noChildren: false,
  },
  {
    href: "/admin/past-requests",
    name: "Past Requests",
    icon: HistoryIcon,
    noChildren: false,
  },
  {
    href: "/admin/utility",
    name: "Utility",
    icon: WrenchIcon,
    noChildren: false,
  },
  {
    href: "/messages",
    name: "Messages",
    icon: MessageCircleIcon,
    noChildren: false,
  },
  {
    href: "/requests",
    name: "Switch To Guest",
    icon: ArrowLeftRight,
    noChildren: false,
  },
  {
    href: "/admin/property-upload",
    name: "Property Upload",
    icon: UploadIcon,
    noChildren: false,
  },
];
export const hostNavLinks: SidebarLinkProps[] = [
  {
    href: "/host",
    name: "Dashboard",
    icon: LayoutDashboardIcon,
    noChildren: true,
  },
  {
    href: "/host/requests",
    name: "Incoming Requests",
    icon: Handshake,
    noChildren: false,
  },
  {
    href: "/host/properties",
    name: "Properties",
    icon: FenceIcon,
    noChildren: false,
  },
  { href: "/host/payout", name: "Payout", icon: DollarSign, noChildren: false },
  { href: "/host/team", name: "Team", icon: Users2Icon, noChildren: false },
  {
    href: "/messages",
    name: "Messages",
    icon: MessageCircleIcon,
    noChildren: false,
  },
];
export const guestNavLinks: SidebarLinkProps[] = [
  { href: "/", name: "Home", icon: HomeIcon, noChildren: false },
  {
    href: "/requests",
    name: "Requests & Offers",
    icon: TagIcon,
    noChildren: false,
  },
  {
    href: "/my-trips",
    name: "My Trips",
    icon: SuitcaseIcon,
    noChildren: false,
  },
  {
    href: "/messages",
    name: "Messages",
    icon: MessageCircleIcon,
    noChildren: false,
  },
];
