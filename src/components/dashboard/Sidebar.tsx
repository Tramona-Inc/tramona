import {
  adminNavLinks,
  guestDesktopNavLinks,
  hostMobileNavLinks,
} from "@/config/sideNavLinks";
import { api } from "@/utils/api";
import { plural } from "@/utils/utils";
import { ArrowLeftRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { Badge } from "../ui/badge";
import { NavBarLink } from "./NavBarLink";
import { TramonaLogo } from "../_common/Layout/header/TramonaLogo";

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
        ? hostMobileNavLinks
        : isAdmin
          ? [
              ...guestDesktopNavLinks,
              { href: "/admin", name: "Switch To Admin", icon: ArrowLeftRight },
            ]
          : guestDesktopNavLinks;

  const { data: totalUnreadMessages } =
    api.messages.getNumUnreadMessages.useQuery(undefined, {
      // refetchInterval: 10000,
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
    <div className="sticky top-0 flex h-full w-64 flex-col bg-zinc-100 lg:w-20">
      {withLogo && (
        <div className="p-3">
          <TramonaLogo />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 bg-zinc-100 pt-4">
        {navLinks.map((link, index) => (
          <div key={index} className="relative">
            <NavBarLink href={link.href} icon={link.icon}>
              {link.name}
            </NavBarLink>
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

      {/* <button onClick={notifyMe}>NOTIFICATION</button>
      <button onClick={play}>Sound</button>
      <p>{`You have ${totalUnreadMessages ?? 0} unread message(s).`}</p> */}
    </div>
  );
}
