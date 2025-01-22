import MessagesPopover from "@/components/messages/chat-with-admin-popover/MessagesPopover";

import { StickyTopBar } from "@/pages/for-hosts";
import { MobileStickyBar } from "@/pages/for-hosts";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";

export default function OnboardingLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  useSession({ required: true });

  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* <Header /> */}
        <div className="md:hidden">
          <MobileStickyBar />
        </div>
        <div className="hidden md:block">
          <StickyTopBar />
        </div>
        <div className={cn("min-h-screen-minus-header flex-grow", className)}>
          {children}
        </div>
        <div className="hidden md:contents">
          {/* <MessagesPopover isMobile={false} isHostOnboarding={true} /> */}
        </div>
      </div>
    </>
  );
}
