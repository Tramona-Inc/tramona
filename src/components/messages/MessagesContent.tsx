// components/messages/MessagesContent.tsx
import { type Conversation } from "@/utils/store/conversations";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import ConversationsEmptySvg from "../_common/EmptyStateSvg/ConversationsEmptySvg";
import ErrorBoundary from "../ui/ErrorBoundary";
import React, { useState } from "react"; // Import useState

export default function MessagesContent({
  selectedConversation,
  setSelected,
}: {
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation | null) => void;
}) {
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // Add loading state

  return (
    <ErrorBoundary>
      <div className="relative flex h-full w-full flex-col">
        {selectedConversation ? (
          <>
            <ChatHeader
              selectedConversation={selectedConversation}
              setSelected={setSelected}
            />
            <ChatMessages
              conversationId={selectedConversation.id}
              onMessagesLoadStart={() => setIsLoadingMessages(true)} // Pass loading start callback
              onMessagesLoadEnd={() => setIsLoadingMessages(false)} // Pass loading end callback
            />
            <ChatInput conversationId={selectedConversation.id} />
          </>
        ) : (
          <EmptyStateValue description="Select a conversation to read more">
            <ConversationsEmptySvg />
          </EmptyStateValue>
        )}
        {isLoadingMessages && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            {" "}
            {/* Loading overlay */}
            <p>Loading messages...</p>{" "}
            {/* Replace with your loading spinner/indicator */}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
