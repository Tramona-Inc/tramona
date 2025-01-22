import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    label: "Terms",
    href: "/tos",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Help",
    href: "/help-center",
  },
];

const footerSocials = [
  {
    href: "https://www.instagram.com/shoptramona/",
    Icon: Instagram,
  },
  {
    href: "https://www.facebook.com/ShopTramona",
    Icon: Facebook,
  },
  {
    href: "https://www.linkedin.com/company/tramona/",
    Icon: Linkedin,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinkComponents = footerLinks.map((link) => (
    <Link
      className="p-3 underline-offset-2 hover:underline"
      key={link.href}
      href={link.href}
    >
      {link.label}
    </Link>
  ));

  return (
    <footer className="z-50 hidden overflow-hidden bg-zinc-900 px-4 py-2 text-sm text-zinc-300 lg:block">
      <div className="flex items-center">
        <p className="flex-1">© {currentYear} Tramona. All rights reserved.</p>
        <div className="hidden md:contents">{footerLinkComponents}</div>
        <div className="flex justify-end md:flex-1">
          {footerSocials.map(({ href, Icon }) => (
            <Link
              className="rounded-md p-2 hover:bg-white/10"
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              key={href}
            >
              <Icon size={18} strokeWidth={1.3} />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center md:hidden">
        {footerLinkComponents}
      </div>
    </footer>
  );
}
