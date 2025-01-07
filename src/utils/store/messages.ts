import { LIMIT_MESSAGE } from "@/components/messages/ChatMessages";
import { type MessageType } from "@/server/db/schema";
import { create } from "zustand";
import supabase from "../supabase-client";
import { errorToast } from "../toasts";

export type ChatMessageType = MessageType & { userId: string }; // make userId non-null

type ConversationsState = Record<
  string,
  {
    messages: ChatMessageType[];
    page: number;
    hasMore: boolean;
    alreadyFetched: boolean;
  }
>;

type MessageState = {
  conversations: ConversationsState;
  currentConversationId: string | null;
  setCurrentConversationId: (id: string) => void;
  switchConversation: (conversationId: string) => void;
  addMessageToConversation: (
    conversationId: string,
    messages: ChatMessageType,
  ) => void;
  optimisticIds: string[];
  setOptimisticIds: (id: string) => void;
  setMoreMessagesToConversation: (
    conversationId: string,
    moreMessages: ChatMessageType[],
  ) => void;
  fetchInitialMessages: (conversationId: string) => Promise<void>;
  removeMessageFromConversation: (
    conversationId: string,
    messageId: string,
  ) => void;
};

export const useMessage = create<MessageState>((set, get) => ({
  conversations: {},
  currentConversationId: null,
  setCurrentConversationId: (id: string) => {
    set(() => ({
      currentConversationId: id,
    }));
  },
  switchConversation: (conversationId: string) => {
    set({ currentConversationId: conversationId });
  },
  addMessageToConversation: (
    conversationId: string,
    newMessage: ChatMessageType,
  ) => {
    // Optimistically update the state
    set((state) => {
      const updatedConversations: ConversationsState = {
        ...state.conversations,
      };

      if (updatedConversations[conversationId]) {
        updatedConversations[conversationId] = {
          messages: [
            ...updatedConversations[conversationId].messages,
            newMessage,
          ],
          page: updatedConversations[conversationId].page,
          hasMore: updatedConversations[conversationId].hasMore,
          alreadyFetched: updatedConversations[conversationId].alreadyFetched,
        };
      }

      const updatedState: MessageState = {
        ...state,
        conversations: updatedConversations,
        optimisticIds: [...state.optimisticIds, newMessage.id],
      };

      return updatedState;
    });
  },
  optimisticIds: [],
  setOptimisticIds: (id: string) =>
    set((state) => ({
      optimisticIds: [...state.optimisticIds, id],
    })),
  setMoreMessagesToConversation: (
    conversationId: string,
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
            ...updatedConversations[conversationId].messages,
            ...moreMessages,
          ],
          page: updatedConversations[conversationId].page + 1,
          hasMore: moreMessages.length >= LIMIT_MESSAGE,
          alreadyFetched: updatedConversations[conversationId].alreadyFetched,
        };
      } else {
        // If the conversation doesn't exist, create a new conversation with the new message
        updatedConversations[conversationId] = {
          messages: moreMessages,
          page: 1, // Set a default value for page
          hasMore: true,
          alreadyFetched: true,
        };
      }

      const updatedState: MessageState = {
        ...state,
        conversations: updatedConversations,
      };

      return updatedState;
    });
  },
  fetchInitialMessages: async (conversationId: string): Promise<void> => {
    const state = get();

    // Check if messages for this conversation have already been fetched
    if (state.conversations[conversationId]?.alreadyFetched) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
            *,
            user(name, image, email)
          `,
        )
        .range(0, LIMIT_MESSAGE)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      const chatMessages = data.map((message) => ({
        id: message.id,
        createdAt: message.created_at,
        conversationId: message.conversation_id,
        userId: message.user_id,
        message: message.message,
        read: message.read ?? false, // since fetched means it's read
        isEdit: message.is_edit ?? false, // Provide a default value if needed
        user: {
          name: message.user?.name ?? "",
          image: message.user?.image ?? "",
          email: message.user?.email ?? "",
        },
      }));

      const hasMore = chatMessages.length >= LIMIT_MESSAGE;

      set((state) => ({
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            messages: chatMessages,
            page: 1,
            hasMore,
            alreadyFetched: true, // Set the flag to true after fetching
          },
        },
      }));
    } catch (error) {
      errorToast();
    }
  },
  removeMessageFromConversation: (
    conversationId: string,
    messageId: string,
  ) => {
    set((state) => {
      const updatedConversations: ConversationsState = {
        ...state.conversations,
      };

      // Check if the conversation exists in the state
      if (updatedConversations[conversationId]) {
        // Remove the message from the existing conversation
        updatedConversations[conversationId] = {
          messages: updatedConversations[conversationId].messages.filter(
            (message) => message.id !== messageId,
          ),
          page: updatedConversations[conversationId].page,
          hasMore: updatedConversations[conversationId].hasMore,
          alreadyFetched: updatedConversations[conversationId].alreadyFetched,
        };
      }

      const updatedState: MessageState = {
        ...state,
        conversations: updatedConversations,
        optimisticIds: state.optimisticIds.filter((id) => id !== messageId),
      };

      return updatedState;
    });
  },
}));
