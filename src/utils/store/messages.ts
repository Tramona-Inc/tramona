import { type MessageType } from "@/server/db/schema";
import { create } from "zustand";

export type ChatMessageType = MessageType & {
  user: { name: string | null; email: string; image: string | null };
};

type ConversationsState = Record<number, ChatMessageType[]>;

type MessageState = {
  conversations: ConversationsState;
  currentConversationId: number | null;
  setInitConversationMessages: (
    conversationId: number,
    messages: ChatMessageType[],
  ) => void;
  switchConversation: (conversationId: number) => void;
  addMessageToConversation: (
    conversationId: number,
    messages: ChatMessageType,
  ) => void;
};

export const useMessage = create<MessageState>((set) => ({
  conversations: {},
  currentConversationId: null,
  setInitConversationMessages: (
    conversationId: number,
    messages: ChatMessageType[],
  ) => {
    set((state) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [conversationId]: messages,
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
        updatedConversations[conversationId] = [
          ...(updatedConversations[conversationId] as ChatMessageType[]),
          newMessage,
        ];
      } else {
        // If the conversation doesn't exist, create a new conversation with the new message
        updatedConversations[conversationId] = [newMessage];
      }

      // Ensure TypeScript understands that this is a ChatMessageType[]
      const updatedState: MessageState = {
        ...state,
        conversations: updatedConversations,
      };

      return updatedState;
    });
  },
}));
