import { api } from "@/utils/api";
import { type ChatMessageType, useMessage } from "@/utils/store/messages";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { type MessageDbType } from "@/types/supabase.message";
import supabase from "@/utils/supabase-client";
import { errorToast } from "@/utils/toasts";

export default function ListMessagesWithAdmin() {
  const { data: session } = useSession();
  const [conversationId, setConversationId] = useState<string>("");
  const [tempToken, setTempToken] = useState<string>("");
  const [tempUserId, setTempUserId] = useState<string>("");
  const {
    data: conversationIdAndTempUserId,
    refetch: refetchConversationIdAndTempUserId,
  } = api.messages.getConversationsWithAdmin.useQuery({
    userId: session?.user.id,
    sessionToken: tempToken,
  });

  useEffect(() => {
    if (!session && typeof window !== "undefined") {
      setTempToken(localStorage.getItem("tempToken") ?? "");
    }
  }, [session]);

  useEffect(() => {
    // Ensure having a valid user ID before making the call (the session is loaded or guest has tempToken)
    if (session?.user.id ?? tempToken) {
      const fetchData = () => {
        try {
          if (conversationIdAndTempUserId) {
            setConversationId(
              conversationIdAndTempUserId.conversationId as string,
            );
            setTempUserId(conversationIdAndTempUserId.tempUserId as string);
          }
        } catch (error) {
          errorToast();
        }
      };

      fetchData();
    }
  }, [conversationIdAndTempUserId, session?.user.id, tempToken]);

  const { fetchInitialMessages } = useMessage();
  void fetchInitialMessages(conversationId);
  const { conversations } = useMessage();

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );

  const optimisticIds = useMessage((state) => state.optimisticIds);
  // const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const messages = conversationId
    ? (conversations[conversationId]?.messages ?? [])
    : [];

  useEffect(() => {
    const channel = supabase
      .channel(`${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: { new: MessageDbType }) => {
          void handlePostgresChange(payload);
        },
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, messages]);

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    if (!optimisticIds.includes(payload.new.id)) {
      const newMessage: ChatMessageType = {
        id: payload.new.id,
        conversationId: payload.new.conversation_id,
        userId: payload.new.user_id ?? "",
        message: payload.new.message,
        isEdit: payload.new.is_edit,
        createdAt: payload.new.created_at,
        read: payload.new.read,
      };
      addMessageToConversation(payload.new.conversation_id, newMessage);
      // setOptimisticIds(newMessage.id)
    }
  };

  return (
    <>
      <style>
        {`
        @media (min-width: 768px) {
          /* Style the scrollbar itself (the part that moves) */
          ::-webkit-scrollbar {
            width: 12px; /* width of the entire scrollbar */
          }

          /* Style the track (part the scrollbar sits in) */
          ::-webkit-scrollbar-track {
            background: black; /* color of the track */
          }

          /* Style the handle (part of the scrollbar that indicates the scroll position) */
          ::-webkit-scrollbar-thumb {
            background-color: white; /* color of the thumb */
            border-radius: 6px; /* roundness of the edges */
            border: 3px solid black; /* Creates padding around the thumb */
          }
        }
        `}
      </style>
      {messages.length > 0 ? (
        <div className="flex w-full flex-1 flex-col-reverse gap-1 overflow-y-scroll p-3">
          {messages.map((message) =>
            message.userId === session?.user.id ||
            message.userId === tempUserId ? (
              <div className="m-1 flex flex-row-reverse p-1" key={message.id}>
                <p className="h-max max-w-[15rem] rounded-l-xl rounded-tr-xl border-none bg-[#1A84E5] px-2 py-2 text-sm text-white antialiased">
                  {message.message}
                </p>
              </div>
            ) : (
              <div className="m-1 flex place-items-end p-1" key={message.id}>
                <p className="h-max max-w-[15rem] rounded-r-xl rounded-tl-xl border-none bg-[#2E2E2E] px-2 py-2 text-sm text-background text-white antialiased">
                  {message.message}
                </p>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="flex w-full flex-1">
          <p className="m-auto flex items-center justify-center text-[#8B8B8B]">
            How can we help you?
          </p>
        </div>
      )}
    </>
  );
}
