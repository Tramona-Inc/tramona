import NavLink from "../_utils/NavLink";

import { api } from "@/utils/api";
import { cn, plural } from "@/utils/utils";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  BriefcaseIcon,
  HistoryIcon,
  HomeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  TagIcon,
  WrenchIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { TramonaLogo } from "../_common/Header/TramonaLogo";

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
            "relative flex items-center gap-4 p-4 text-center font-medium lg:flex-col lg:gap-1 lg:px-2 lg:py-3 lg:text-xs",
            selected
              ? "bg-zinc-200 text-black"
              : "text-zinc-700 hover:bg-zinc-200",
          )}
        >
          {selected && (
            <motion.div
              layoutId="sidebar-indicator"
              transition={{ duration: 0.1, ease: "circOut" }}
              className="absolute inset-y-0 right-0 border-[3px] border-transparent border-r-black"
            />
          )}
          <Icon
            className={cn(
              "size-6 lg:size-8",
              selected ? "text-black" : "text-zinc-700",
            )}
          />
          {children}
        </div>
      )}
    />
  );
}

const adminNavLinks = [
  { href: "/admin", name: "Dashboard", icon: LayoutDashboardIcon },
  {
    href: "/admin/incoming-requests",
    name: "Incoming Requests",
    icon: InboxIcon,
  },
  { href: "/admin/past-requests", name: "Past Requests", icon: HistoryIcon },
  { href: "/admin/utility", name: "Utility", icon: WrenchIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
  { href: "/dashboard", name: "Switch To Guest", icon: ArrowLeftRight },
];

const hostNavLinks = [
  { href: "/host", name: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

const guestNavLinks = [
  { href: "/dashboard", name: "Home", icon: HomeIcon },
  { href: "/requests", name: "My Requests", icon: TagIcon },
  { href: "/my-trips", name: "My Trips", icon: BriefcaseIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

export default function Sidebar({
  type,
  withLogo = false,
}: {
  type: "admin" | "guest" | "host";
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
          : guestNavLinks;

  const { data: totalUnreadMessages } =
    api.messages.getNumUnreadMessages.useQuery(undefined, {
      refetchInterval: 10000,
    });

  const notifyMe = useCallback(async () => {
    // Check if the browser supports notifications
    if (!("Notification" in window) || !totalUnreadMessages) return;

    // add && document.visibilityState !== 'visible' to show notification when person is not on chat screen
    if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const title = "Tramona Messages";
      const icon = "/assets/images/tramona-logo.jpeg";
      const body = `You have ${plural(totalUnreadMessages, "unread message")}!`;
      new Notification(title, { body, icon });
      const notificationSound = new Audio("/assets/sounds/sound.mp3");
      void notificationSound.play();
    }
  }, [totalUnreadMessages]);

  useEffect(() => {
    totalUnreadMessages && notifyMe;
  }, [totalUnreadMessages, notifyMe]);

  return (
    <div className="sticky top-0 flex h-full w-64 flex-col border-r lg:w-24">
      {withLogo && (
        <div className="p-3">
          <TramonaLogo />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center">
        {navLinks.map((link, index) =>
          link.name === "Messages" ? (
            <SidebarLink key={index} href={link.href} icon={link.icon}>
              {link.name}{" "}
              {totalUnreadMessages && totalUnreadMessages > 0 ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border bg-red-600 text-white">
                  {totalUnreadMessages}
                </div>
              ) : null}
            </SidebarLink>
          ) : (
            <SidebarLink key={index} href={link.href} icon={link.icon}>
              {link.name}
            </SidebarLink>
          ),
        )}
      </div>
      {/* <button onClick={notifyMe}>NOTIFICATION</button>
      <button onClick={play}>Sound</button>
      <p>{`You have ${totalUnreadMessages ?? 0} unread message(s).`}</p> */}
    </div>
  );
}
