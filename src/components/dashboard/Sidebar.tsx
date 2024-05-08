import { api } from "@/utils/api";
import { plural } from "@/utils/utils";
import { ArrowLeftRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { TramonaLogo } from "../_common/Header/TramonaLogo";
import { Badge } from "../ui/badge";
import { adminNavLinks, hostNavLinks, guestNavLinks } from "./navLinks";
import { SidebarLink } from "./SidebarLink";

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
              {
                href: "/admin",
                name: "Switch To Admin",
                icon: ArrowLeftRight,
                noChildren: false,
              },
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
    <div className="sticky top-0 flex h-full w-64 flex-col lg:w-20">
      {withLogo && (
        <div className="p-3">
          <TramonaLogo />
        </div>
      )}
      <div className="flex flex-1 flex-col pt-8">
        {navLinks.map((link, index) => (
          <div key={index} className="relative">
            <SidebarLink
              href={link.href}
              icon={link.icon}
              name={link.name}
              noChildren={link.noChildren}
            />
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
