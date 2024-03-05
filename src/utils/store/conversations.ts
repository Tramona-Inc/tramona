import { type AppRouter } from "@/server/api/root";
import { type MessageType } from "@/server/db/schema";
import { type inferRouterOutputs } from "@trpc/server";

import { create } from "zustand";

export type Conversation =
  inferRouterOutputs<AppRouter>["messages"]["getConversations"][number];

export type Conversations =
  inferRouterOutputs<AppRouter>["messages"]["getConversations"];

type ConversationListState = {
  conversationList: Conversations | [];
  setConversationList: (conversationList: Conversations | []) => void;
  setConversationToTop: (
    conversationId: number,
    newMessage: MessageType,
  ) => void;
  conversationOptimisticIds: number[];
  setConversationOptimisticIds: (id: number) => void;
};

export const useConversation = create<ConversationListState>((set) => ({
  conversationList: [],
  setConversationList: (conversationList: Conversations | []) => {
    set(() => ({ conversationList }));
  },
  setConversationToTop: (conversationId: number, newMessage: MessageType) => {
    set((state) => {
      const updatedConversations: Conversations | [] = state.conversationList
        ? [...state.conversationList]
        : [];

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
  conversationOptimisticIds: [],
  setConversationOptimisticIds: (id: number) =>
    set((state) => ({
      conversationOptimisticIds: [...state.conversationOptimisticIds, id],
    })),
}));
