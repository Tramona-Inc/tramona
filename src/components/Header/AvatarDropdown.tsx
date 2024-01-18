import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAvatar from "../UserAvatar";
import { type Session } from "next-auth";
import Link from "next/link";
import { Badge } from "../ui/badge";

function DropdownTop({ session }: { session: Session }) {
  const title = session.user.name ?? session.user.email ?? "Anonymous";
  const subtitle = session.user.name ? session.user.email : null;

  return (
    <div className="pb-1 pl-3">
      <div className="font-medium">
        {title}

        <Badge
          variant="secondary"
          size="sm"
          className="ml-2 -translate-y-0.5 uppercase"
        >
          {session.user.role}
        </Badge>
      </div>

      {subtitle && <p className="text-sm text-zinc-600">{subtitle}</p>}
    </div>
  );
}

function DropdownLink({
  children,
  href,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <DropdownMenuItem>
      <Link href={href} className="flex w-full items-center gap-2 py-2 pl-3">
        {children}
      </Link>
    </DropdownMenuItem>
  );
}

export default function AvatarDropdown({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserAvatar
          name={session.user.name}
          email={session.user.email}
          image={session.user.image}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 py-4 text-lg font-medium"
      >
        <DropdownTop session={session} />
        <DropdownMenuSeparator />
        {session.user.role === "admin" && (
          <>
            <DropdownLink href="/admin">Admin Dashboard</DropdownLink>
            <DropdownMenuSeparator />
          </>
        )}
        {session.user.role === "host" && (
          <>
            <DropdownLink href="/host">Host Dashboard</DropdownLink>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownLink href="/">Home</DropdownLink>
        <DropdownLink href="/requests">Your Requests</DropdownLink>
        <DropdownLink href="/profile">Profile</DropdownLink>
        <DropdownMenuSeparator />
        {session.user.role === "guest" && (
          <>
            <DropdownLink href="/account">
              Cashback Balance: <span className="text-primary">$112</span>
            </DropdownLink>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem>
          <button
            onClick={() => signOut()}
            className="flex w-full cursor-pointer items-center gap-2 py-2 pl-3 text-destructive"
          >
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
