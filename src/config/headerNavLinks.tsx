import {
  BadgeHelp,
  HandshakeIcon,
  Home,
  InfoIcon,
  LinkIcon,
  MessageCircleQuestion,
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
  { href: "/how-it-works", title: "How it Works" },
  { href: "/exclusive-offers", title: "Recent Deals" },
  { href: "/faq", title: "FAQ" },
  { href: "/demo", title: "Demo" },
  { href: "/partner-with-tramona", title: "Partnerships" },
];

export const helpMenuItems = [
  { href: "/help-center", title: "24/7 Support" },
  { href: "/rebooking-guarantee", title: "100% Re-booking Guarantee" },
];

//  ------------MOBILE LINKS--------

export const browseLinkItems = [
  //mobile only
  { href: "/how-it-works", title: "How it Works" },
  { href: "/exclusive-offers", title: "Recent Deals" },
  { href: "/demo", title: "Demo" },
  { href: "/partner-with-tramona", title: "Partnerships" },
];

export const aboutLinkItems = [
  //mobile only
  { href: "/faq", title: "FAQ" },
  { href: "/help-center", title: "24/7 Support" },
  { href: "/rebooking-guarantee", title: "100% Re-booking Guarantee" },
];

// <----------- HOST MOBILE LINKS ---------->
export const hostManageLinks = [
  { href: "/host", title: "Dashboard" },
  { href: "listings", title: "Properties" },
  { href: "team", title: "Team" },
];

export const hostAccountLinks = [
  { href: "finances", title: "Earnings" },
  { href: "settings", title: "Settings" },
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
  { name: "Team", href: "/host/team" },
];
