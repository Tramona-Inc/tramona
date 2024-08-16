import MessagesPopover from "@/components/messages/chat-with-admin-popover/MessagesPopover";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useIsSm } from "@/utils/utils";
import { useRouter } from "next/router";

export default function AdminMessagesPage() {
  const isSm = useIsSm();
  const router = useRouter();
  if (isSm) {
    // push to home page and use desktop chat-with-admin popover
    void router.push("/");
  }

  return (
    <DashboardLayout>
      <MessagesPopover />
    </DashboardLayout>
  );
}
