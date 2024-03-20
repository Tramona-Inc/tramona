import type { ReactNode } from "react";
import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";

function FooterLink({
  children,
  href,
  external = false,
}: {
  children: ReactNode;
  href: string;
  external?: boolean;
}) {
  return (
    <Link
      target={external ? "_blank" : "_self"}
      className="block py-0.5 underline-offset-4 hover:underline"
      href={href}
    >
      {children}
    </Link>
  );
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:items-start">
          <div className="mt-6 flex w-full flex-col items-start gap-2 px-8 sm:flex-row sm:justify-center md:gap-8">
            <FooterLink href="/auth/signup">Sign up</FooterLink>
            <FooterLink href="/auth/signin">Sign in</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/support">Contact us</FooterLink>
            <FooterLink href="/support">Request a feature</FooterLink>
            <FooterLink href="/support">Report a bug</FooterLink>
          </div>
        </div>
        <hr className="my-6 h-px border-none bg-neutral-600" />
        <div className="flex w-full flex-col items-center justify-between text-center sm:flex-row">
          <div className="mb-4 text-sm text-gray-400 sm:mb-0">
            © {currentYear} Tramona. All rights reserved.
          </div>
          <div className="flex gap-4">
            <FooterLink external href="https://www.instagram.com/shoptramona/">
              <Instagram size={20} />
            </FooterLink>
            <FooterLink external href="https://www.facebook.com/ShopTramona">
              <Facebook size={20} />
            </FooterLink>
            <FooterLink
              external
              href="https://www.linkedin.com/company/tramona/"
            >
              <Linkedin size={20} />
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
