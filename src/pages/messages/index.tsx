// pages/messages/[conversationId].tsx
import { useSession } from "next-auth/react";

import React from "react";
import MessagesPage from "@/components/messages/MessagePage";
import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";

export default function MessagePage() {
  useSession({ required: true });

  const fetchedConversations = {}; // no hostTeamId required

  return (
    <MessagesPage
      isHost={false}
      isIndex={true}
      basePath="/messages"
      fetchConversationsQuery={fetchedConversations}
      showMobileSidebarFeatures={true}
      EmptyStateComponent={<ConversationsEmptySvg />}
    />
  );
}
