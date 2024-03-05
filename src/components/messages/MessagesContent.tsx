import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { cn } from "@/utils/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
  // Getting state from conversation state (not messages state)
  const { query } = useRouter();

  const conversations = useConversation((state) => state.conversationList);

  // allows us to open message from query
  useEffect(() => {
    if (query.conversationId && conversations.length > 0) {
      const conversationIdToSelect = parseInt(query.conversationId as string);

      // Find the conversation with the matching ID
      const selectedConversation = conversations.find(
        (conversation) => conversation.id === conversationIdToSelect,
      );

      // Set the selected conversation in your Zustand store
      if (selectedConversation) {
        setSelected(selectedConversation);
      }
    }
  }, [conversations, query.conversationId, setSelected]);

  return (
    <div
      className={cn(
        "col-span-5 flex h-full items-center justify-center md:col-span-4 xl:col-span-5",
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
