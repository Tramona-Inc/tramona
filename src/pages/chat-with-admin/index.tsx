import MessagesPopover from "@/components/messages/chat-with-admin-popover/MessagesPopover";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useIsLg } from "@/utils/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminMessagesPage() {
  const isLg = useIsLg();
  const router = useRouter();
  useEffect(() => {
    if (isLg) {
      // push to home page and use desktop chat-with-admin popover
      void router.push("/");
    }
  }, [isLg, router]);

  return (
    <DashboardLayout>
      {/* <MessagesPopover isMobile={true} isHostOnboarding={false} /> */}
      <div>Coming Soon</div>
    </DashboardLayout>
  );
}
