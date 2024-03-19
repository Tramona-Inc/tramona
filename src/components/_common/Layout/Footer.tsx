import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";

type FooterLinkProps = {
  children: React.ReactNode;
  href: string;
  external?: boolean;
};

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
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle the email submission
    setEmail("");
  };
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:items-start">
          {/* <p className="font-base text-base md:text-lg">
            Subscribe to our newsletter
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-2 flex w-full sm:max-w-xs"
          >
            <input
              type="email"
              placeholder="Your email"
              className="rounded-l-full bg-gray-800 p-2 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-r-full bg-gray-800 p-2 text-white transition duration-300 hover:bg-gray-700"
            >
              &rarr;
            </button>
          </form> */}
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
