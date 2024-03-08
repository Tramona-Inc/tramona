import { type Conversation } from "@/utils/store/conversations";
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
        <div className="relative flex h-full w-full flex-col bg-white">
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
