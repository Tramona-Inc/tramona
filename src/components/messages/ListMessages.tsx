import { type MessageDbType, type GuestMessageType } from "@/types/supabase.message";
import { type GuestMessage, useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { useEffect, useRef, useState } from "react";
import { Icons } from "../_icons/icons";
import { api } from "@/utils/api";
import { useConversation } from "@/utils/store/conversations";
import { errorToast } from "@/utils/toasts";
import { useSession } from "next-auth/react";
import LoadMoreMessages from "./LoadMoreMessages";
import { groupMessages } from "./groupMessages";
import { MessageGroup } from "./MessageGroup";
import { User } from "@/server/db/schema";
import { type MessageGroups } from "./groupMessages";

function NoMessages() {
  return (
    <div className="absolute flex h-full flex-col items-center justify-center text-muted-foreground">
      No messages
    </div>
  );
}

function isChatMessage(message: ChatMessageType | GuestMessage): message is ChatMessageType {
  return (message as ChatMessageType).userId !== undefined;
}


export default function ListMessages({
  conversationId,
}: {
  conversationId: string,
} 
) {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [userScrolled, setUserScrolled] = useState(false);

  const [notification, setNotification] = useState(0);

  const optimisticIds = useMessage((state) => state.optimisticIds);
  const currentConversationId = useMessage(
    (state) => state.currentConversationId,
  );
  const { conversations } = useMessage();

  // console.log(currentConversationId);

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );

  const messages = currentConversationId
    ? conversations[currentConversationId]?.messages ?? []
    : [];

  const { mutateAsync } = api.messages.setMessagesToRead.useMutation();

  const { data: session } = useSession();

  // Set all the messages to read when loaded
  useEffect(() => {
    const unreadMessageIds = messages
      .filter(
        (message) =>
          message.read === false && isChatMessage(message) && message.userId !== session?.user.id,
      )
      .map((message) => message.id);

    if (unreadMessageIds.length > 0) {
      void mutateAsync({ unreadMessageIds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const hasMore = currentConversationId
    ? conversations[currentConversationId]?.hasMore ?? false
    : false;

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    // if (!optimisticIds.includes(payload.new.id)) {
    //   const { error } = await supabase
    //     .from("user")
    //     .select("name, email, image")
    //     .eq("id", payload.new.user_id ?? "")
    //     .single();
    //   if (error) {
    //     errorToast();
    //   } else {
        const newMessage: ChatMessageType & GuestMessage = {
          id: payload.new.id,
          conversationId: payload.new.conversation_id,
          userId: payload.new.user_id ?? "",
          message: payload.new.message,
          userToken: "",
          isEdit: payload.new.is_edit,
          createdAt: payload.new.created_at,
          read: payload.new.read,
        };
        addMessageToConversation(payload.new.conversation_id, newMessage);
    //   }
    // }

    const scrollContainer = scrollRef.current;
    if (
      scrollContainer.scrollTop <
      scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
    ) {
      setNotification((current) => current + 1);
    }
  };

  const handlePostgresChangeOnGuest = async (payload: {new: GuestMessageType}) => {
    const newMessage: ChatMessageType | GuestMessage = {
      id: payload.new.id,
      conversationId: payload.new.conversation_id,
      // userId: "",
      message: payload.new.message,
      userToken: payload.new.user_token,
      isEdit: payload.new.is_edit,
      createdAt: payload.new.created_at,
      read: payload.new.read,
    };
    addMessageToConversation(payload.new.conversation_id, newMessage);
  }

  useEffect(() => {
    const channel = supabase
      .channel(`${currentConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: { new: MessageDbType }) => void handlePostgresChange(payload),
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId, messages]);

  useEffect(() => {
    const channel = supabase
    .channel(`${currentConversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema:"public",
        table:"guest_messages",
      },
      (payload: {new: GuestMessageType}) => void handlePostgresChangeOnGuest(payload) 
    )
  }, [currentConversationId, messages])

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;

    // Check if scroll is more than 10 pixels
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;

      setUserScrolled(isScroll);

      // Set notification to 0 when scroll to bottom
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };

  const scrollDown = () => {
    // Clear notification when scorlled down
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  // Get all participants
  const { conversationList } = useConversation();
  const { adminConversationList } = useConversation();

  const conversationIndex = conversationList.findIndex(
    (conversation) => conversation.id === currentConversationId,
  );

  const adminConversationIndex = adminConversationList.findIndex(
    (conversation) => conversation.id === currentConversationId,
  )
  const participants = conversationList[conversationIndex]?.participants;

  const guest_participants = adminConversationList[adminConversationIndex]?.guest_participants;
  console.log(messages)
  const messagesWithUser = messages
    .slice()
    .reverse()
    .map((message) => {
      // Display message with user
      if ((!participants && !guest_participants) || !session) return null;
      if (isChatMessage(message) && message.userId === session.user.id) {
        return { message, user: session.user };
      }

      if(message.userToken === session.user.id){
        return {message, user: session.user}
      }

      const user =
        participants?.find(
          (participant) => isChatMessage(message) && participant?.id === message.userId,
        ) ?? guest_participants?.find(
          (participant) => participant.userToken === message.userToken
        ) ?? null; // null means its a deleted user

      return { message, user };
    })
    .filter(Boolean);

  const messageGroups = groupMessages(messagesWithUser);

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleOnScroll}
        className="relative flex flex-1 flex-col overflow-y-auto"
      >
        <div className="flex-1"></div>
        <div className="absolute w-full space-y-8 p-4 pt-12">
          {hasMore && <LoadMoreMessages />}
          {messageGroups.map((messageGroup) => (
            <MessageGroup
              key={messageGroup.messages[0]?.id}
              messageGroup={messageGroup}
            />
          ))}
        </div>
        {messages.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <NoMessages />
          </div>
        )}
      </div>
      {/* {JSON.stringify(messagesWithUser, null, 2)}
      {JSON.stringify(messageGroups, null, 2)} */}
      {userScrolled && (
        <div
          className="absolute bottom-16 flex w-full items-center justify-center"
          onClick={() => scrollDown()}
        >
          {notification ? (
            <div className="cursor-pointer rounded-xl bg-black px-6 py-1 transition-all hover:scale-110">
              <h1 className="text-white">New {notification} messages</h1>
            </div>
          ) : (
            <div className="cursor-pointer rounded-full bg-black p-2 transition-all hover:scale-110">
              <Icons.arrowDown color="white" />
            </div>
          )}
        </div>
      )}
    </>
  );
}
