import { type MessageDbType } from "@/types/supabase.message";
import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { useEffect, useRef, useState } from "react";
import { Icons } from "../_icons/icons";
// import LoadMoreMessages from "./LoadMoreMessages";
import { api } from "@/utils/api";
import { useConversation } from "@/utils/store/conversations";
import { errorToast } from "@/utils/toasts";
import { useSession } from "next-auth/react";
import LoadMoreMessages from "./LoadMoreMessages";
import { Message } from "./Message";

function NoMessages() {
  return (
    <div className="absolute flex h-full flex-col items-center justify-center text-muted-foreground">
      No messages
    </div>
  );
}

export default function ListMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [userScrolled, setUserScrolled] = useState(false);

  const [notification, setNotification] = useState(0);

  const { conversations } = useMessage();
  const optimisticIds = useMessage((state) => state.optimisticIds);
  const currentConversationId = useMessage(
    (state) => state.currentConversationId,
  );

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
          message.read === false && message.userId !== session?.user.id,
      )
      .map((message) => message.id);

    if (unreadMessageIds.length > 0) {
      void mutateAsync({ unreadMessageIds });
    }
  }, [messages]);

  const hasMore = currentConversationId
    ? conversations[currentConversationId]?.hasMore ?? false
    : false;

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    if (!optimisticIds.includes(payload.new.id)) {
      const { error } = await supabase
        .from("user")
        .select("name, email, image")
        .eq("id", payload.new.user_id)
        .single();
      if (error) {
        errorToast(error.message);
      } else {
        const newMessage: ChatMessageType = {
          id: payload.new.id,
          conversationId: payload.new.conversation_id,
          userId: payload.new.user_id,
          message: payload.new.message,
          isEdit: payload.new.is_edit,
          createdAt: new Date(payload.new.created_at),
          read: payload.new.read,
        };
        addMessageToConversation(payload.new.conversation_id, newMessage);
      }
    }

    const scrollContainer = scrollRef.current;
    if (
      scrollContainer.scrollTop <
      scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
    ) {
      setNotification((current) => current + 1);
    }
  };

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

  const conversationIndex = conversationList.findIndex(
    (conversation) => conversation.id === currentConversationId,
  );

  const participants = conversationList[conversationIndex]?.participants;

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleOnScroll}
        className="relative flex flex-1 flex-col overflow-y-auto"
      >
        <div className="flex-1"></div>
        <div className="absolute w-full">
          {hasMore && <LoadMoreMessages />}
          {messages.length > 0 &&
            messages
              .slice()
              .reverse()
              .map((message) => {
                // Display message with user
                if (participants && session) {
                  const participantUser = participants.find(
                    (participant) => participant.id === message.userId,
                  );

                  const user = participantUser;

                  const self = session.user;

                  if (user ?? self) {
                    return (
                      <Message
                        key={message.id}
                        message={message}
                        user={user ?? self}
                      />
                    );
                  }

                  return null;
                }
              })}
        </div>
        {messages.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <NoMessages />
          </div>
        )}
      </div>
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
