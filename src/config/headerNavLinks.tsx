import {
  BadgeHelp,
  BadgeInfo,
  HandshakeIcon,
  Home,
  InfoIcon,
  LinkIcon,
  MessageCircleQuestion,
} from "lucide-react";

export const headerLinks = [
  { name: "Book it now", href: "/how-it-works", icon: LinkIcon },
  { name: "Name your own price", href: "/how-it-works", icon: InfoIcon },
  // { name: "Link Input", href: "/link-input", icon: LinkIcon },
  // { name: "How it works", href: "/how-it-works", icon: InfoIcon },
  // { name: "Recent Deals", href: "/exclusive-offers", icon: HandshakeIcon },
  // { name: "For Hosts", href: "/why-list", icon: Home },
  // { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
  // {
  //   name: "Unclaimed Offers",
  //   href: "/unclaimed-offers",
  //   icon: BadgePercentIcon,
  // },
];

export const centerHeaderLinks = [
  { name: "How it works", href: "/how-it-works", icon: InfoIcon },
  { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
  { name: "For Hosts", href: "/why-list", icon: Home },
  { name: "Recent Deals", href: "/exclusive-offers", icon: HandshakeIcon },
];

export const hamburgerLinksDesktop = [
  { name: "Contact", href: "/support", icon: BadgeInfo },
  { name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
  {
    name: "100% Re booking guarantee",
    href: "/faq",
    icon: MessageCircleQuestion,
  },
];

export const unloggedHamburgerLinksMobile = [
  { name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
  { name: "How it Works", href: "/how-it-works", icon: InfoIcon },
  { name: "For Hosts", href: "/why-list", icon: Home },
  { name: "Recent Deals", href: "/exclusive-offers", icon: HandshakeIcon },
  { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
];

export const hamburgerLinksMobile = [
  { name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
  { name: "Link Input", href: "/link-input", icon: LinkIcon },
  { name: "How it works", href: "/how-it-works", icon: InfoIcon },
  { name: "For Hosts", href: "/why-list", icon: Home },
  { name: "Recent Deals", href: "/exclusive-offers", icon: HandshakeIcon },
  { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
];
