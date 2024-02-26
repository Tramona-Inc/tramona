import { cn } from "@/utils/utils";
import {
  BriefcaseIcon,
  HomeIcon,
  LogOutIcon,
  TagIcon,
  UserCheck2Icon,
  UserCheckIcon,
  UserCogIcon,
  type LucideProps,
  // MessageSquareText,
  // DollarSignIcon,
} from "lucide-react";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ForwardRefExoticComponent } from "react";
import { Badge } from "../../../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import UserAvatar from "../../UserAvatar";

function DropdownTop({ session }: { session: Session }) {
  const title = session.user.name ?? session.user.email ?? "Anonymous";
  const subtitle = session.user.name ? session.user.email : null;

  return (
    <div className="flex items-center gap-2 pb-1 pl-3">
      <UserAvatar {...session.user} />
      <div className="flex-1 -space-y-1">
        <div className="font-medium">
          {title}

          {session.user.role !== "guest" && (
            <Badge
              variant="secondary"
              size="sm"
              className="ml-2 -translate-y-0.5 uppercase"
            >
              {session.user.role}
            </Badge>
          )}
        </div>

        {subtitle && <p className="text-sm text-zinc-600">{subtitle}</p>}
      </div>
    </div>
  );
}

function DropdownLink({
  children,
  href,
  Icon,
  hasChildPages = false,
}: React.PropsWithChildren<{
  href: string;
  Icon: ForwardRefExoticComponent<LucideProps>;
  hasChildPages?: boolean;
}>) {
  const pathname = usePathname();
  const isSelected = hasChildPages
    ? pathname.startsWith(href)
    : pathname === href;

  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 py-2 pl-3",
          isSelected
            ? "pointer-events-none border-2 border-l-black bg-accent"
            : "",
        )}
      >
        <Icon
          className={cn("size-5", isSelected ? "opacity-100" : "opacity-40")}
        />{" "}
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
      <DropdownMenuContent align="end" className="w-80 py-4 font-medium">
        <DropdownTop session={session} />
        <DropdownMenuSeparator />
        {session.user.role === "admin" && (
          <>
            <DropdownLink href="/admin" Icon={UserCheckIcon}>
              Admin Dashboard
            </DropdownLink>
            <DropdownMenuSeparator />
          </>
        )}
        {session.user.role === "host" && (
          <>
            <DropdownLink href="/host" Icon={UserCheck2Icon}>
              Host Dashboard
            </DropdownLink>
            <DropdownMenuSeparator />
          </>
        )}
        {session.user.role === "guest" && (
          <>
            <DropdownLink href="/for-hosts/sign-up" Icon={UserCheck2Icon}>
              Become a Host
            </DropdownLink>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownLink href="/" Icon={HomeIcon}>
          Home
        </DropdownLink>
        <DropdownLink href="/requests" Icon={TagIcon}>
          Your Requests
        </DropdownLink>
        <DropdownLink href="/my-trips" Icon={BriefcaseIcon}>
          My trips
        </DropdownLink>
        {/* <DropdownLink href="/messages" Icon={MessageSquareText}>
          Messages
          <Badge variant="secondary" size="sm">
            5
          </Badge>
        </DropdownLink> */}
        <DropdownLink href="/profile" Icon={UserCogIcon}>
          Profile
        </DropdownLink>
        <DropdownMenuSeparator />
        {/* <>
          <DropdownLink href="/account" Icon={DollarSignIcon}>
            Cashback Balance: <span className="text-primary">$112</span>
          </DropdownLink>
          <DropdownMenuSeparator />
        </> */}

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
          className="group flex w-full cursor-pointer items-center gap-2 py-2 pl-3 text-destructive focus:bg-destructive focus:text-white"
        >
          <LogOutIcon className="opacity-50 group-focus:opacity-100" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
