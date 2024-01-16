import Link from 'next/link';
import type { ReactNode } from 'react';
import { useState } from 'react';

function FooterLink({ children, href, external = false }: { children: ReactNode; href: string; external?: boolean }) {
  return (
    <Link
      target={external ? '_blank' : '_self'}
      className="block py-0.5 underline-offset-4 hover:underline"
      href={href}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const [submittedEmail, setSubmittedEmail] = useState(false);

  return (
    <footer className="flex items-stretch bg-zinc-900">
      <div className="flex-1">
        <div className="mx-4 my-8 flex flex-col px-4 lg:mx-20">
          <div>
            <p className="pb-2 text-lg font-medium text-zinc-300">Newsletter</p>
            <form
              onSubmit={e => {
                e.preventDefault();
                // const formData = new FormData(e.currentTarget);
                // const email = formData.get('email');
                setSubmittedEmail(true);

                e.currentTarget.reset();
              }}
              className="relative max-w-lg"
            >
              <input
                type="email"
                name="email"
                required
                placeholder={submittedEmail ? "Thanks, we'll be in touch!" : 'Your Email'}
                className="w-full rounded-full bg-zinc-700 px-6 py-3 font-semibold text-white placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="absolute inset-y-1 right-1 h-10 w-10 rounded-full bg-black text-xl text-white"
              >
                &rarr;
              </button>
            </form>
          </div>
          <div className="my-8 flex flex-col text-zinc-300 lg:flex-row">
            <div className="flex-1">
              <FooterLink href="/faq">FAQ</FooterLink>

              <FooterLink href="/sign-up">Sign up</FooterLink>
              <FooterLink href="/sign-in">Log in</FooterLink>
            </div>
            <div className="flex-1">
              <FooterLink href="/support">Contact us</FooterLink>
              <FooterLink href="/support">Request a Feature</FooterLink>
              <FooterLink href="/support">Report a Bug</FooterLink>
            </div>
            <div className="flex-1">
              <FooterLink external href="https://www.instagram.com/shoptramona/">
                Instagram
              </FooterLink>

              <FooterLink external href="https://www.facebook.com/ShopTramona?mibextid=LQQJ4d">
                Facebook
              </FooterLink>

              <FooterLink external href="https://www.linkedin.com/company/tramona/">
                LinkedIn
              </FooterLink>
            </div>
          </div>
          <div className="mx-auto text-zinc-500">
            <FooterLink href="/">Tramona Inc.</FooterLink>
          </div>
        </div>
      </div>
      <div className="hidden w-64 bg-[url(/assets/images/footer-img.png)] bg-cover bg-center sm:block" />
    </footer>
  );
}
