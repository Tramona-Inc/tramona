import { cn } from "@/utils/utils";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import TramonaIcon from "../../../_icons/TramonaIcon";
import NavLink from "../../../_utils/NavLink";
import HeaderTopRight from "./HeaderTopRight";

function HeaderLink({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <NavLink
      href={href}
      render={({ selected }) => (
        <div
          className={cn(
            "rounded-lg px-5 py-2 font-medium",
            selected ? "bg-black text-white" : "text-black hover:bg-zinc-200",
          )}
        >
          {children}
        </div>
      )}
    />
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center bg-white px-4 py-2 text-sm shadow-md sm:py-4 sm:text-base">
      <div className="flex flex-1 gap-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <TramonaIcon /> Tramona
        </Link>
      </div>

      <div className="hidden items-center justify-center gap-2 lg:flex">
        <HeaderLink href="/program">Refer and Earn</HeaderLink>
        <HeaderLink href="/for-hosts">For Hosts</HeaderLink>
        <HeaderLink href="/offers">Exclusive Offers</HeaderLink>
        <HeaderLink href="/feed">Social Feed</HeaderLink>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <HeaderTopRight />
      </div>
    </header>
  );
}
