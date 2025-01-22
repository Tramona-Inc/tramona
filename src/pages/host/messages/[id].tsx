// pages/host/messages/[id].tsx
import MessagesPage from "@/components/messages/MessagePage";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { useSession } from "next-auth/react";
import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";

export default function HostMessageIdPage() {
  // Renamed for clarity
  useSession({ required: true });
  const { currentHostTeamId } = useHostTeamStore();

  const fetchHostConversationsQuery = { hostTeamId: currentHostTeamId };

  return (
    <MessagesPage
      isHost={true}
      basePath="/host/messages"
      fetchConversationsQuery={fetchHostConversationsQuery}
      showMobileSidebarFeatures={true}
      EmptyStateComponent={<ConversationsEmptySvg />}
      pageTitlePrefix="Host"
      isIndex={false}
    />
  );
}
