import { type MessageType, type GuestMessageType } from "@/server/db/schema";

import { create } from "zustand";
import { type RouterOutputs } from "../api";

export type Conversation =
  RouterOutputs["messages"]["getConversations"][number];
export type AdminConversation = 
RouterOutputs["messages"]["getConversationForAdmin"][number];


export type Conversations = RouterOutputs["messages"]["getConversations"];
export type GuestConvos = RouterOutputs["messages"]["getConversationWithGuest"]
export type AdminConversations = RouterOutputs["messages"]["getConversationForAdmin"]

type ConversationListState = {
  conversationList: Conversations  | [];
  adminConversationList: AdminConversations | [];
  setConversationList: (
    conversationList: Conversations | [] 
  ) => void;
  setAdminConversationList: (
    adminConversationList: AdminConversations | []
  ) => void
  setConversationToTop: (
    conversationId: string,
    newMessage: MessageType | GuestMessageType,
  ) => void;
  setConversationReadState: (conversationId: string) => void;
};

export const useConversation = create<ConversationListState>((set) => ({
  conversationList: [],
  adminConversationList: [],
  setConversationList: (conversationList: Conversations  | []) => {
    set(() => ({ conversationList }));
  },
  setAdminConversationList: ( adminConversationList: AdminConversations | []) => {
    set(() => ({ adminConversationList }))
  },
  setConversationToTop: (conversationId: string, newMessage:  GuestMessageType | MessageType ) => {
    set((state) => {
      const updatedConversations = [...state.conversationList]
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
          if("userId" in newMessage && "messages" in movedConversation){
            movedConversation.messages = [
              {
                id: newMessage.id,
                userId: newMessage.userId,
                // userToken: newMessage.userToken,
                createdAt: newMessage.createdAt,
                conversationId: newMessage.conversationId,
                message: newMessage.message,
                read: newMessage.read,
                isEdit: newMessage.isEdit,
              },
              ...movedConversation.messages.slice(1), // Include the rest of the messages
            ];
            updatedConversations.unshift(movedConversation);
          } else if("userToken" in newMessage && "guest_messages" in movedConversation) {

              movedConversation.guest_messages = [
                {
                  id: newMessage.id,
                  userToken: newMessage.userToken,
                  createdAt: newMessage.createdAt,
                  conversationId: newMessage.conversationId,
                  message: newMessage.message,
                  read: newMessage.read,
                  isEdit: newMessage.isEdit,
                },
                ...movedConversation.messages.slice(1),
              ]
          }

          // updatedConversations.unshift(movedConversation);
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
