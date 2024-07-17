import { LIMIT_MESSAGE } from "@/components/messages/ChatMessages";
import { type MessageType } from "@/server/db/schema";
import { type GuestMessageType } from "@/server/db/schema";
import { create } from "zustand";
import supabase from "../supabase-client";
import { errorToast } from "../toasts";
import { read } from "fs";

export type ChatMessageType = MessageType & {userId: string}; // make userId non-null
export type GuestMessage = GuestMessageType 


type ConversationsState = Record<
  string,
  {
    messages: (ChatMessageType & GuestMessage)[];
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
    messages: ChatMessageType & GuestMessage,
  ) => void;
  optimisticIds: string[];
  setOptimisticIds: (id: string) => void;
  setMoreMessagesToConversation: (
    conversationId: string,
    moreMessages: (ChatMessageType & GuestMessage)[],
  ) => void;
  fetchInitialMessages: (conversationId: string) => Promise<void>;
  fetchMessagesForGuest: (conversationId: string) => Promise<void>;
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
    newMessage: ChatMessageType & GuestMessage,
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
          hasMore: updatedConversations[conversationId]?.hasMore ?? false,
          alreadyFetched:
            updatedConversations[conversationId]?.alreadyFetched ?? true,
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
  setOptimisticIds: (id: string) =>
    set((state) => ({
      optimisticIds: [...state.optimisticIds, id],
    })),
  setMoreMessagesToConversation: (
    conversationId: string,
    moreMessages: (ChatMessageType & GuestMessage)[],
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
          hasMore: moreMessages.length >= LIMIT_MESSAGE,
          alreadyFetched:
            updatedConversations[conversationId]?.alreadyFetched ?? true,
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
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const chatMessages: (ChatMessageType & GuestMessage)[] = data.map((message) => ({
          id: message.id,
          createdAt: message.created_at,
          conversationId: message.conversation_id,
          userId: message.user_id ?? "",
          // userToken: message.user_token,
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
      }
    } catch (error) {
      errorToast();
    }
  },
  fetchMessagesForGuest: async (conversationId: string): Promise<void> => {
    const state = get();

    if(state.conversations[conversationId]?.alreadyFetched) {
      return;
    }
    
    try{
      const { data, error } = await supabase.
      from("guest_messages")
      .select("*")
      .range(0, LIMIT_MESSAGE)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })

      

      if(data){
        const chatMessages: (ChatMessageType | GuestMessage)[] = data.map((message) => ({
          id: message.id,
          conversationId: message.conversation_id,
          userToken: message.user_token,
          message: message.message,
          createdAt: message.created_at,
          isEdit: message.is_edit,
          read: message.read,
        }))

        const hasMore = chatMessages.length >= LIMIT_MESSAGE

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
      }
    } catch(error) {
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
          messages:
            updatedConversations[conversationId]?.messages.filter(
              (message) => message.id !== messageId,
            ) ?? [],
          page: updatedConversations[conversationId]?.page ?? 1, // Set a default value for page
          hasMore: updatedConversations[conversationId]?.hasMore ?? false,
          alreadyFetched:
            updatedConversations[conversationId]?.alreadyFetched ?? true,
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
