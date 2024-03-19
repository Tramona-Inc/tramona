import NavLink from "../_utils/NavLink";

import { cn } from "@/utils/utils";
import {
  BriefcaseIcon,
  HistoryIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  TagIcon,
  WrenchIcon,
} from "lucide-react";
import { TramonaLogo } from "../_common/Header/TramonaLogo";
import { api } from "@/utils/api";
import { useCallback, useEffect } from "react";
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
            "flex items-center gap-4 border-[3px] border-transparent px-4 py-2 font-medium",
            selected
              ? "border-r-black bg-zinc-200 text-black"
              : "text-zinc-700 hover:bg-zinc-200",
          )}
        >
          <Icon
            className={cn("size-6", selected ? "text-black" : "text-zinc-500")}
          />
          {children}
        </div>
      )}
    />
  );
}

const adminNavLinks = [
  { href: "/admin", name: "Overview", icon: LayoutDashboardIcon },
  {
    href: "/admin/incoming-requests",
    name: "Incoming Requests",
    icon: InboxIcon,
  },
  { href: "/admin/past-requests", name: "Past Requests", icon: HistoryIcon },
  { href: "/admin/utility", name: "Utility", icon: WrenchIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

const hostNavLinks = [
  { href: "/host", name: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/messages", name: "Messages", icon: MessageCircleIcon },
];

const guestNavLinks = [
  { href: "/dashboard", name: "Overview", icon: LayoutDashboardIcon },
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
  const navLinks =
    type === "admin"
      ? adminNavLinks
      : type === "host"
        ? hostNavLinks
        : guestNavLinks;

  const { data: session } = useSession();
  const userId = session?.user.id;

  const response = api.messages.showUnreadMessages.useQuery({
    userId: userId!,
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
      const body = `You have ${response.data?.length} unread message${response.data?.length ?? 0 > 1 ? "s" : ""}.`;
      const notification = new Notification(title, { body, icon });
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
  }, [response]);

  useEffect(() => {
    response.data?.length && notifyMe;
  }, [response.data?.length, notifyMe]);

  return (
    <div className="sticky top-0 flex h-full w-64 flex-col border-r">
      {withLogo && (
        <div className="p-3">
          <TramonaLogo />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-center">
        {navLinks.map((link, index) => (
          <SidebarLink key={index} href={link.href} icon={link.icon}>
            {link.name}
          </SidebarLink>
        ))}
      </div>
      <button onClick={notifyMe}>NOTIFICATION</button>
      <p>{`You have ${response.data?.length ?? ""} unread message(s).`}</p>
    </div>
  );
}
