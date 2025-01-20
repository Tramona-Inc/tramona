import {
  BadgeHelp,
  HandshakeIcon,
  InfoIcon,
  LinkIcon,
  TvMinimalPlay,
  HeadsetIcon,
  ShieldCheckIcon,
  UsersIcon,
  LayoutDashboard,
  HouseIcon,
  HandCoins,
  SettingsIcon,
  CalendarIcon,
  LuggageIcon,
} from "lucide-react";
//  <---------------- DESKTOP LINKS ----------------->

// same for logged and unlogged
export const leftHeaderLinks = [
  { name: "Requests", href: "/requests", icon: LinkIcon },
  { name: "Trips", href: "/my-trips", icon: InfoIcon },
  { name: "Messages", href: "/messages", icon: InfoIcon },
];

//------- DROPDOWN LINKS ------
export const aboutMenuItems = [
  { href: "/how-it-works", title: "How it Works", icon: InfoIcon },
  { href: "/exclusive-offers", title: "Recent Deals", icon: HandshakeIcon },
  { href: "/faq", title: "FAQ", icon: BadgeHelp },
  { href: "/demo", title: "Demo", icon: TvMinimalPlay },
  { href: "/partner-with-tramona", title: "Partnerships", icon: UsersIcon },
];

export const helpMenuItems = [
  { href: "/help-center", title: "24/7 Support", icon: HeadsetIcon },
  {
    href: "/rebooking-guarantee",
    title: "100% Re-booking Guarantee",
    icon: ShieldCheckIcon,
  },
];

//  ------------MOBILE LINKS--------

export const browseLinkItems = [
  //mobile only
  { href: "/how-it-works", title: "How it Works", icon: InfoIcon },
  { href: "/exclusive-offers", title: "Recent Deals", icon: HandshakeIcon },
  { href: "/demo", title: "Demo", icon: TvMinimalPlay },
  {
    href: "/partner-with-tramona",
    title: "Partnerships",
    icon: UsersIcon,
  },
];

export const aboutLinkItems = [
  //mobile only
  { href: "/faq", title: "FAQ", icon: BadgeHelp },
  { href: "/help-center", title: "24/7 Support", icon: HeadsetIcon },
  {
    href: "/rebooking-guarantee",
    title: "100% Re-booking Guarantee",
    icon: ShieldCheckIcon,
  },
];

// <----------- HOST MOBILE LINKS ---------->
export const hostManageLinks = [
  { href: "/host", title: "Overview", icon: LayoutDashboard },
  { href: "/host/calendar", title: "Calendar", icon: CalendarIcon },
  { href: "/host/properties", title: "Listings", icon: HouseIcon },
  { href: "/host/stays", title: "Stays", icon: LuggageIcon },
  { href: "/host/teams", title: "Team", icon: UsersIcon },
];

export const hostAccountLinks = [
  { href: "/host/finances", title: "Earnings", icon: HandCoins },
  {
    href: "/settings/personal-information",
    title: "Settings",
    icon: SettingsIcon,
  },
];

// ----------- HOST DESKTOP LINKS

export const hostCenterHeaderLinks = [
  { name: "Overview", href: "/host" },
  { name: "Calendar", href: "/host/calendar" },
  { name: "Listings", href: "/host/properties" },
  { name: "Messaging", href: "/host/messages" },
  { name: "Requests", href: "/host/requests" },
  { name: "Stays", href: "/host/stays" },
  { name: "Finances", href: "/host/finances" },
  { name: "Team", href: "/host/teams" },
];
