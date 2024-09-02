import {
  BadgeHelp,
  BadgeInfo,
  BadgePercentIcon,
  HandshakeIcon,
  Home,
  InfoIcon,
  MessageCircleQuestion,
} from "lucide-react";

export const headerLinks = [
  { name: "How it works", href: "/how-it-works", icon: InfoIcon },
  // { name: "Link Input", href: "/link-input", icon: LinkIcon },
  { name: "Recent Deals", href: "/exclusive-offers", icon: HandshakeIcon },
  { name: "For Hosts", href: "/why-list", icon: Home },
  {
    name: "Unclaimed Offers",
    href: "/unclaimed-offers",
    icon: BadgePercentIcon,
  },
];

export const hamburgerLinksDesktop = [
  { name: "FAQ", href: "/faq", icon: MessageCircleQuestion },
  { name: "Contact", href: "/support", icon: BadgeInfo },
  { name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
];

export const unloggedHamburgerLinksMobile = [
  { name: "24/7 Support", href: "/help-center", icon: BadgeHelp },
];

export const hamburgerLinksMobile = [
  ...headerLinks,
  ...unloggedHamburgerLinksMobile,
];
