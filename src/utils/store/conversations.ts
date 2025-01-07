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
    console.log("Conversation Store: Setting conversation list", {
      count: conversationList.length,
      firstId: conversationList[0]?.id,
      isEmpty: conversationList.length === 0,
    });
    set(() => ({ conversationList }));
  },
  setConversationToTop: (conversationId: string, newMessage: MessageType) => {
    console.log("Conversation Store: Moving conversation to top", {
      conversationId,
      messageId: newMessage.id,
    });

    set((state) => {
      const updatedConversations = [...state.conversationList];
      const conversationIndex = updatedConversations.findIndex(
        (conversation) => conversation.id === conversationId,
      );

      if (conversationIndex !== -1) {
        const conversation = updatedConversations[conversationIndex];
        if (conversation) {
          // Remove conversation from current position
          updatedConversations.splice(conversationIndex, 1);
          // Add conversation to top with updated messages
          updatedConversations.unshift({
            ...conversation,
            participants: conversation.participants || [],
            id: conversation.id,
            name: conversation.name,
            createdAt: conversation.createdAt,
            offerId: conversation.offerId ?? null,
            messages: [newMessage, ...conversation.messages],
          });

          console.log(
            "Conversation Store: Successfully moved conversation to top",
            {
              conversationId,
              newPosition: 0,
              messageCount: conversation.messages.length + 1,
            },
          );
        }
      } else {
        console.warn(
          "Conversation Store: Conversation not found for moving to top",
          {
            conversationId,
            totalConversations: updatedConversations.length,
          },
        );
      }

      return { conversationList: updatedConversations };
    });
  },
  setConversationReadState: (conversationId: string) => {
    console.log("Conversation Store: Setting conversation read state", {
      conversationId,
    });

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
