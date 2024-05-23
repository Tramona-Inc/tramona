import NavLink from "../_utils/NavLink";

import {
  adminNavLinks,
  guestNavLinks,
  hostNavLinks,
} from "@/config/sideNavLinks";
import { api } from "@/utils/api";
import { cn, plural } from "@/utils/utils";
import { ArrowLeftRight, Menu, Settings, Wallet, MessageSquareMore, ShieldQuestion, Contact, MessageCircleQuestion } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { TramonaLogo } from "../_common/Header/TramonaLogo";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function SidebarLink({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <NavLink
      href={href}
      render={({ selected }) => (
        <div
          className={cn(
            "relative flex transform items-center gap-4 p-4 text-center font-medium transition-all hover:translate-x-1 lg:flex-col lg:gap-1 lg:px-2 lg:py-3 lg:text-xs",
            selected ? "text-[#2F5BF6]" : "text-[#5B616D",
          )}
        >
          {/* {selected && (
            <motion.div
              layoutId="sidebar-indicator"
              transition={{ duration: 0.1, ease: "circOut" }}
              className="absolute inset-y-0 right-0 border-[3px] border-transparent border-r-black"
            />
          )} */}

          <Icon
            className={cn(
              "size-6 lg:size-8",
              selected ? "text-[#2F5BF6]" : "text-[#5B616D]",
            )}
          />

          {children}
        </div>
      )}
    />
  );
}

export default function Sidebar({
  type,
  withLogo = false,
}: {
  type: "admin" | "guest" | "host" | "unlogged";
  withLogo?: boolean;
}) {
  //using session to check user's role if the role is == admin "Switch to Admin link will appear"
  const { data: session } = useSession();

  const isAdmin = session && session.user.role === "admin";

  const navLinks =
    type === "admin"
      ? adminNavLinks
      : type === "host"
        ? hostNavLinks
        : isAdmin
          ? [
              ...guestNavLinks,
              { href: "/admin", name: "Switch To Admin", icon: ArrowLeftRight },
            ]
          : [
              ...guestNavLinks, 
              { href: "/messages", name: "Messages", icon: MessageSquareMore },
            ];

  const { data: totalUnreadMessages } =
    api.messages.getNumUnreadMessages.useQuery(undefined, {
      refetchInterval: 10000,
    });

  const notifyMe = useCallback(async () => {
    // Check if the browser supports notifications if (!("Notification" in window) || !totalUnreadMessages) return;

    // add && document.visibilityState !== 'visible' to show notification when person is not on chat screen
    if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const title = "Tramona Messages";
      const icon = "/assets/images/tramona-logo.jpeg";
      const body = `You have ${plural(totalUnreadMessages ?? 0, "unread message")}!`;
      new Notification(title, { body, icon });
      const notificationSound = new Audio("/assets/sounds/sound.mp3");
      void notificationSound.play();
    }
  }, [totalUnreadMessages]);

  useEffect(() => {
    totalUnreadMessages && notifyMe;
  }, [totalUnreadMessages, notifyMe]);

  return (
    <div className="sticky top-0 flex h-full w-64 flex-col lg:w-20">
      {withLogo && (
        <div className="p-3">
          <TramonaLogo />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center gap-2">
        {navLinks.map((link, index) => (
          <div key={index} className="relative">
            <SidebarLink href={link.href} icon={link.icon}>
              {link.name}
            </SidebarLink>
            {totalUnreadMessages !== undefined &&
              totalUnreadMessages > 0 &&
              link.name === "Messages" && (
                <div className="pointer-events-none absolute inset-y-3 right-3 flex flex-col justify-center lg:justify-start">
                  <Badge
                    className="min-w-5 text-center"
                    variant="solidRed"
                    size="sm"
                  >
                    {totalUnreadMessages}
                  </Badge>
                </div>
              )}
          </div>
        ))}
      </div>
      <div className="mb-6 text-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <Link href="/settings/personal-information">
                <DropdownMenuItem className="text-primary">
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </Link>
              <Link href="/account">
                <DropdownMenuItem className="text-primary">
                  <Wallet /> Refer and earn
                </DropdownMenuItem>
              </Link>
              <Link href="/how-it-works">
                <DropdownMenuItem className="text-primary">
                  <ShieldQuestion/>
                  How it works
                </DropdownMenuItem>
              </Link>
              <Link href="/faq">
                <DropdownMenuItem className="text-primary">
                  <MessageCircleQuestion/>
                  FAQ
                </DropdownMenuItem>
              </Link>
              <Link href="/support">
                <DropdownMenuItem className="text-primary">
                  <Contact/>
                  Contact
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* <button onClick={notifyMe}>NOTIFICATION</button>
      <button onClick={play}>Sound</button>
      <p>{`You have ${totalUnreadMessages ?? 0} unread message(s).`}</p> */}
    </div>
  );
}
