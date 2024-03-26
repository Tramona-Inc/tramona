import NavLink from "../_utils/NavLink";

import { cn } from "@/utils/utils";
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
import { TramonaLogo } from "../_common/Header/TramonaLogo";
import { api } from "@/utils/api";
import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();

  const isAdmin = session && session.user.role === "admin";

  const navLinks =
    type === "admin"
      ? adminNavLinks
      : type === "host"
      ? hostNavLinks
      : isAdmin
      ? [...guestNavLinks, { href: "/admin", name: "Switch To Admin", icon: ArrowLeftRight }]
      : guestNavLinks;

  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data: totalUnreadMessages } =
    api.messages.showUnreadMessages.useQuery({
      userId: userId ?? "add-default-user-id",
    });

  const notifyMe = useCallback(async () => {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
      // add && document.visibilityState !== 'visible' to show notification when person is not on chat screen
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      console.log("permission granted");
      const title = "Tramona Messages";
      const icon =
        "https://img.apmcdn.org/d7e015791079e6474a04b6cff4825a9c9e3a7a36/square/50a6ba-20231003-panda-diplomacy1-webp2000.webp";
      const body = `You have ${totalUnreadMessages} unread message${totalUnreadMessages && totalUnreadMessages > 1 ? "s" : ""}.`;
      const notification = new Notification(title, { body, icon });
      const notificationSound = new Audio("/assets/sounds/sound.mp3");
      void notificationSound.play();
      console.log("userId:", userId);
      console.log("notification", notification);
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      console.log("permission denied");
      await Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("Hi there!");
          // …
        }
      });
    }
  }, [totalUnreadMessages, userId]);

  useEffect(() => {
    totalUnreadMessages && notifyMe;
  }, [totalUnreadMessages, notifyMe]);

  const play = () => {
    const notificationSound = new Audio("/assets/sounds/sound.mp3");
    void notificationSound.play();
  };

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
      <button onClick={notifyMe}>NOTIFICATION</button>
      <button onClick={play}>Sound</button>
      <p>{`You have ${totalUnreadMessages ?? 0} unread message(s).`}</p>
    </div>
  );
}
