import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    label: "Terms",
    href: "/tos",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Sign up",
    href: "/auth/signup",
  },
  {
    label: "Sign in",
    href: "/auth/signin",
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

export default function DesktopFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="z-50 bg-zinc-900 px-4 text-sm text-zinc-300">
      <div className="flex items-center">
        <p className="flex-1">© {currentYear} Tramona. All rights reserved.</p>
        {footerLinks.map((link) => (
          <Link
            className="px-4 py-3 underline-offset-2 hover:underline"
            key={link.href}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
        <div className="flex flex-1 justify-end">
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
    </footer>
  );
}
