import { type MessageDbType } from "@/types/supabase.message";
import { api } from "@/utils/api";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { errorToast } from "@/utils/toasts";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Spinner from "../_common/Spinner";
import { SidebarConversation } from "./SidebarConversation";

export type SidebarProps = {
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation) => void;
};

export default function MessagesSidebar({
  selectedConversation,
  setSelected,
}: SidebarProps) {
  // Fetch only once on mount
  const { data: fetchedConversations, isLoading } =
    api.messages.getConversations.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const conversations = useConversation((state) => state.conversationList);

  const setConversationList = useConversation(
    (state) => state.setConversationList,
  );

  useEffect(() => {
    // Check if data has been fetched and hasn't been processed yet
    if (fetchedConversations) {
      setConversationList(fetchedConversations);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedConversations]);

  const optimisticIds = useMessage((state) => state.optimisticIds);

  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );

  const { data: session } = useSession();

  // Map and listen to all the connects the user is part of
  useEffect(() => {
    const handlePostgresChange = async (payload: { new: MessageDbType }) => {
      if (!optimisticIds.includes(payload.new.id)) {
        const { data, error } = await supabase
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
            user: data,
          };

          setConversationToTop(payload.new.conversation_id, newMessage);
        }
      }
    };

    const fetchConversationIds = async () => {
      if (session) {
        const { data: conversationIds, error } = await supabase
          .from("conversation_participants")
          .select("conversation_id")
          .eq("user_id", session.user.id);

        if (error) {
          errorToast(error.message);
        } else {
          const channels = conversationIds
            // When channel is selected turn of here so it can listen in the child
            .filter(
              (conversationId) =>
                conversationId.conversation_id !== selectedConversation?.id,
            )
            .map((conversationId) =>
              supabase
                .channel(conversationId.conversation_id)
                .on(
                  "postgres_changes",
                  {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                  },
                  (payload: { new: MessageDbType }) =>
                    void handlePostgresChange(payload),
                )
                .subscribe(),
            );

          return () => {
            channels.forEach((channel) => void channel.unsubscribe());
          };
        }
      }
    };

    void fetchConversationIds();
  }, [optimisticIds, selectedConversation?.id, session, setConversationToTop]);

  return (
    <div className="w-96 border-r">
      {!isLoading ? (
        conversations && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <SidebarConversation
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              setSelected={setSelected}
            />
          ))
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">
            <p>No conversations yet</p>
          </div>
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
}
