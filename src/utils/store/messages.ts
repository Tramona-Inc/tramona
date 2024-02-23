import { type MessageType } from "@/server/db/schema";
import { create } from "zustand";

export type ChatMessageType = MessageType & {
  user: { name: string | null; email: string; image: string };
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
}));
