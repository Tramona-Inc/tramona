import {
  BadgeHelp,
  BadgeInfo,
  DoorOpen,
  Home,
  Menu,
  MessageCircleQuestion,
} from "lucide-react";

export const headerLinks1 = [
  // { name: "Link Input", href: "/link-input" },
  { name: "Recent Deals", href: "/exclusive-offers" },
  //{ name: "Unclaimed Offers", href: "/unclaimed-offers" },
];

export const headerLinks2 = [
  { name: "How it works", href: "/how-it-works" },
  { name: "24/7 Support", href: "/help-center" },
];

export const hamburgerLinksDesktop = [
  { name: "FAQ", href: "/faq", icon: <MessageCircleQuestion /> },
  { name: "Contact", href: "/support", icon: <BadgeInfo /> },
];

export const hamburgerLinksMobile = [
  { name: "Become a host", href: "/for-hosts", icon: <Home /> },
  { name: "How it works", href: "/how-it-works", icon: <Menu /> },
  { name: "24/7 Support", href: "/help-center", icon: <BadgeHelp /> },
];

export const hamburgerLinksHostMobileToTraveler = [
  { name: "Switch to Traveler", href: "/", icon: <DoorOpen /> },
  { name: "24/7 Support", href: "/help-center", icon: <BadgeHelp /> },
];

export const hamburgerLinksHostMobileToHost = [
  { name: "Switch to Host", href: "/host", icon: <DoorOpen /> },
  { name: "24/7 Support", href: "/help-center", icon: <BadgeHelp /> },
];
