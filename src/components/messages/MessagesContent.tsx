import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { useMessage } from "@/utils/store/messages";
import { cn } from "@/utils/utils";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

export type ContentProps = {
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation | null) => void;
};

export default function MessagesContent({
  selectedConversation,
  setSelected,
}: ContentProps) {
  const message = useMessage((state) => state.conversations);
  const conversationList = useConversation((state) => state.conversationList);

  console.log("Messages", message);
  console.log("Conversations", conversationList);

  return (
    <div
      className={cn(
        "col-span-5 flex h-full items-center justify-center md:col-span-4 xl:col-span-4",
        !selectedConversation && "hidden md:flex",
      )}
    >
      {!selectedConversation ? (
        <>
          <p className="font-semibold text-muted-foreground">
            Select a conversation to read more
          </p>
        </>
      ) : (
        // Main Message content
        <div className="relative flex h-full w-full flex-col">
          <ChatHeader
            selectedConversation={selectedConversation}
            setSelected={setSelected}
          />
          <ChatMessages conversationId={selectedConversation.id} />
          <ChatInput conversationId={selectedConversation.id} />
        </div>
      )}
    </div>
  );
}
