import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { type Session } from "next-auth";
import Link from "next/link";
import { api } from "@/utils/api";
import { Badge } from "./ui/badge";

export default function HeaderTopRight() {
  const { data: session, status } = useSession();

  switch (status) {
    case "loading":
      return <div className="h-10" />;
    case "unauthenticated":
      return (
        <>
          <LogInBtn />
          <SignUpBtn />
        </>
      );
    case "authenticated":
      return <AvatarDropdown session={session} />;
  }
}

function LogInBtn() {
  return (
    <Button
      className="rounded-full"
      variant="darkOutline"
      onClick={() => signIn()}
    >
      Log in
    </Button>
  );
}

function SignUpBtn() {
  return (
    <Button
      className="rounded-full"
      variant="darkPrimary"
      onClick={() => signIn()}
    >
      Sign up
    </Button>
  );
}

function AvatarDropdown({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserAvatar
          name={session.user?.name}
          email={session.user?.email}
          image={session.user?.image}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 py-4 text-lg font-medium"
      >
        <DropdownTop session={session} />
        <DropdownMenuSeparator />
        <DropdownLink href="/">Home</DropdownLink>
        <DropdownLink href="/requests">Your Requests</DropdownLink>
        <DropdownLink href="/profile">Profile</DropdownLink>
        <DropdownMenuSeparator />
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

function DropdownTop({ session }: { session: Session }) {
  const title = session.user.name ?? session.user.email ?? "Anonymous";
  const subtitle = session.user.name ? session.user.email : null;

  return (
    <div className="pb-1 pl-3">
      <p className="font-medium">
        {title}
        <span className="ml-2 inline-block -translate-y-0.5">
          <RoleBadge />
        </span>
      </p>

      {subtitle && <p className="text-sm text-zinc-600">{subtitle}</p>}
    </div>
  );
}

function RoleBadge() {
  const { data } = api.users.me.useQuery();
  if (!data) return null;

  return (
    <Badge variant="secondary" size="sm">
      {data.role.toLocaleUpperCase()}
    </Badge>
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
