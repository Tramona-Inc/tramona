import { type MessageType } from "@/server/db/schema";

import { create } from "zustand";
import { type RouterOutputs } from "../api";

export type Conversation =
  RouterOutputs["messages"]["getConversations"][number];

export type Conversations = RouterOutputs["messages"]["getConversations"];

type ConversationListState = {
  conversationList: Conversations | [];
  setConversationList: (conversationList: Conversations | []) => void;
  setConversationToTop: (
    conversationId: string,
    newMessage: MessageType,
  ) => void;
  setConversationReadState: (conversationId: string) => void;
};

export const useConversation = create<ConversationListState>((set) => ({
  conversationList: [],
  setConversationList: (conversationList: Conversations | []) => {
    set(() => ({ conversationList }));
  },
  setConversationToTop: (conversationId: string, newMessage: MessageType) => {
    set((state) => {
      const updatedConversations = [...state.conversationList];

      const conversationIndex = updatedConversations.findIndex(
        (conversation) => conversation.id === conversationId,
      );

      if (conversationIndex !== -1) {
        const movedConversation = updatedConversations.splice(
          conversationIndex,
          1,
        )[0];

        // Check if movedConversation is not undefined
        if (movedConversation) {
          // Update the first message in the messages array with the new message
          movedConversation.messages = [
            {
              id: newMessage.id,
              userId: newMessage.userId,
              createdAt: newMessage.createdAt,
              conversationId: newMessage.conversationId,
              message: newMessage.message,
              read: newMessage.read,
              isEdit: newMessage.isEdit,
            },
            ...movedConversation.messages.slice(1), // Include the rest of the messages
          ];

          updatedConversations.unshift(movedConversation);
        }
      }

      return { conversationList: updatedConversations };
    });
  },
  setConversationReadState: (conversationId: string) => {
    set((state) => {
      const updatedConversations = state.conversationList.map(
        (conversation) => {
          if (conversation.id === conversationId) {
            const updatedMessages = conversation.messages.map((message) => ({
              ...message,
              read: true,
            }));
            return { ...conversation, messages: updatedMessages };
          }
          return conversation;
        },
      );

      return { conversationList: updatedConversations };
    });
  },
}));
