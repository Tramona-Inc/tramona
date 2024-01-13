import Link from "next/link";
import type { ReactNode } from "react";
// TODO import TramonaIcon from './icons/tramona';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signIn, useSession, signOut } from "next-auth/react";
import Icons from "@/ui/icons";

function DropdownLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <DropdownMenuItem>
      <Link href={href} className="flex w-full items-center gap-2 py-2 pl-3">
        {children}
      </Link>
    </DropdownMenuItem>
  );
}

function ProfileDropdown() {
  const onSignOut = () => signOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center gap-4 rounded-full border border-zinc-300 px-4 py-2 hover:bg-zinc-100 sm:py-3">
          <Icons iconName="menu" />
          <Icons iconName="user" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 py-4 text-lg font-medium"
      >
        <DropdownLink href="/">Home</DropdownLink>
        <DropdownLink href="/requests">Your Requests</DropdownLink>
        <DropdownLink href="/profile">Profile</DropdownLink>
        {/* <DropdownLink href='/profile'>Profile Settings</DropdownLink> */}
        <DropdownMenuSeparator />
        <DropdownLink href="/forhosts">For Hosts</DropdownLink>
        <DropdownLink href="/partners">Partnership Program</DropdownLink>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            onClick={onSignOut}
            className="flex w-full cursor-pointer items-center gap-2 py-2 pl-3 text-destructive"
          >
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  const { data: session } = useSession();

  return (
    // fixed vs sticky
    <header className="fixed top-0 z-50 w-full">
      <div className="flex items-center gap-4 bg-white px-4 py-2 text-sm shadow-md sm:px-8 sm:py-4 sm:text-base">
        <Link
          href="/"
          className="mr-auto flex items-center gap-2 text-2xl font-bold"
        >
          {/* <TramonaIcon /> Tramona */}
        </Link>
        <Link
          href="/partners"
          className="hidden items-center gap-2 rounded-full border border-zinc-300 py-2 pl-4 pr-6 font-semibold hover:bg-black/5 sm:flex sm:py-3"
        >
          <Icons iconName="star" /> Refer & Earn
        </Link>

        {session ? (
          <ProfileDropdown />
        ) : (
          <>
            <button
              onClick={() => void signIn()}
              className="inline-flex items-center whitespace-nowrap rounded-full border border-zinc-300 px-4 py-2 text-center font-semibold hover:bg-black/5 sm:px-6 sm:py-3"
            >
              Log in
            </button>
            <Link
              href="/signup"
              className="inline-flex items-center whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-center font-semibold text-white hover:bg-black/90 sm:px-6 sm:py-3"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
