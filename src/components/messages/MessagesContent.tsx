// components/messages/MessagesContent.tsx (Simplified)
import { type Conversation } from "@/utils/store/conversations";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import ConversationsEmptySvg from "../_common/EmptyStateSvg/ConversationsEmptySvg";
import ErrorBoundary from "../ui/ErrorBoundary";
import React from "react";

export default function MessagesContent({
  selectedConversation,
  setSelected,
  onMessagesLoadEnd, // Keep onMessagesLoadEnd prop
}: {
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation | null) => void;
  onMessagesLoadEnd: () => void; // Keep onMessagesLoadEnd prop
}) {
  return (
    <ErrorBoundary>
      <div className="relative flex h-full w-full flex-col">
        <ChatHeader
          selectedConversation={selectedConversation}
          setSelected={setSelected}
        />
        <ChatMessages
          conversationId={selectedConversation.id}
          onMessagesLoadEnd={onMessagesLoadEnd} // Pass down the onMessagesLoadEnd callback
        />
        <ChatInput conversationId={selectedConversation.id} />
      </div>
    </ErrorBoundary>
  );
}
