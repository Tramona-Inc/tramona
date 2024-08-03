import { AdminConversation, type Conversation } from "@/utils/store/conversations";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import ConversationsEmptySvg from "../_common/EmptyStateSvg/ConversationsEmptySvg";

export default function MessagesContent({
  selectedConversation,
  setSelected,
}: {
  selectedConversation: Conversation | AdminConversation | null;
  setSelected: (arg0: Conversation & AdminConversation | null) => void;
}) {
  if (!selectedConversation) {
    return (
      <EmptyStateValue description="Select a convesation to read more">
        <ConversationsEmptySvg />
      </EmptyStateValue>
    );
  }
  // console.log("In Message Content")
  // console.log(selectedConversation);

  return (
    <div className="relative flex h-full w-full flex-col">
      <ChatHeader
        selectedConversation={selectedConversation}
        setSelected={setSelected}
      />
      <ChatMessages conversationId={selectedConversation.id} />
      <ChatInput conversationId={selectedConversation.id} />
    </div>
  );
}
