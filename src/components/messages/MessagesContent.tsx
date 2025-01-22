import { type Conversation } from "@/utils/store/conversations";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import ConversationsEmptySvg from "../_common/EmptyStateSvg/ConversationsEmptySvg";
import ErrorBoundary from "../ui/ErrorBoundary";

export default function MessagesContent({
  selectedConversation,
  setSelected,
}: {
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation | null) => void;
}) {
  return (
    <ErrorBoundary>
      {selectedConversation ? (
        <div className="relative flex h-full w-full flex-col">
          <ChatHeader
            selectedConversation={selectedConversation}
            setSelected={setSelected}
          />
          <ChatMessages conversationId={selectedConversation.id} />
          <ChatInput conversationId={selectedConversation.id} />
        </div>
      ) : (
        <EmptyStateValue description="Select a conversation to read more">
          <ConversationsEmptySvg />
        </EmptyStateValue>
      )}
    </ErrorBoundary>
  );
}
