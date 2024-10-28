import {
  BadgeHelp,
  HandshakeIcon,
  Home,
  InfoIcon,
  LinkIcon,
  MessageCircleQuestion,
} from "lucide-react";

// same for logged and unlogged
export const headerLinks = [
  { name: "Book it now", href: "/how-it-works", icon: LinkIcon },
  { name: "Name your own price", href: "/how-it-works", icon: InfoIcon },
];

// DESKTOP LINKS

export const unloggedCenterHeaderLinks = [
  { name: "How it works", href: "/how-it-works", icon: InfoIcon },
  { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
  { name: "For Hosts", href: "/why-list", icon: Home },
];

export const unloggedHamburgerLinksDesktop = [
  { name: "Recent Deals", href: "/exclusive-offers", icon: BadgeHelp },
  { name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
  {
    name: "100% Re booking guarantee",
    href: "/rebooking-guarantee",
    icon: MessageCircleQuestion,
  },
];

export const loggedCenterHeaderLinks = [
  { name: "How it works", href: "/how-it-works", icon: InfoIcon },
  { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
  { name: "For Hosts", href: "/why-list", icon: Home },
  { name: "Recent Deals", href: "/exclusive-offers", icon: BadgeHelp },
];

// MOBILE LINKS

export const unloggedHamburgerLinksMobile = [
  { name: "How it Works", href: "/how-it-works", icon: InfoIcon },
  { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
  { name: "For Hosts", href: "/why-list", icon: Home },
  { name: "Recent Deals", href: "/exclusive-offers", icon: HandshakeIcon },
  { name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
  { name: "100% Re booking guarantee", href: "/rebooking-guarantee", icon: BadgeHelp },
];

export const loggedHamburgerLinksMobile = [
  { name: "How it Works", href: "/how-it-works", icon: InfoIcon },
  { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
  { name: "For Hosts", href: "/why-list", icon: Home },
  { name: "Recent Deals", href: "/exclusive-offers", icon: HandshakeIcon },
  { name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
  { name: "100% Re booking guarantee", href: "/rebooking-guarantee", icon: BadgeHelp },
];

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
