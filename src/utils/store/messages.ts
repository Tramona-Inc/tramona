import { type MessageType } from "@/server/db/schema";
import { create } from "zustand";

export type ChatMessageType = MessageType & {
  user: { name: string | null; email: string; image: string | null };
};

type ConversationsState = Record<
  number,
  {
    messages: ChatMessageType[];
    page: number;
  }
>;

type MessageState = {
  conversations: ConversationsState;
  currentConversationId: number | null;
  setInitConversationMessages: (
    conversationId: number,
    messages: ChatMessageType[],
    page: number,
  ) => void;
  switchConversation: (conversationId: number) => void;
  addMessageToConversation: (
    conversationId: number,
    messages: ChatMessageType,
  ) => void;
  optimisticIds: number[];
  setOptimisticIds: (id: number) => void;
  setMoreMessagesToConversation: (
    conversationId: number,
    moreMessages: ChatMessageType[],
  ) => void;
};

export const useMessage = create<MessageState>((set) => ({
  conversations: {},
  currentConversationId: null,
  setInitConversationMessages: (
    conversationId: number,
    messages: ChatMessageType[],
    page: number,
  ) => {
    set((state) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [conversationId]: {
          messages,
          page,
        },
      },
    }));
  },
  switchConversation: (conversationId: number) => {
    set({ currentConversationId: conversationId });
  },
  addMessageToConversation: (
    conversationId: number,
    newMessage: ChatMessageType,
  ) => {
    set((state) => {
      const updatedConversations: ConversationsState = {
        ...state.conversations,
      };

      // Check if the conversation exists in the state
      if (updatedConversations[conversationId]) {
        // Add the new message to the existing conversation
        updatedConversations[conversationId] = {
          messages: [
            newMessage,
            ...(updatedConversations[conversationId]?.messages ?? []),
          ],
          page: updatedConversations[conversationId]?.page ?? 1, // Set a default value for page
        };
      } else {
        // If the conversation doesn't exist, create a new conversation with the new message
        updatedConversations[conversationId] = {
          messages: [newMessage],
          page: 1, // Set a default value for page
        };
      }

      // Ensure TypeScript understands that this is a ChatMessageType[]
      const updatedState: MessageState = {
        ...state,
        conversations: updatedConversations,
        optimisticIds: [...state.optimisticIds, newMessage.id],
      };

      return updatedState;
    });
  },
  optimisticIds: [],
  setOptimisticIds: (id: number) =>
    set((state) => ({
      optimisticIds: [...state.optimisticIds, id],
    })),
  setMoreMessagesToConversation: (
    conversationId: number,
    moreMessages: ChatMessageType[],
  ) => {
    set((state) => {
      const updatedConversations: ConversationsState = {
        ...state.conversations,
      };

      // Check if the conversation exists in the state
      if (updatedConversations[conversationId]) {
        // Add the new message to the existing conversation
        updatedConversations[conversationId] = {
          messages: [
            ...(updatedConversations[conversationId]?.messages ?? []),
            ...moreMessages,
          ],
          page: (updatedConversations[conversationId]?.page ?? 1) + 1,
        };
      } else {
        // If the conversation doesn't exist, create a new conversation with the new message
        updatedConversations[conversationId] = {
          messages: moreMessages,
          page: 1, // Set a default value for page
        };
      }

      const updatedState: MessageState = {
        ...state,
        conversations: updatedConversations,
      };

      return updatedState;
    });
  },
}));
