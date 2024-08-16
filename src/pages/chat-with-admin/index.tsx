import MessagesPopover from "@/components/messages/chat-with-admin-popover/MessagesPopover";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useIsMd } from "@/utils/utils";

export default function AdminMessagesPage() {
  const isMd = useIsMd();

  return <DashboardLayout>{!isMd && <MessagesPopover />}</DashboardLayout>;
}
