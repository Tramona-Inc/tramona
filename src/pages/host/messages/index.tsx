// pages/host/messages/index.tsx
import MessagesPage from "@/components/messages/MessagePage"; // Your reusable component
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { useSession } from "next-auth/react";
import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";

export default function HostMessagesWrapper() {
  useSession({ required: true });
  const { currentHostTeamId } = useHostTeamStore();

  const fetchHostConversationsQuery = { hostTeamId: currentHostTeamId }; // Query for host conversations

  return (
    <MessagesPage
      isHost={true}
      basePath="/host/messages"
      fetchConversationsQuery={fetchHostConversationsQuery}
      showMobileSidebarFeatures={true} // Enable mobile sidebar for host version
      EmptyStateComponent={<ConversationsEmptySvg />} // Pass the empty state component
      isIndex={true} // not id router page
    />
  );
}
