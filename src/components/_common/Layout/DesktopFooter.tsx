import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

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
      className="block py-0.5 text-sm underline-offset-4 hover:underline"
      href={href}
    >
      {children}
    </Link>
  );
}

const DesktopFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" bg-black text-white md:block">
      <div className=" mx-auto flex w-11/12  justify-center px-4 py-3 text-xs lg:text-base">
        {/* <hr className="my-6 h-px border-none bg-neutral-300" /> */}
        <div className="flex w-full flex-col items-center justify-center gap-2 text-center md:flex-row md:justify-between">
          <div className="text-nowrap text-sm text-zinc-100 sm:mb-0">
            © {currentYear} Tramona. All rights reserved.
          </div>

          <div className="flex w-full flex-row justify-center gap-2 px-8 lg:-ml-20 sm:gap-4 lg:gap-8">
            <FooterLink href="/tos">Terms</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/auth/signup">Sign up</FooterLink>
            <FooterLink href="/auth/signin">Sign in</FooterLink>
            <FooterLink href="/support">Help</FooterLink>
          </div>

          <div className="flex gap-4">
            <FooterLink external href="https://www.instagram.com/shoptramona/">
              <Instagram size={18} strokeWidth={1.3} />
            </FooterLink>
            <FooterLink external href="https://www.facebook.com/ShopTramona">
              <Facebook size={18} strokeWidth={1.3} />
            </FooterLink>
            <FooterLink
              external
              href="https://www.linkedin.com/company/tramona/"
            >
              <Linkedin size={18} strokeWidth={1.3} />
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
