import {
  BadgeHelp,
  BadgeInfo,
  HandshakeIcon,
  Home,
  InfoIcon,
  LinkIcon,
  MessageCircleQuestion,
  MessagesSquare,
} from "lucide-react";

export const headerLinks = [
  { name: "Link Input", href: "/link-input", icon: LinkIcon },
  { name: "How it works", href: "/how-it-works", icon: InfoIcon },
  { name: "Recent Deals", href: "/exclusive-offers", icon: HandshakeIcon },
  { name: "For Hosts", href: "/why-list", icon: Home },
  // {
  //   name: "Unclaimed Offers",
  //   href: "/unclaimed-offers",
  //   icon: BadgePercentIcon,
  // },
];

export const hamburgerLinksDesktop = [
  { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
  { name: "Contact", href: "/support", icon: BadgeInfo },
  //{ name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
];

export const unloggedHamburgerLinksMobile = [
  //{ name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
  { name: "How it Works", href: "/how-it-works", icon: InfoIcon },
  { name: "For Hosts", href: "/why-list", icon: Home },
  { name: "Recent Deals", href: "/exclusive-offers", icon: HandshakeIcon },
];

export const hamburgerLinksMobile = [...headerLinks];
